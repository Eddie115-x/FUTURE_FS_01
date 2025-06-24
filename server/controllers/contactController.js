const supabase = require('../config/supabase');
const { Resend } = require('resend');

// Configure Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to ensure contacts table exists with the right schema
const ensureContactsTable = async () => {
  try {
    console.log('Checking contacts table structure...');
    
    // Check if contacts table exists
    const { error: checkError, count } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });
    
    if (checkError && checkError.message.includes('relation "contacts" does not exist')) {
      console.log('Contacts table does not exist, creating it...');
      
      // Create table using SQL
      const { error: createError } = await supabase.rpc('create_contacts_table', {});
      
      if (createError) {
        console.error('Error creating contacts table:', createError);
        
        // If RPC fails, try direct SQL (requires more permissions)
        const sqlQuery = `
          CREATE TABLE IF NOT EXISTS contacts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL, 
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            read BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        
        // Execute SQL (this requires database admin permissions)
        // This is a fallback and may not work with regular service role
        await supabase.rpc('exec_sql', { sql: sqlQuery });
      }
    } else {
      console.log('Contacts table exists');
    }
  } catch (error) {
    console.error('Error setting up contacts table:', error);
  }
};

// Call this on server startup
ensureContactsTable();

// Submit contact form
const submitContactForm = async (req, res) => {
  try {
    console.log('Contact form submission received:', req.body);
    
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    console.log('Saving to Supabase...');
    
    // Save message to Supabase database
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          { 
            name, 
            email, 
            subject, 
            message,
            read: false
          }
        ]);
        
      if (error) {
        console.error('Supabase insert error:', error);
        
        // If the table doesn't exist, try to create it
        if (error.message.includes('does not exist')) {
          console.log('Trying to create contacts table and retry...');
          await ensureContactsTable();
          
          // Retry the insert
          const { retryError } = await supabase
            .from('contacts')
            .insert([
              { 
                name, 
                email, 
                subject, 
                message,
                read: false
              }
            ]);
            
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with email sending even if database fails
    }
    
    console.log('Successfully saved to database');
    
    // Send email notification to admin
    try {
      console.log('Sending admin notification email...');
      const adminEmail = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form: ${subject}`,
        html: `
          <h3>New message from ${name}</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });
      console.log('Admin email sent:', adminEmail.id);
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Continue execution even if email fails
    }
    
    // Send confirmation email to sender
    try {
      console.log('Sending confirmation email to user...');
      const userEmail = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Thank you for contacting me!',
        html: `
          <h3>Hello ${name},</h3>
          <p>Thank you for reaching out to me. I've received your message and will get back to you as soon as possible.</p>
          <p>Your message:</p>
          <p><em>${message}</em></p>
          <p>Best regards,<br>Adrian</p>
        `
      });
      console.log('User confirmation email sent:', userEmail.id);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue execution even if email fails
    }
    
    console.log('Contact submission successful');
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all contact messages (admin only)
const getContactMessages = async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark message as read/responded
const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { read, responded } = req.body;
    
    const updateData = {};
    if (read !== undefined) updateData.read = read;
    if (responded !== undefined) updateData.responded = responded;
    
    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitContactForm,
  getContactMessages,
  updateMessageStatus,
  deleteMessage
};
