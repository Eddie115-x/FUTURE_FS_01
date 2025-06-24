const supabase = require('../config/supabase');

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Get user profile data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      return res.status(500).json({ message: 'Error fetching user data' });
    }

    res.status(200).json({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      token: authData.session.access_token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    // Create user profile in our 'users' table
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        username,
        email,
        role: 'user' // Default role
      })
      .select()
      .single();

    if (userError) {
      // If there's an error creating the user profile, clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ message: 'Error creating user profile' });
    }

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      token: authData.session?.access_token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.status(200).json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.user.id;
    
    // Update data object
    const updateData = {};
    if (username) updateData.username = username;
    
    // Update user profile in users table
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);
        
      if (updateError) {
        throw new Error(updateError.message);
      }
    }
    
    // Update email/password if provided
    if (email || password) {
      const updateAuthData = {};
      if (email) updateAuthData.email = email;
      if (password) updateAuthData.password = password;
      
      const { error: updateAuthError } = await supabase.auth.updateUser(updateAuthData);
      
      if (updateAuthError) {
        throw new Error(updateAuthError.message);
      }
    }
    
    // Get updated user profile
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (getUserError) {
      throw new Error(getUserError.message);
    }
    
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  login,
  register,
  getUserProfile,
  updateUserProfile
};
