import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import BugTracker from '../../pages/BugTracker';

// Mock the bug service with proper response structure
jest.mock('../../services/bugService', () => ({
  getBugs: jest.fn(() => Promise.resolve({ 
    bugs: [
      {
        _id: '1',
        title: 'Critical Bug',
        description: 'This is a critical bug',
        status: 'open',
        priority: 'critical',
        reporter: 'John Doe',
        createdAt: '2023-01-01T00:00:00.000Z'
      },
      {
        _id: '2',
        title: 'Minor Bug',
        description: 'This is a minor bug',
        status: 'resolved',
        priority: 'low',
        reporter: 'Jane Smith',
        createdAt: '2023-01-02T00:00:00.000Z'
      }
    ],
    total: 2,
    totalPages: 1,
    currentPage: 1
  })),
  createBug: jest.fn(() => Promise.resolve({
    _id: '3',
    title: 'New Bug',
    description: 'New bug description',
    status: 'open',
    priority: 'medium',
    reporter: 'Test User'
  })),
  updateBug: jest.fn(() => Promise.resolve({
    _id: '1',
    title: 'Critical Bug',
    description: 'This is a critical bug',
    status: 'in-progress',
    priority: 'critical',
    reporter: 'John Doe'
  })),
  deleteBug: jest.fn(() => Promise.resolve({ 
    message: 'Bug deleted successfully' 
  })),
}));

describe('BugTracker Integration Tests', () => {
  let bugService;
  
  beforeEach(() => {
    bugService = require('../../services/bugService');
    jest.clearAllMocks();
  });
  
  it('loads and displays bugs on initial render', async () => {
    render(
      <BrowserRouter>
        <BugTracker />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Critical Bug')).toBeInTheDocument();
      expect(screen.getByText('Minor Bug')).toBeInTheDocument();
    });
    
    expect(bugService.getBugs).toHaveBeenCalledTimes(1);
  });
  
  it('handles API errors gracefully', async () => {
    // Mock API failure
    bugService.getBugs.mockRejectedValueOnce(new Error('API Error'));
    
    render(
      <BrowserRouter>
        <BugTracker />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load bugs/i)).toBeInTheDocument();
    });
  });
});