const supabase = require('./config/supabase');

// Main function to initialize database
async function setupDatabase() {
  console.log('Checking database setup...');
  
  try {
    // Check contacts table
    await setupContactsTable();
    
    console.log('Database setup complete');
  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

// Function to check and create contacts table
async function setupContactsTable() {
  console.log('Checking contacts table...');
  
  try {
    // Try to query the contacts table
    const { error } = await supabase
      .from('contacts')
      .select('id')
      .limit(1);
    
    // If error contains "relation does not exist", the table is missing
    if (error && error.message.includes('does not exist')) {
      console.log('Creating contacts table...');
      
      // Use SQL to create the table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS contacts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            read BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (createError) {
        console.error('Error creating contacts table:', createError);
        throw createError;
      }
      
      console.log('Contacts table created successfully');
    } else {
      console.log('Contacts table exists');
    }
  } catch (error) {
    console.error('Error setting up contacts table:', error);
    throw error;
  }
}

module.exports = { setupDatabase };
