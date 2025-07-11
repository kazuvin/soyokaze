const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');

/**
 * Generate TypeScript types from Zod schemas
 */
function generateTypes() {
  console.log('🔧 Generating TypeScript types from Zod schemas...');

  // Generate types content that imports from zod schemas
  const typesContent = `// Generated TypeScript types from Zod schemas
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
`;

  // Ensure types directory exists
  const typesDir = path.join(__dirname, '..', 'generated', 'types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }
  
  // Write types file
  const typesPath = path.join(typesDir, 'index.ts');
  fs.writeFileSync(typesPath, typesContent);
  
  console.log('✅ TypeScript types generated successfully from Zod schemas!');
}


// Run the generator
if (require.main === module) {
  generateTypes();
}

module.exports = { generateTypes };