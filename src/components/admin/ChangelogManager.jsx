import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import supabase from '../../supabase';
import './ChangelogManager.css';

const ChangelogManager = () => {
  const [changelog, setChangelog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [currentEntry, setCurrentEntry] = useState({
    id: null,
    version: '',
    release_date: new Date().toISOString().split('T')[0],
    features: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchChangelog();
  }, []);

  const fetchChangelog = async () => {
    try {
      setLoading(true);
      
      // Check if table exists first
      const { error: tableError } = await supabase
        .from('changelog')
        .select('count')
        .limit(1);
      
      if (tableError) {
        if (tableError.code === '42P01') { // PostgreSQL error code for undefined_table
          setError(
            'The changelog table does not exist yet. Please run the SQL setup script from server/config/supabase-setup.sql in your Supabase SQL editor.'
          );
          setChangelog([]);
          return;
        }
        throw tableError;
      }
      
      // If table exists, fetch changelog entries
      const { data, error } = await supabase
        .from('changelog')
        .select('*')
        .order('release_date', { ascending: false });
      
      if (error) throw error;
      setChangelog(data || []);
    } catch (error) {
      console.error('Error fetching changelog:', error);
      setError(
        'Failed to fetch changelog entries. Please check your Supabase configuration and ensure the database tables are set up correctly.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry({ ...currentEntry, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Parse features from text area to JSON object
      // Format expected: Key Feature Category: feature1, feature2; Another Category: feature3, feature4
      const featuresText = currentEntry.features;
      const features = {};
      
      featuresText.split(';').forEach(categoryStr => {
        const trimmedStr = categoryStr.trim();
        if (trimmedStr) {
          const [category, itemsStr] = trimmedStr.split(':');
          if (category && itemsStr) {
            features[category.trim()] = itemsStr
              .split(',')
              .map(item => item.trim())
              .filter(Boolean);
          }
        }
      });
      
      const entryData = {
        version: currentEntry.version,
        release_date: new Date(currentEntry.release_date).toISOString(),
        features
      };
      
      let result;
      if (isEditing) {
        result = await supabase
          .from('changelog')
          .update(entryData)
          .eq('id', currentEntry.id);
      } else {
        result = await supabase
          .from('changelog')
          .insert([entryData]);
      }
      
      if (result.error) throw result.error;
      
      resetForm();
      fetchChangelog();
      
    } catch (error) {
      console.error('Error saving changelog entry:', error);
      setError(error.message);
    }
  };

  const handleEdit = (entry) => {
    // Convert features JSON to text format for editing
    let featuresText = '';
    
    Object.entries(entry.features).forEach(([category, items], index) => {
      featuresText += `${category}: ${items.join(', ')}`;
      if (index < Object.entries(entry.features).length - 1) {
        featuresText += '; ';
      }
    });
    
    setCurrentEntry({
      id: entry.id,
      version: entry.version,
      release_date: new Date(entry.release_date).toISOString().split('T')[0],
      features: featuresText
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this changelog entry?')) {
      try {
        const { error } = await supabase
          .from('changelog')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        fetchChangelog();
      } catch (error) {
        console.error('Error deleting changelog entry:', error);
        setError(error.message);
      }
    }
  };

  const resetForm = () => {
    setCurrentEntry({
      id: null,
      version: '',
      release_date: new Date().toISOString().split('T')[0],
      features: ''
    });
    setIsEditing(false);
  };

  const formatFeatures = (features) => {
    return Object.entries(features).map(([category, items]) => (
      <div key={category} className="feature-category">
        <h4>{category}</h4>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    ));
  };

  if (loading) return <div>Loading changelog...</div>;

  return (
    <div className="changelog-manager">
      <h2>{isEditing ? 'Edit Changelog Entry' : 'Add New Changelog Entry'}</h2>
      
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
      
      <form onSubmit={handleSubmit} className="changelog-form">
        <div className="form-group">
          <label htmlFor="version">Version Number</label>
          <input
            type="text"
            id="version"
            name="version"
            value={currentEntry.version}
            onChange={handleInputChange}
            placeholder="e.g., 1.0, 2.1.5"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="release_date">Release Date</label>
          <input
            type="date"
            id="release_date"
            name="release_date"
            value={currentEntry.release_date}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="features">Features</label>
          <textarea
            id="features"
            name="features"
            value={currentEntry.features}
            onChange={handleInputChange}
            rows={10}
            placeholder="Format: Category: Feature 1, Feature 2; Another Category: Feature 3, Feature 4"
            required
          />
          <small className="help-text">
            Separate categories with semicolons (;) and features with commas (,).
            <br />
            Example: <code>Core Features: Login System, Profile Management; UI Updates: Dark Mode, Responsive Design</code>
          </small>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            {isEditing ? 'Update Entry' : 'Add Entry'}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <h2>Changelog History</h2>
      <div className="changelog-list">
        {changelog.length === 0 ? (
          <p>No changelog entries yet. Create your first entry!</p>
        ) : (
          changelog.map(entry => (
            <div key={entry.id} className="changelog-card">
              <div className="changelog-header">
                <h3>Version {entry.version}</h3>
                <div className="release-date">
                  Released: {new Date(entry.release_date).toLocaleDateString()}
                </div>
              </div>
              
              <div className="changelog-content">
                {formatFeatures(entry.features)}
              </div>
              
              <div className="changelog-actions">
                <button 
                  onClick={() => handleEdit(entry)}
                  className="btn btn-edit"
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(entry.id)}
                  className="btn btn-delete"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChangelogManager;
