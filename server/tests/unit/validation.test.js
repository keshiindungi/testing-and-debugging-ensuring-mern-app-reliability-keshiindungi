import { validateBug } from '../../src/utils/validation.js';

describe('Bug Validation', () => {
  describe('validateBug function', () => {
    it('should validate correct bug data', () => {
      const validBug = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        status: 'open',
        priority: 'medium',
        reporter: 'John Doe'
      };
      
      const { error } = validateBug(validBug);
      expect(error).toBeUndefined();
    });
    
    it('should reject bug without title', () => {
      const invalidBug = {
        description: 'This is a test bug description',
        reporter: 'John Doe'
      };
      
      const { error } = validateBug(invalidBug);
      expect(error).toBeDefined();
      // Joi returns different message format, so check for required field
      expect(error.details[0].message).toContain('required');
    });
    
    it('should reject bug with empty title', () => {
      const invalidBug = {
        title: '',
        description: 'This is a test bug description',
        reporter: 'John Doe'
      };
      
      const { error } = validateBug(invalidBug);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('required');
    });
    
    it('should reject bug with title too long', () => {
      const invalidBug = {
        title: 'a'.repeat(101),
        description: 'This is a test bug description',
        reporter: 'John Doe'
      };
      
      const { error } = validateBug(invalidBug);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('100');
    });
    
    it('should reject bug without description', () => {
      const invalidBug = {
        title: 'Test Bug',
        reporter: 'John Doe'
      };
      
      const { error } = validateBug(invalidBug);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('required');
    });
    
    it('should reject bug without reporter', () => {
      const invalidBug = {
        title: 'Test Bug',
        description: 'This is a test bug description'
      };
      
      const { error } = validateBug(invalidBug);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('required');
    });
    
    it('should accept valid priority values', () => {
      const priorities = ['low', 'medium', 'high', 'critical'];
      
      priorities.forEach(priority => {
        const bug = {
          title: 'Test Bug',
          description: 'Description',
          reporter: 'John Doe',
          priority: priority
        };
        
        const { error } = validateBug(bug);
        expect(error).toBeUndefined();
      });
    });
    
    it('should reject invalid priority values', () => {
      const bug = {
        title: 'Test Bug',
        description: 'Description',
        reporter: 'John Doe',
        priority: 'invalid-priority'
      };
      
      const { error } = validateBug(bug);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('must be one of');
    });
    
    it('should accept valid status values', () => {
      const statuses = ['open', 'in-progress', 'resolved', 'closed'];
      
      statuses.forEach(status => {
        const bug = {
          title: 'Test Bug',
          description: 'Description',
          reporter: 'John Doe',
          status: status
        };
        
        const { error } = validateBug(bug);
        expect(error).toBeUndefined();
      });
    });
    
    it('should reject invalid status values', () => {
      const bug = {
        title: 'Test Bug',
        description: 'Description',
        reporter: 'John Doe',
        status: 'invalid-status'
      };
      
      const { error } = validateBug(bug);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('must be one of');
    });
    
    it('should accept bug with optional fields', () => {
      const bugWithOptionalFields = {
        title: 'Test Bug',
        description: 'Description',
        reporter: 'John Doe',
        assignee: 'Jane Smith',
        stepsToReproduce: ['Step 1', 'Step 2'],
        environment: {
          os: 'Windows 10',
          browser: 'Chrome',
          version: '90.0'
        }
      };
      
      const { error } = validateBug(bugWithOptionalFields);
      expect(error).toBeUndefined();
    });
  });
  
  describe('validateBug for updates', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        status: 'in-progress'
      };
      
      const { error } = validateBug(partialUpdate, true);
      expect(error).toBeUndefined();
    });
    
    it('should validate full update data', () => {
      const fullUpdate = {
        title: 'Updated Bug',
        description: 'Updated description',
        status: 'resolved',
        priority: 'high',
        reporter: 'Updated Reporter'
      };
      
      const { error } = validateBug(fullUpdate, true);
      expect(error).toBeUndefined();
    });
  });
});