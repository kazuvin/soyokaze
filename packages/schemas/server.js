const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// UUID generator function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Load OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mock data for users
const mockUsers = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    email: "john.doe@example.com",
    name: "John Doe",
    avatar_url: "https://example.com/avatar1.jpg",
    bio: "Software developer from Tokyo",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    last_login: "2023-12-01T10:30:00Z",
    is_active: true
  },
  {
    id: "987f6543-d21c-43b2-a654-321098765432",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    avatar_url: "https://example.com/avatar2.jpg",
    bio: "Product manager and designer",
    created_at: "2023-02-15T00:00:00Z",
    updated_at: "2023-02-15T00:00:00Z",
    last_login: "2023-12-01T14:45:00Z",
    is_active: true
  },
  {
    id: "456a7890-b12c-34d5-e678-901234567890",
    email: "bob.johnson@example.com",
    name: "Bob Johnson",
    avatar_url: null,
    bio: null,
    created_at: "2023-03-20T00:00:00Z",
    updated_at: "2023-03-20T00:00:00Z",
    last_login: null,
    is_active: false
  }
];

// API Routes

// GET /users/{id} - Get user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  
  const user = mockUsers.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      error: 'USER_NOT_FOUND',
      message: `User with ID ${id} was not found`
    });
  }
  
  res.json(user);
});

// GET /users - Get all users with pagination
app.get('/users', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  
  // Validate limit
  if (limit < 1 || limit > 100) {
    return res.status(400).json({
      error: 'INVALID_LIMIT',
      message: 'Limit must be between 1 and 100'
    });
  }
  
  // Validate offset
  if (offset < 0) {
    return res.status(400).json({
      error: 'INVALID_OFFSET',
      message: 'Offset must be 0 or greater'
    });
  }
  
  const paginatedUsers = mockUsers.slice(offset, offset + limit);
  
  res.json({
    users: paginatedUsers,
    total: mockUsers.length,
    limit,
    offset
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// POST /users - Create a new user
app.post('/users', (req, res) => {
  const { email, name, avatar_url, bio, is_active = true } = req.body;

  // Validate required fields
  if (!email || !name) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Email and name are required'
    });
  }

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      error: 'USER_EXISTS',
      message: `User with email ${email} already exists`
    });
  }

  // Create new user
  const newUser = {
    id: generateUUID(),
    email,
    name,
    avatar_url: avatar_url || null,
    bio: bio || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: null,
    is_active
  };

  mockUsers.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/{id} - Update user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { email, name, avatar_url, bio, is_active } = req.body;

  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'USER_NOT_FOUND',
      message: `User with ID ${id} was not found`
    });
  }

  // Check email conflict (if email is being changed)
  if (email && email !== mockUsers[userIndex].email) {
    const emailExists = mockUsers.find(u => u.email === email && u.id !== id);
    if (emailExists) {
      return res.status(409).json({
        error: 'EMAIL_EXISTS',
        message: `Email ${email} is already in use`
      });
    }
  }

  // Update user
  const updatedUser = {
    ...mockUsers[userIndex],
    ...(email !== undefined && { email }),
    ...(name !== undefined && { name }),
    ...(avatar_url !== undefined && { avatar_url }),
    ...(bio !== undefined && { bio }),
    ...(is_active !== undefined && { is_active }),
    updated_at: new Date().toISOString()
  };

  mockUsers[userIndex] = updatedUser;
  res.json(updatedUser);
});

// DELETE /users/{id} - Delete user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'USER_NOT_FOUND',
      message: `User with ID ${id} was not found`
    });
  }

  mockUsers.splice(userIndex, 1);
  res.status(204).send();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Soyokaze API Server',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      users: '/users',
      userById: '/users/{id}',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Soyokaze API Server running on port ${PORT}`);
  console.log(`📚 API Documentation available at: http://localhost:${PORT}/api-docs`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/users`);
});

module.exports = app;