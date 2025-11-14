import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import Bug from '../../src/models/Bug.js';

describe('Bugs API Integration Tests', () => {
  beforeAll(async () => {
    // Use test database
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/bug-tracker-test');
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    await Bug.deleteMany({});
  });
  
  // ... all your existing tests ...
  
  describe('Error Handling', () => {
    it('should return 400 for invalid bug ID format in GET', async () => {
      const response = await request(app)
        .get('/api/bugs/invalid-id')
        .expect(400);
      
      expect(response.body.error).toBe('Invalid ID format');
    });
    
    it('should return 400 for invalid ID in PUT requests', async () => {
      const response = await request(app)
        .put('/api/bugs/invalid-id')
        .send({ status: 'resolved' })
        .expect(400);
      
      expect(response.body.error).toBe('Invalid ID format');
    });
    
    it('should return 400 for invalid ID in DELETE requests', async () => {
      const response = await request(app)
        .delete('/api/bugs/invalid-id')
        .expect(400);
      
      expect(response.body.error).toBe('Invalid ID format');
    });
  });
});