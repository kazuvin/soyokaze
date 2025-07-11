// Quick test for generated schemas
// First, let's manually test the schemas by importing them directly
const { z } = require('zod');

// Manually define schemas for testing (copied from generated file)
const User = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    avatar_url: z.string().url().nullish(),
    bio: z.string().nullish(),
    created_at: z.string().datetime({ offset: true }),
    updated_at: z.string().datetime({ offset: true }),
    last_login: z.string().datetime({ offset: true }).nullish(),
    is_active: z.boolean().optional(),
  })
  .passthrough();

const Error = z
  .object({
    error: z.string(),
    message: z.string(),
    details: z.object({}).partial().passthrough().nullish(),
  })
  .passthrough();

const schemas = { User, Error };

console.log('Testing generated Zod schemas...\n');

// Test User schema
const validUser = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "test@example.com",
  name: "Test User",
  avatar_url: "https://example.com/avatar.jpg",
  bio: "Test bio",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  last_login: "2023-01-01T10:00:00Z",
  is_active: true
};

const invalidUser = {
  id: "invalid-uuid",
  email: "invalid-email",
  name: "Test User"
};

console.log('✅ Valid user validation:');
try {
  const result = schemas.User.parse(validUser);
  console.log('Success:', result);
} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n❌ Invalid user validation:');
try {
  const result = schemas.User.parse(invalidUser);
  console.log('Success:', result);
} catch (error) {
  console.log('Expected error:', error.issues.map(i => `${i.path.join('.')}: ${i.message}`));
}

// Test Error schema
const validError = {
  error: "USER_NOT_FOUND",
  message: "User not found",
  details: { code: 404 }
};

console.log('\n✅ Valid error validation:');
try {
  const result = schemas.Error.parse(validError);
  console.log('Success:', result);
} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n🎉 Schema validation tests completed!');