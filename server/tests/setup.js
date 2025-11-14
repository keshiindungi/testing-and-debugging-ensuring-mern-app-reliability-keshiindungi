// Global test setup for server tests
process.env.NODE_ENV = 'test';
process.env.MONGO_URI_TEST = 'mongodb://localhost:27017/bug-tracker-test';

// Increase timeout for async operations
jest.setTimeout(10000);

// Global test teardown
afterAll(async () => {
  // Close any open connections or clean up resources
});