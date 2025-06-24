// api/contact.js - Vercel serverless function for contact form
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
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
    const { error } = await supabase
      .from('contacts')
      .insert([{ name, email, subject, message, read: false }]);
      
    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    // Send email notifications
    try {
      // Admin notification
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
      
      // User confirmation
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
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue execution even if email fails
    }

    return res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
