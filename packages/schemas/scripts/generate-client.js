const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Generate client file that uses schemas from zod directory
 */
function generateClient() {
  console.log('🔧 Generating API client...');

  // First generate a temporary full file to extract endpoints
  const tempFilePath = path.join(__dirname, '..', 'generated', 'client', 'client-temp.ts');

  try {
    // Generate temporary file with all content
    execSync(`openapi-zod-client ./openapi.yaml -o ${tempFilePath} --export-schemas`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });

    const tempContent = fs.readFileSync(tempFilePath, 'utf8');

    // Extract the endpoints and client code, but replace schema imports
    const lines = tempContent.split('\n');
    let clientContent = [];
    let inEndpointsSection = false;
    let schemaNames = [];

    // First pass: collect schema names
    for (const line of lines) {
      const schemaMatch = line.match(/^const (\w+) = z/);
      if (schemaMatch) {
        schemaNames.push(schemaMatch[1]);
      }
    }

    // Second pass: build client with imports from zod directory
    clientContent.push('import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";');
    clientContent.push('import { z } from "zod";');
    clientContent.push('import { schemas } from "../zod";');
    clientContent.push('');

    if (schemaNames.length > 0) {
      clientContent.push(`const { ${schemaNames.join(', ')} } = schemas;`);
      clientContent.push('');
    }

    // Extract endpoints and client code
    for (const line of lines) {
      if (line.includes('const endpoints = makeApi([')) {
        inEndpointsSection = true;
        clientContent.push(line);
        continue;
      }

      if (inEndpointsSection || line.includes('export const api =') || line.includes('export function createApiClient')) {
        clientContent.push(line);
      }
    }

    // Add re-export of schemas
    clientContent.push('');
    clientContent.push('// Re-export schemas for convenience');
    clientContent.push('export { schemas } from "../zod";');

    const finalContent = clientContent.join('\n');

    // Write the client file
    const clientPath = path.join(__dirname, '..', 'generated', 'client', 'index.ts');
    fs.writeFileSync(clientPath, finalContent);

    // Remove temporary file
    fs.unlinkSync(tempFilePath);

    console.log('✅ API client generated successfully!');

  } catch (error) {
    console.error('❌ Failed to generate client:', error.message);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  generateClient();
}

module.exports = { generateClient };
