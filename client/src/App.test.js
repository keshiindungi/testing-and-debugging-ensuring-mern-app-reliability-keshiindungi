import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the API calls with proper response structure
jest.mock('./services/bugService', () => ({
  getBugs: jest.fn(() => Promise.resolve({ 
    bugs: [], 
    total: 0,
    totalPages: 0,
    currentPage: 1
  })),
  createBug: jest.fn(() => Promise.resolve({})),
  updateBug: jest.fn(() => Promise.resolve({})),
  deleteBug: jest.fn(() => Promise.resolve({})),
}));

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders bug tracker header', async () => {
    render(<App />);
    
    // Use findBy for async content
    const headerElement = await screen.findByText(/MERN Bug Tracker/i);
    expect(headerElement).toBeInTheDocument();
  });
});