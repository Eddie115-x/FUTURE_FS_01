// Script to create a Supabase user with password, mark email as confirmed, and insert into users table as admin
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
// Try to load from the specific path
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Log the actual environment variables being used (without revealing full keys)
if (process.env.SUPABASE_URL) {
  console.log('SUPABASE_URL found:', process.env.SUPABASE_URL);
}

if (process.env.SUPABASE_SERVICE_KEY) {
  const key = process.env.SUPABASE_SERVICE_KEY;
  console.log('SUPABASE_SERVICE_KEY found:', key.substring(0, 10) + '...' + key.substring(key.length - 5));
} else {
  // Try loading from the root directory as fallback
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  console.log('Attempted to load from root directory as fallback');
}

// Check if environment variables are available
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Error: Missing required environment variables');
  console.error('Current environment variables:');
  console.error('- SUPABASE_URL:', process.env.SUPABASE_URL ? '✓' : '✗');
  console.error('- SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✓' : '✗');
  console.error('Please make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in server/.env');
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function createAdminUser(email, password, username) {
  try {
    if (!email || !password || !username) {
      console.error('Error: Email, password, and username are all required');
      return;
    }
    
    if (password.length < 8) {
      console.error('Error: Password must be at least 8 characters long');
      return;
    }
    
    console.log('Creating user with email:', email);
    
    // Create the user and mark email as confirmed
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Mark email as confirmed, no verification needed
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }
    
    const userId = data.user.id;
    console.log('✓ User created successfully in Auth system');
    console.log('✓ Email confirmed automatically');
    console.log('✓ User ID:', userId);

    // Insert into users table with admin role
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        username,
        email,
        role: 'admin'
      });

    if (insertError) {
      console.error('Error inserting into users table:', insertError.message);
      
      // Cleanup: Delete the auth user if we failed to insert into users table
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteError) {
        console.error('Error cleaning up auth user after table insert failure:', deleteError.message);
      }
      
      return;
    }
    
    console.log('✓ Admin user inserted into users table');
    console.log('----------------------------------------');
    console.log('SUCCESS! Admin user created:');
    console.log('- Email:', email);
    console.log('- Username:', username);
    console.log('- Role: admin');
    console.log('----------------------------------------');
    console.log('You can now log in with these credentials at the login page.');
  } catch (err) {
    console.error('Unexpected error creating admin user:', err.message);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const [email = 'adrianobadiah4@gmail.com', password, username = 'adrian'] = args;

if (!password) {
  console.log('----------------------------------------');
  console.log('ADMIN USER CREATION TOOL');
  console.log('----------------------------------------');
  console.log('Usage: node adminCreateUser.js [email] [password] [username]');
  console.log('Example: node adminCreateUser.js admin@example.com StrongPassword123 adminuser');
  console.log('\nNote: Email defaults to adrianobadiah4@gmail.com if not provided');
  console.log('      Username defaults to "adrian" if not provided');
  console.log('      Password is required and must be at least 8 characters');
  process.exit(1);
}

console.log('Creating admin user...');
createAdminUser(email, password, username);
