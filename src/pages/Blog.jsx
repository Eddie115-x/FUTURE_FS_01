import { useEffect, useState } from "react";
import supabase from "../supabase";
import "./Blog.css";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch only published posts
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('publish_date', { ascending: false });
        
        if (error) throw error;
        
        setBlogPosts(data || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to truncate text if needed
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="blog-container">
      <h1>ARTICLES</h1>
      
      <p className="blog-intro">
        Explore my latest thoughts, tutorials, and insights on web development, programming, and technology.
      </p>

      {loading && (
        <div className="blog-loading">
          <div className="loading-spinner"></div>
          <p>Loading articles...</p>
        </div>
      )}

      {error && (
        <div className="blog-error">
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && blogPosts.length === 0 && (
        <div className="blog-posts-placeholder">
          <h2>No Articles Yet</h2>
          <p>Check back soon for new content!</p>
        </div>
      )}

      {!loading && !error && blogPosts.length > 0 && (
        <div className="blog-posts-grid">
          {blogPosts.map(post => (
            <article key={post.id} className="blog-post-card">
              {post.featured_image && (
                <div className="blog-post-image">
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    loading="lazy" 
                  />
                </div>
              )}
              <div className="blog-post-content">
                <h2 className="blog-post-title">{post.title}</h2>
                <p className="blog-post-date">{formatDate(post.publish_date || post.created_at)}</p>
                <p className="blog-post-summary">
                  {post.summary ? truncateText(post.summary, 200) : truncateText(post.content, 200)}
                </p>
                <a href={`/blog/${post.slug}`} className="blog-post-link">
                  Read More
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
