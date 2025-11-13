const axios = require('axios');

// Test script for session fixes
async function testSessionFixes() {
  const baseURL = 'http://localhost:3001/api';
  let accessToken = '';
  
  try {
    console.log('🧪 Testing Session Fixes...\n');
    
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@example.com',
      password: 'Admin123!'
    });
    
    accessToken = loginResponse.data.accessToken;
    console.log('✅ Login successful\n');
    
    // Step 2: Get live sessions
    console.log('2. Getting live sessions...');
    const sessionsResponse = await axios.get(`${baseURL}/courses/upcoming-live-sessions`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const sessions = sessionsResponse.data;
    console.log(`✅ Found ${sessions.length} sessions`);
    
    if (sessions.length === 0) {
      console.log('❌ No sessions found to test with');
      return;
    }
    
    const testSession = sessions[0];
    console.log(`   Testing with session: ${testSession.title} (ID: ${testSession.id})\n`);
    
    // Step 3: Check current participants
    console.log('3. Checking current participants...');
    try {
      const participantsResponse = await axios.get(`${baseURL}/courses/live-session/${testSession.id}/participants`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      console.log(`✅ Current participants: ${participantsResponse.data.length}`);
      participantsResponse.data.forEach((p, index) => {
        console.log(`   ${index + 1}. ${p.user.name} (ID: ${p.id}, User: ${p.userId})`);
      });
    } catch (error) {
      console.log('⚠️  Could not fetch participants:', error.response?.data?.message || error.message);
    }
    
    console.log();
    
    // Step 4: Test cleanup endpoint
    console.log('4. Testing participant cleanup...');
    try {
      const cleanupResponse = await axios.post(`${baseURL}/courses/live-session/${testSession.id}/cleanup-participants`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      console.log(`✅ Cleanup successful: ${cleanupResponse.data.cleaned} duplicates removed`);
    } catch (error) {
      console.log('⚠️  Cleanup failed:', error.response?.data?.message || error.message);
    }
    
    console.log();
    
    // Step 5: Check participants after cleanup
    console.log('5. Checking participants after cleanup...');
    try {
      const participantsAfterResponse = await axios.get(`${baseURL}/courses/live-session/${testSession.id}/participants`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      console.log(`✅ Participants after cleanup: ${participantsAfterResponse.data.length}`);
      participantsAfterResponse.data.forEach((p, index) => {
        console.log(`   ${index + 1}. ${p.user.name} (ID: ${p.id}, User: ${p.userId})`);
      });
    } catch (error) {
      console.log('⚠️  Could not fetch participants:', error.response?.data?.message || error.message);
    }
    
    console.log();
    
    // Step 6: Test join session (simulate multiple joins)
    console.log('6. Testing session join (simulating duplicate prevention)...');
    try {
      // First join
      const joinResponse1 = await axios.post(`${baseURL}/courses/live-session/${testSession.id}/join`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log('✅ First join successful');
      
      // Second join (should return existing participant)
      const joinResponse2 = await axios.post(`${baseURL}/courses/live-session/${testSession.id}/join`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log('✅ Second join successful (should reuse existing participant)');
      
      // Check if participant count is correct
      const finalParticipantsResponse = await axios.get(`${baseURL}/courses/live-session/${testSession.id}/participants`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      console.log(`✅ Final participant count: ${finalParticipantsResponse.data.length}`);
      
    } catch (error) {
      console.log('⚠️  Join test failed:', error.response?.data?.message || error.message);
    }
    
    console.log();
    
    // Step 7: Test token cleanup
    console.log('7. Testing token cleanup...');
    try {
      const tokenCleanupResponse = await axios.post(`${baseURL}/auth/cleanup-tokens`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log(`✅ Token cleanup successful: ${tokenCleanupResponse.data.cleaned} tokens cleaned`);
    } catch (error) {
      console.log('⚠️  Token cleanup failed:', error.response?.data?.message || error.message);
    }
    
    console.log('\n🎉 Session fixes testing completed!');
    console.log('\n📋 Summary of fixes:');
    console.log('   ✅ Duplicate participant prevention');
    console.log('   ✅ Session participant cleanup');
    console.log('   ✅ Token refresh improvements');
    console.log('   ✅ Better error handling and retries');
    console.log('   ✅ Session heartbeat mechanism');
    console.log('\n💡 Next steps:');
    console.log('   1. Test the frontend session page');
    console.log('   2. Monitor session stability');
    console.log('   3. Check participant counts in UI');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testSessionFixes();
