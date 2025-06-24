const supabase = require('../config/supabase');
const slugify = require('slugify');

// Helper function to generate slug
const generateSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
};

// Get all published blog posts
const getPublishedPosts = async (req, res) => {
  try {
    const { data: posts, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:author_id (
          id,
          username
        )
      `)
      .eq('published', true)
      .order('publish_date', { ascending: false });
      
    if (error) throw error;
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all blog posts (including drafts) - admin only
const getAllPosts = async (req, res) => {
  try {
    const { data: posts, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:author_id (
          id,
          username
        )
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single blog post by slug
const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const { data: post, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:author_id (
          id,
          username
        )
      `)
      .eq('slug', slug)
      .single();
    
    if (error || !post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new blog post
const createPost = async (req, res) => {
  try {
    const { title, content, summary, coverImage, tags, published } = req.body;
    const authorId = req.user.id; // From auth middleware
    
    // Generate slug from title
    const slug = generateSlug(title);
    
    // Check if slug already exists
    const { data: existingPost, error: slugCheckError } = await supabase
      .from('blogs')
      .select('slug')
      .eq('slug', slug)
      .single();
      
    if (slugCheckError && slugCheckError.code !== 'PGRST116') {
      throw slugCheckError;
    }
    
    if (existingPost) {
      return res.status(400).json({ message: 'A blog post with this title already exists.' });
    }
    
    // Create new blog post
    const { data: newPost, error } = await supabase
      .from('blogs')
      .insert({
        title,
        content,
        summary,
        cover_image: coverImage || '',
        author_id: authorId,
        tags: tags || [],
        published: published || false,
        publish_date: published ? new Date() : null,
        slug
      })
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing blog post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, summary, coverImage, tags, published } = req.body;
    
    // Check if post exists
    const { data: existingPost, error: fetchError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError || !existingPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Prepare update data
    const updateData = {};
    if (title) {
      updateData.title = title;
      // Only generate new slug if title changed
      if (title !== existingPost.title) {
        updateData.slug = generateSlug(title);
      }
    }
    if (content !== undefined) updateData.content = content;
    if (summary !== undefined) updateData.summary = summary;
    if (coverImage !== undefined) updateData.cover_image = coverImage;
    if (tags !== undefined) updateData.tags = tags;
    if (published !== undefined) {
      updateData.published = published;
      // Update publish date if publishing for first time
      if (published && !existingPost.published) {
        updateData.publish_date = new Date();
      }
    }
    
    // Update post
    const { data: updatedPost, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a blog post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPublishedPosts,
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
};
