const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// Create a transporter
const transporter = nodemailer.createTransport({
  // Configure your email service provider here
  // For example, if using Gmail:
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Submit contact form
const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Save message to database
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });
    
    await newContact.save();
    
    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Your email to receive notifications
      subject: `New Contact Form: ${subject}`,
      html: `
        <h3>New message from ${name}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };
    
    await transporter.sendMail(mailOptions);
    
    // Send confirmation email to sender
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for reaching out to me. I've received your message and will get back to you as soon as possible.</p>
        <p>Your message:</p>
        <p><em>${message}</em></p>
        <p>Best regards,<br>Adrian</p>
      `,
    };
    
    await transporter.sendMail(confirmationMailOptions);
    
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
    const messages = await Contact.find({}).sort({ createdAt: -1 });
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
    
    const message = await Contact.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (read !== undefined) message.read = read;
    if (responded !== undefined) message.responded = responded;
    
    await message.save();
    
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
    await Contact.findByIdAndDelete(id);
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
