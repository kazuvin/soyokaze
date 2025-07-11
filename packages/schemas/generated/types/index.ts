// Generated TypeScript types from Zod schemas
// This ensures type safety and consistency with runtime validation

import { z } from 'zod';
import { schemas } from '../zod';

// Export types inferred from Zod schemas
export type User = z.infer<typeof schemas.User>;
export type Error = z.infer<typeof schemas.Error>;
export type CreateUserRequest = z.infer<typeof schemas.CreateUserRequest>;
export type UpdateUserRequest = z.infer<typeof schemas.UpdateUserRequest>;

// Re-export schemas for convenience
export { schemas };
