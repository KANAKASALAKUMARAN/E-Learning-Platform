const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testNewAdmin() {
  console.log('🔍 Testing new admin route...\n');

  try {
    // Test the new admin creation route
    console.log('Testing POST /api/users/create-test-admin...');
    const adminUser = {
      fullName: 'Test Admin User',
      email: `testadmin_${Date.now()}@example.com`,
      password: 'admin123'
    };
    
    const adminResponse = await axios.post(`${API_BASE}/users/create-test-admin`, adminUser);
    console.log('✅ Admin creation successful!');
    console.log(`   Admin ID: ${adminResponse.data._id}`);
    console.log(`   Name: ${adminResponse.data.fullName}`);
    console.log(`   Email: ${adminResponse.data.email}`);
    console.log(`   Role: ${adminResponse.data.role}`);
    console.log(`   Token: ${adminResponse.data.token ? 'Generated' : 'Not generated'}`);

    return adminResponse.data;

  } catch (error) {
    console.error('❌ Admin creation failed:', error.response?.data || error.message);
    return null;
  }
}

testNewAdmin();
