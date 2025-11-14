import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method.toUpperCase()} request to: ${config.url}`);
    console.log('📦 Request data:', JSON.stringify(config.data, null, 2));
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ API Error Status:', error.response?.status);
    console.error('❌ API Error Data:', error.response?.data);
    
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      console.error('🔍 VALIDATION ERRORS FROM SERVER:');
      console.error(JSON.stringify(errorData, null, 2));
      
      // Extract specific validation messages
      let errorMessage = 'Validation failed';
      
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.errors) {
        const errorMessages = Object.values(errorData.errors).map(err => err.message || err);
        errorMessage = errorMessages.join(', ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      
      console.error('📝 Extracted error message:', errorMessage);
      throw new Error(errorMessage);
    }
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error(error.response?.data?.message || 'An unexpected error occurred.');
  }
);

export const getBugs = async () => {
  try {
    const response = await api.get('/bugs');
    return response.bugs || [];
  } catch (error) {
    console.error('Error fetching bugs:', error);
    throw error;
  }
};

export const createBug = async (bugData) => {
  try {
    // Convert stepsToReproduce from string to array
    const stepsToReproduceArray = bugData.stepsToReproduce 
      ? bugData.stepsToReproduce.split('\n').filter(step => step.trim() !== '')
      : [];

    // Include all required fields based on server validation
    const submissionData = {
      title: bugData.title?.trim() || '',
      description: bugData.description?.trim() || '',
      priority: bugData.priority || 'medium',
      status: bugData.status || 'open',
      reporter: bugData.reporter?.trim() || '', // Include reporter field
      environment: {
        os: bugData.environment?.os || ''
      },
      stepsToReproduce: stepsToReproduceArray
    };

    console.log('📤 Final submission data:', JSON.stringify(submissionData, null, 2));
    
    return await api.post('/bugs', submissionData);
  } catch (error) {
    console.error('Error creating bug:', error);
    throw error;
  }
};