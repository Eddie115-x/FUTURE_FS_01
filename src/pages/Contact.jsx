import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };    const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        setFormStatus({
          submitted: true,
          error: false,
          message: 'Thank you for your message! I will get back to you soon.'
        });
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setFormStatus({ 
          submitted: true, 
          error: true, 
          message: data.message || 'An error occurred. Please try again.'
        });
      }    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Check if server is unreachable
      if (!window.navigator.onLine || error.message.includes('Failed to fetch')) {
        setFormStatus({
          submitted: true,
          error: true,
          message: 'Cannot connect to server. Please check your internet connection or try again later.'
        });
        return;
      }
      
      setFormStatus({ 
        submitted: true, 
        error: true, 
        message: 'Network error. Please check your connection and try again.'
      });
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Me</h1>
      <p className="contact-intro">Have a question or want to work together? Feel free to reach out!</p>
      
      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-item">
            <h3>EMAIL</h3>
            <p>adrianobadiah4@gmail.com</p>
          </div>
          
          <div className="contact-item">
            <h3>LOCATION</h3>
            <p>Suva, Fiji  Honiara, Solomon Islands</p>
          </div>
          
          <div className="contact-item">
            <h3>Social</h3>
            <div className="contact-social">
              <a href="https://github.com/Eddie115-x" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="www.linkedin.com/in/adrian-obadiah" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className="contact-form">
          {formStatus.submitted ? (
            <div className={`form-status ${formStatus.error ? 'error' : 'success'}`}>
              {formStatus.message}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows="5" 
                  required 
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
