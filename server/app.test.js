/* global jest, describe, test, expect */
const request = require('supertest');
const app = require('./app');

// Mock the Firebase connection so we don't connect to a real database during tests
jest.mock('./firebase/firebase', () => {
  const mockDocSnap = {
    exists: true,
    data: () => ({ title: 'Test Note', content: 'Test Content', category: 'General' })
  };

  const mockDocRef = {
    get: jest.fn().mockResolvedValue(mockDocSnap),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true)
  };

  return {
    collection: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      docs: [
        {
          id: 'test-id',
          data: () => ({ title: 'Test Note', content: 'Test Content', category: 'General' })
        }
      ]
    }),
    doc: jest.fn().mockReturnValue(mockDocRef),
    add: jest.fn().mockResolvedValue({ id: 'new-test-id' })
  };
});

describe('Notory API Endpoints', () => {
  
  // 1. Test Status Endpoint
  test('GET /api/status - success', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  // 2. Test Fetching Notes (Mocked DB)
  test('GET /api/notes - success', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id', 'test-id');
    expect(res.body[0]).toHaveProperty('title', 'Test Note');
  });

  // 3. Test Creation Validation
  test('POST /api/notes - validation error if title is missing', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ content: 'This has content but no title' });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Title is required');
  });

});