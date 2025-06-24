import { useEffect, useState } from 'react';
import { FaCopy, FaEnvelope, FaEnvelopeOpen, FaReply, FaTrash } from 'react-icons/fa';
import supabase from '../../supabase';
import './MessageManager.css';

const MessageManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Error message displayed in UI when needed
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'
  
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Check if table exists first
      const { error: tableError } = await supabase
        .from('contact_messages')
        .select('count')
        .limit(1);
      
      if (tableError) {
        if (tableError.code === '42P01') { // PostgreSQL error code for undefined_table
          setError(
            'The contact_messages table does not exist yet. Please run the SQL setup script from server/config/supabase-setup.sql in your Supabase SQL editor.'
          );
          setMessages([]);
          return;
        }
        throw tableError;
      }
      
      // If table exists, fetch messages
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(
        'Failed to fetch contact messages. Please check your Supabase configuration and ensure the database tables are set up correctly.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, currentReadStatus) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: !currentReadStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: !currentReadStatus } : msg
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read: !currentReadStatus });
      }
    } catch (error) {
      console.error('Error updating message read status:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setMessages(messages.filter(msg => msg.id !== id));
        
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        setError(error.message);
      }
    }
  };

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    
    // Mark as read when opened if not already read
    if (!message.read) {
      await handleMarkAsRead(message.id, false);
    }
  };

  const handleCloseMessage = () => {
    setSelectedMessage(null);
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        alert('Email copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy email:', err);
      });
  };

  const composeEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const filteredMessages = filter === 'all'
    ? messages
    : filter === 'read'
      ? messages.filter(msg => msg.read)
      : messages.filter(msg => !msg.read);

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="message-manager">
      {error && (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          {error.includes('table does not exist') && (
            <div className="setup-instructions">
              <h4>Setup Instructions:</h4>
              <ol>
                <li>Open your Supabase project dashboard</li>
                <li>Go to the SQL Editor</li>
                <li>Copy the contents of <code>server/config/supabase-setup.sql</code></li>
                <li>Paste and run the SQL script in the Supabase SQL Editor</li>
                <li>Return to this page and refresh</li>
              </ol>
            </div>
          )}
        </div>
      )}
      <div className="message-sidebar">
        <div className="message-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Messages ({messages.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({messages.filter(msg => !msg.read).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({messages.filter(msg => msg.read).length})
          </button>
        </div>
        
        <div className="message-list">
          {filteredMessages.length === 0 ? (
            <p className="no-messages">No messages found.</p>
          ) : (
            filteredMessages.map(message => (
              <div 
                key={message.id} 
                className={`message-item ${message.read ? 'read' : 'unread'} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                onClick={() => handleSelectMessage(message)}
              >
                <div className="message-status">
                  {message.read ? <FaEnvelopeOpen /> : <FaEnvelope />}
                </div>
                <div className="message-preview">
                  <div className="message-sender">{message.name}</div>
                  <div className="message-date">
                    {new Date(message.created_at).toLocaleDateString()}
                  </div>
                  <div className="message-excerpt">
                    {message.message.substring(0, 60)}...
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="message-content">
        {selectedMessage ? (
          <>
            <div className="message-header">
              <h3>{selectedMessage.name}</h3>
              <div className="message-actions">
                <button
                  className="btn btn-icon"
                  onClick={() => handleMarkAsRead(selectedMessage.id, selectedMessage.read)}
                  title={selectedMessage.read ? "Mark as unread" : "Mark as read"}
                >
                  {selectedMessage.read ? <FaEnvelopeOpen /> : <FaEnvelope />}
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => composeEmail(selectedMessage.email)}
                  title="Reply"
                >
                  <FaReply />
                </button>
                <button
                  className="btn btn-icon"
                  onClick={() => handleCopyEmail(selectedMessage.email)}
                  title="Copy email"
                >
                  <FaCopy />
                </button>
                <button
                  className="btn btn-icon btn-delete"
                  onClick={() => handleDelete(selectedMessage.id)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            
            <div className="message-info">
              <div>
                <strong>From:</strong> {selectedMessage.name} (<a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>)
              </div>
              <div>
                <strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}
              </div>
            </div>
            
            <div className="message-body">
              {selectedMessage.message.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            
            <div className="message-footer">
              <button className="btn btn-secondary" onClick={handleCloseMessage}>
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="no-message-selected">
            <FaEnvelope size={50} opacity={0.3} />
            <h3>Select a message to view</h3>
            <p>Click on a message from the list to view its contents.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageManager;
