const axios = require('axios');

// Simple script to test token refresh functionality
async function testTokenRefresh() {
  const baseURL = 'http://localhost:3001/api';
  
  try {
    console.log('🔐 Testing token refresh functionality...\n');
    
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@example.com',
      password: 'Admin123!'
    });
    
    const { accessToken, refreshToken } = loginResponse.data;
    console.log('✅ Login successful');
    console.log(`   Access token: ${accessToken.substring(0, 20)}...`);
    console.log(`   Refresh token: ${refreshToken.substring(0, 20)}...\n`);
    
    // Step 2: Test /auth/me with valid token
    console.log('2. Testing /auth/me with valid token...');
    const meResponse = await axios.get(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✅ /auth/me successful');
    console.log(`   User: ${meResponse.data.email}\n`);
    
    // Step 3: Test token refresh
    console.log('3. Testing token refresh...');
    const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
      refreshToken: refreshToken
    });
    
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
    console.log('✅ Token refresh successful');
    console.log(`   New access token: ${newAccessToken.substring(0, 20)}...`);
    console.log(`   New refresh token: ${newRefreshToken.substring(0, 20)}...\n`);
    
    // Step 4: Test /auth/me with new token
    console.log('4. Testing /auth/me with new token...');
    const meResponse2 = await axios.get(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${newAccessToken}` }
    });
    console.log('✅ /auth/me with new token successful');
    console.log(`   User: ${meResponse2.data.email}\n`);
    
    // Step 5: Test cleanup endpoint (admin only)
    console.log('5. Testing token cleanup...');
    const cleanupResponse = await axios.post(`${baseURL}/auth/cleanup-tokens`, {}, {
      headers: { Authorization: `Bearer ${newAccessToken}` }
    });
    console.log('✅ Token cleanup successful');
    console.log(`   Cleaned tokens: ${cleanupResponse.data.cleaned}\n`);
    
    console.log('🎉 All tests passed! Token refresh is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('   This might be expected if testing with expired tokens');
    }
  }
}

// Run the test
testTokenRefresh();
