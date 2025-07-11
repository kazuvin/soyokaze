// Test the API client
const { createSoyokazeAPIClient, ApiClientError } = require('./dist/generated/client/api-client');

async function testApiClient() {
  console.log('🧪 Testing Soyokaze API Client...\n');

  // Create API client
  const client = createSoyokazeAPIClient({
    baseUrl: 'http://localhost:3000',
    timeout: 5000,
  });

  try {
    // Test 1: Get all users
    console.log('📋 Test 1: Get all users');
    const users = await client.getUsers();
    console.log(`✅ Success: Found ${users.users.length} users`);
    console.log(`   Total: ${users.total}, Limit: ${users.limit}, Offset: ${users.offset}\n`);

    // Test 2: Get user by ID (valid)
    console.log('👤 Test 2: Get user by ID (valid)');
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const user = await client.getUser(userId);
    console.log(`✅ Success: Found user ${user.name} (${user.email})\n`);

    // Test 3: Get user by ID (invalid)
    console.log('❌ Test 3: Get user by ID (invalid)');
    try {
      await client.getUser('invalid-id');
      console.log('❌ This should have failed!\n');
    } catch (error) {
      if (error instanceof ApiClientError) {
        console.log(`✅ Expected error: ${error.message} (Status: ${error.status})\n`);
      } else {
        console.log(`✅ Expected error: ${error.message}\n`);
      }
    }

    // Test 4: Check if user exists
    console.log('🔍 Test 4: Check if user exists');
    const exists = await client.userExists(userId);
    console.log(`✅ User exists: ${exists}\n`);

    const notExists = await client.userExists('non-existent-id');
    console.log(`✅ Non-existent user exists: ${notExists}\n`);

    // Test 5: Get users with pagination
    console.log('📄 Test 5: Get users with pagination');
    const paginatedUsers = await client.getUsers({ limit: 2, offset: 0 });
    console.log(`✅ Success: Got ${paginatedUsers.users.length} users with pagination\n`);

    // Test 6: Get active users
    console.log('🟢 Test 6: Get active users');
    const activeUsers = await client.getActiveUsers();
    console.log(`✅ Success: Found ${activeUsers.length} active users\n`);

    // Test 7: Get users by email
    console.log('📧 Test 7: Get users by email');
    const usersByEmail = await client.getUsersByEmail('john.doe@example.com');
    console.log(`✅ Success: Found ${usersByEmail.length} users with email john.doe@example.com\n`);

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error instanceof ApiClientError) {
      console.error(`   Status: ${error.status}, Code: ${error.code}`);
    }
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/health');
    if (response.ok) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Server not running. Please start the server first:');
    console.log('   npm run start');
    console.log('   or');
    console.log('   npm run schemas:start (from project root)');
    return;
  }

  await testApiClient();
}

main().catch(console.error);