import { useState } from 'react';

const BugForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    reporter: '', // Add reporter field
    environment: {
      os: '',
      browser: '',
      version: ''
    },
    stepsToReproduce: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.environment.os) {
      newErrors.os = 'Operating system is required';
    }
    
    if (!formData.reporter.trim()) { // Validate reporter field
      newErrors.reporter = 'Reporter name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Form data being submitted:', JSON.stringify(formData, null, 2));
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('❌ Form submission error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('environment.')) {
      const envField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        environment: {
          ...prev.environment,
          [envField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="bug-form-overlay">
      <div className="bug-form-container">
        <h3>Report New Bug</h3>
        <form onSubmit={handleSubmit}>
          {/* Reporter Field - Add this section */}
          <div className="form-group">
            <label htmlFor="reporter">Your Name *</label>
            <input
              type="text"
              id="reporter"
              name="reporter"
              value={formData.reporter}
              onChange={handleChange}
              className={errors.reporter ? 'error' : ''}
              placeholder="Enter your name"
            />
            {errors.reporter && <span className="error-text">{errors.reporter}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter bug title"
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={errors.description ? 'error' : ''}
              placeholder="Describe the bug in detail"
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority *</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="os">Operating System *</label>
            <select
              id="os"
              name="environment.os"
              value={formData.environment.os}
              onChange={handleChange}
              className={errors.os ? 'error' : ''}
              required
            >
              <option value="">Select OS</option>
              <option value="windows">Windows</option>
              <option value="macos">macOS</option>
              <option value="linux">Linux</option>
              <option value="android">Android</option>
              <option value="ios">iOS</option>
              <option value="other">Other</option>
            </select>
            {errors.os && <span className="error-text">{errors.os}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="browser">Browser (Optional)</label>
            <input
              type="text"
              id="browser"
              name="environment.browser"
              value={formData.environment.browser}
              onChange={handleChange}
              placeholder="e.g., Chrome, Firefox, Safari"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stepsToReproduce">Steps to Reproduce (Optional)</label>
            <textarea
              id="stepsToReproduce"
              name="stepsToReproduce"
              value={formData.stepsToReproduce}
              onChange={handleChange}
              rows="4"
              placeholder="Enter each step on a new line:&#10;1. Go to the login page&#10;2. Enter invalid credentials&#10;3. Click the login button&#10;4. Observe the error message"
            />
            <small>Enter each step on a new line. They will be converted to an array automatically.</small>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel}
              disabled={loading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Submitting...' : 'Submit Bug Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BugForm;