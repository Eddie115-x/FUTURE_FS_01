import { useEffect, useState } from 'react';
import { FaBlog, FaEnvelope, FaHistory, FaProjectDiagram } from 'react-icons/fa';
import BlogManager from '../components/admin/BlogManager';
import ChangelogManager from '../components/admin/ChangelogManager';
import MessageManager from '../components/admin/MessageManager';
import ProjectManager from '../components/admin/ProjectManager';
import supabase from '../supabase';
import './Admin.css';

function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('projects');

  // Check user's session on component mount
  useEffect(() => {
    const getSession = async () => {
      try {
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        setSession(data.session);
        setLoading(false);

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        // Clean up auth listener on unmount
        return () => {
          if (authListener?.subscription) {
            authListener.subscription.unsubscribe();
          }
        };
      } catch (error) {
        console.error('Auth error:', error);
        setLoading(false);
      }
    };

    getSession();
  }, []);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setLoginError(error.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login. Please try again.');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Note: All authenticated users are considered admins for now
  // Additional role checks could be implemented here if needed

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  // If not logged in, show login form
  if (!session) {
    return (
      <div className="admin-container">
        <h1>Admin Login</h1>
        
        <form className="admin-login-form" onSubmit={handleLogin}>
          {loginError && <p className="login-error">{loginError}</p>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">Admin Panel</div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FaProjectDiagram /> Projects
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => setActiveTab('blog')}
          >
            <FaBlog /> Blog Posts
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'changelog' ? 'active' : ''}`}
            onClick={() => setActiveTab('changelog')}
          >
            <FaHistory /> Changelog
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <FaEnvelope /> Contact Messages
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <header className="admin-header">
          <h1>
            {activeTab === 'projects' && 'Manage Projects'}
            {activeTab === 'blog' && 'Manage Blog Posts'}
            {activeTab === 'changelog' && 'Manage Changelog'}
            {activeTab === 'messages' && 'Contact Messages'}
          </h1>
          <div className="admin-user">
            {session.user.email}
          </div>
        </header>
        
        <main className="admin-main">
          {activeTab === 'projects' && <ProjectManager />}
          {activeTab === 'blog' && <BlogManager />}
          {activeTab === 'changelog' && <ChangelogManager />}
          {activeTab === 'messages' && <MessageManager />}
        </main>
      </div>
    </div>
  );
}

export default Admin;
