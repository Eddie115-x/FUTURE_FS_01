import { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';
import slugify from 'slugify';
import supabase from '../../supabase';
import './BlogManager.css';

const BlogManager = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [currentPost, setCurrentPost] = useState({
    id: null,
    title: '',
    content: '',
    summary: '',
    featured_image: '',
    published: false,
    publish_date: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      
      // Check if table exists first
      const { error: tableError } = await supabase
        .from('blog_posts')
        .select('count')
        .limit(1);
      
      if (tableError) {
        if (tableError.code === '42P01') { // PostgreSQL error code for undefined_table
          setError(
            'The blog_posts table does not exist yet. Please run the SQL setup script from server/config/supabase-setup.sql in your Supabase SQL editor.'
          );
          setBlogPosts([]);
          return;
        }
        throw tableError;
      }
      
      // If table exists, fetch posts
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError(
        'Failed to fetch blog posts. Please check your Supabase configuration and ensure the database tables are set up correctly.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost({ ...currentPost, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCurrentPost({ ...currentPost, [name]: checked });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = currentPost.featured_image;
      
      // If there's a new file, upload it to Supabase Storage
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `blog/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }
      
      // Create a slug from the title
      const slug = slugify(currentPost.title, {
        lower: true,
        strict: true
      });
      
      const postData = {
        title: currentPost.title,
        slug,
        content: currentPost.content,
        summary: currentPost.summary,
        featured_image: imageUrl,
        published: currentPost.published,
        publish_date: currentPost.published ? new Date().toISOString() : null
      };
      
      let result;
      if (isEditing) {
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', currentPost.id);
      } else {
        result = await supabase
          .from('blog_posts')
          .insert([postData]);
      }
      
      if (result.error) throw result.error;
      
      resetForm();
      fetchBlogPosts();
      
    } catch (error) {
      console.error('Error saving blog post:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (post) => {
    setCurrentPost({
      ...post,
      publish_date: post.publish_date ? new Date(post.publish_date).toISOString().split('T')[0] : ''
    });
    setIsEditing(true);
    
    if (post.featured_image) {
      setFilePreview(post.featured_image);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        fetchBlogPosts();
      } catch (error) {
        console.error('Error deleting blog post:', error);
        setError(error.message);
      }
    }
  };

  const togglePublish = async (post) => {
    try {
      const updatedPost = {
        published: !post.published,
        publish_date: !post.published ? new Date().toISOString() : null
      };
      
      const { error } = await supabase
        .from('blog_posts')
        .update(updatedPost)
        .eq('id', post.id);
      
      if (error) throw error;
      
      fetchBlogPosts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      setError(error.message);
    }
  };

  const resetForm = () => {
    setCurrentPost({
      id: null,
      title: '',
      content: '',
      summary: '',
      featured_image: '',
      published: false,
      publish_date: ''
    });
    setIsEditing(false);
    setFile(null);
    setFilePreview(null);
  };

  if (loading) return <div>Loading blog posts...</div>;

  return (
    <div className="blog-manager">
      <h2>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
      
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
      
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={currentPost.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            name="summary"
            value={currentPost.summary}
            onChange={handleInputChange}
            rows={2}
            placeholder="A brief summary of the blog post"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={currentPost.content}
            onChange={handleInputChange}
            required
            rows={10}
          />
        </div>
        
        <div className="form-group file-upload">
          <label htmlFor="image">Featured Image</label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
          />
          {filePreview && (
            <div className="image-preview">
              <img src={filePreview} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="published"
              checked={currentPost.published}
              onChange={handleCheckboxChange}
            />
            Publish Now
          </label>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
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
      
      <h2>Your Blog Posts</h2>
      <div className="blog-posts-list">
        {blogPosts.length === 0 ? (
          <p>No blog posts yet. Create your first post!</p>
        ) : (
          blogPosts.map(post => (
            <div key={post.id} className="blog-post-card">
              <div className="blog-post-header">
                <h3>{post.title}</h3>
                <div className={`post-status ${post.published ? 'published' : 'draft'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </div>
              </div>
              
              <div className="blog-post-content">
                {post.featured_image && (
                  <div className="blog-image">
                    <img src={post.featured_image} alt={post.title} />
                  </div>
                )}
                <div className="blog-post-details">
                  <p className="blog-date">
                    {post.published 
                      ? `Published on: ${new Date(post.publish_date).toLocaleDateString()}` 
                      : `Created: ${new Date(post.created_at).toLocaleDateString()}`}
                  </p>
                  <p className="blog-summary">{post.summary || post.content.substring(0, 100) + '...'}</p>
                </div>
              </div>
              
              <div className="blog-post-actions">
                <button 
                  onClick={() => handleEdit(post)}
                  className="btn btn-edit"
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  onClick={() => togglePublish(post)}
                  className="btn btn-publish"
                >
                  {post.published ? <FaEyeSlash /> : <FaEye />} 
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
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

export default BlogManager;
