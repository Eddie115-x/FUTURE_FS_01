const supabase = require('../config/supabase');
const { Resend } = require('resend');

// Configure Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Submit contact form
const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Save message to Supabase database
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        { 
          name, 
          email, 
          subject, 
          message,
          status: 'unread'
        }
      ]);
      
    if (error) throw error;
    
    // Send email notification to admin
    await resend.emails.send({
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
    
    // Send confirmation email to sender
    await resend.emails.send({
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
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.' 
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
