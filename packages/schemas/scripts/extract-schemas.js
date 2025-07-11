const fs = require('fs');
const path = require('path');

/**
 * Extract schemas from generated file and create zod/index.ts
 */
function extractSchemas() {
  console.log('🔧 Extracting Zod schemas...');

  const tempFilePath = path.join(__dirname, '..', 'generated', 'zod', 'schemas-temp.ts');
  const outputFilePath = path.join(__dirname, '..', 'generated', 'zod', 'index.ts');

  if (!fs.existsSync(tempFilePath)) {
    console.error('❌ Temporary schemas file not found:', tempFilePath);
    process.exit(1);
  }

  const tempContent = fs.readFileSync(tempFilePath, 'utf8');
  
  // Extract only the schema definitions and export
  const lines = tempContent.split('\n');
  let schemaContent = [];
  let inSchemaSection = false;
  let schemaNames = [];

  for (const line of lines) {
    // Start of schema definitions
    if (line.includes('import { z }')) {
      schemaContent.push(line);
      continue;
    }
    
    // Skip other imports and focus on schema definitions
    if (line.match(/^const \w+ = z/)) {
      inSchemaSection = true;
      const schemaName = line.match(/^const (\w+) = z/)[1];
      schemaNames.push(schemaName);
      schemaContent.push(line);
      continue;
    }
    
    // Continue collecting schema definition lines
    if (inSchemaSection && (line.startsWith('  ') || line.startsWith('.') || line.includes('.passthrough()'))) {
      schemaContent.push(line);
      if (line.includes('.passthrough();')) {
        inSchemaSection = false;
      }
      continue;
    }
  }

  // Create the export object
  const exportLines = [
    '',
    'export const schemas = {',
    ...schemaNames.map(name => `  ${name},`),
    '};'
  ];

  const finalContent = [...schemaContent, ...exportLines].join('\n');
  
  // Write the cleaned schema file
  fs.writeFileSync(outputFilePath, finalContent);
  
  // Remove temporary file
  fs.unlinkSync(tempFilePath);
  
  console.log('✅ Zod schemas extracted successfully!');
}

// Run the extractor
if (require.main === module) {
  extractSchemas();
}

module.exports = { extractSchemas };