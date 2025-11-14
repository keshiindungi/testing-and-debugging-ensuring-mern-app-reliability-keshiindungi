import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BugForm from '../../components/BugForm';

// Mock the Button component
jest.mock('../../components/Button', () => {
  return function MockButton({ children, onClick, disabled, type, variant }) {
    return (
      <button 
        onClick={onClick} 
        disabled={disabled} 
        type={type}
        data-variant={variant}
        data-testid="mock-button"
      >
        {children}
      </button>
    );
  };
});

describe('BugForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  test('renders the form with all fields', () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByText(/steps to reproduce/i)).toBeInTheDocument();
    expect(screen.getByText(/environment/i)).toBeInTheDocument();
  });

  test('shows validation errors for required fields', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /report bug/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Bug Title' }
    });
    
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test bug description' }
    });
    
    fireEvent.change(screen.getByLabelText(/reporter/i), {
      target: { value: 'John Doe' }
    });
    
    const submitButton = screen.getByRole('button', { name: /report bug/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug Title',
        description: 'Test bug description',
        priority: 'medium',
        status: 'open',
        reporter: 'John Doe',
        assignee: '',
        stepsToReproduce: [],
        environment: {
          os: '',
          browser: '',
          version: ''
        }
      });
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<BugForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});