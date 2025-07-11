import { createSoyokazeApiClient, ApiClientError } from '../client';
import type { User } from '../client';

// Example 1: Basic client setup
const apiClient = createSoyokazeApiClient({
  baseUrl: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer your-token-here', // If needed
    'X-Custom-Header': 'value',
  },
});

// Example 2: Get a specific user
async function getUserExample() {
  try {
    const user: User = await apiClient.getUser('123e4567-e89b-12d3-a456-426614174000');
    console.log('User:', user);
    console.log('User name:', user.name);
    console.log('User email:', user.email);
  } catch (error) {
    if (error instanceof ApiClientError) {
      console.error('API Error:', error.message);
      console.error('Status:', error.status);
      console.error('Code:', error.code);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Example 3: Get all users with pagination
async function getUsersWithPagination() {
  try {
    const response = await apiClient.getUsers({
      limit: 10,
      offset: 0,
    });
    
    console.log(`Found ${response.users.length} users out of ${response.total} total`);
    
    response.users.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });
  } catch (error) {
    console.error('Failed to get users:', error);
  }
}

// Example 4: Check if user exists
async function checkUserExists() {
  const userId = '123e4567-e89b-12d3-a456-426614174000';
  
  try {
    const exists = await apiClient.userExists(userId);
    console.log(`User ${userId} exists:`, exists);
  } catch (error) {
    console.error('Error checking user existence:', error);
  }
}

// Example 5: Get active users only
async function getActiveUsers() {
  try {
    const activeUsers = await apiClient.getActiveUsers();
    console.log(`Found ${activeUsers.length} active users`);
    
    activeUsers.forEach(user => {
      console.log(`- ${user.name} (Active: ${user.is_active})`);
    });
  } catch (error) {
    console.error('Failed to get active users:', error);
  }
}

// Example 6: Search users by email
async function searchUsersByEmail() {
  try {
    const users = await apiClient.getUsersByEmail('john.doe@example.com');
    console.log(`Found ${users.length} users with email john.doe@example.com`);
    
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });
  } catch (error) {
    console.error('Failed to search users by email:', error);
  }
}

// Example 7: Error handling with different error types
async function errorHandlingExample() {
  try {
    // This will fail with a 404 error
    await apiClient.getUser('non-existent-id');
  } catch (error) {
    if (error instanceof ApiClientError) {
      switch (error.status) {
        case 404:
          console.log('User not found');
          break;
        case 500:
          console.log('Server error');
          break;
        case 0:
          if (error.code === 'CONNECTION_ERROR') {
            console.log('Cannot connect to server');
          } else if (error.code === 'HOST_NOT_FOUND') {
            console.log('Server not found');
          }
          break;
        default:
          console.log('Unknown API error:', error.message);
      }
    }
  }
}

// Example 8: Using with async/await in a function
async function fetchUserData(userId: string): Promise<User | null> {
  try {
    const user = await apiClient.getUser(userId);
    return user;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return null; // User not found
    }
    throw error; // Re-throw other errors
  }
}

// Example 9: Batch operations
async function batchOperationsExample() {
  const userIds = [
    '123e4567-e89b-12d3-a456-426614174000',
    '987f6543-d21c-43b2-a654-321098765432',
    '456a7890-b12c-34d5-e678-901234567890',
  ];

  const users = await Promise.allSettled(
    userIds.map(id => apiClient.getUser(id))
  );

  users.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`User ${userIds[index]}: ${result.value.name}`);
    } else {
      console.log(`User ${userIds[index]}: Error - ${result.reason.message}`);
    }
  });
}

// Example 10: Run all examples
async function runAllExamples() {
  console.log('=== Basic Usage Examples ===\n');
  
  console.log('1. Get specific user:');
  await getUserExample();
  
  console.log('\n2. Get users with pagination:');
  await getUsersWithPagination();
  
  console.log('\n3. Check if user exists:');
  await checkUserExists();
  
  console.log('\n4. Get active users:');
  await getActiveUsers();
  
  console.log('\n5. Search users by email:');
  await searchUsersByEmail();
  
  console.log('\n6. Error handling:');
  await errorHandlingExample();
  
  console.log('\n7. Batch operations:');
  await batchOperationsExample();
}

// Export for potential use
export {
  getUserExample,
  getUsersWithPagination,
  checkUserExists,
  getActiveUsers,
  searchUsersByEmail,
  errorHandlingExample,
  fetchUserData,
  batchOperationsExample,
  runAllExamples,
};

// Uncomment to run examples directly
// runAllExamples().catch(console.error);