import { useState, useEffect } from 'react';
import { getBugs, createBug } from '../services/bugService';
import BugForm from './BugForm';
import BugList from './BugList';
import BugFilters from './BugFilters';

const BugTracker = () => {
  const [bugs, setBugs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    console.log('🔄 BugTracker mounted, loading bugs...');
    loadBugs();
  }, []);

  const loadBugs = async () => {
    console.log('📡 Fetching bugs from API...');
    try {
      setLoading(true);
      const response = await getBugs(); // Get the full response
      console.log('✅ API Response:', response);
      
      // Extract the bugs array from the response object
      const bugsArray = response.bugs || [];
      setBugs(bugsArray);
      
      setApiConnected(true);
      console.log('🐛 Bugs array:', bugsArray);
    } catch (err) {
      console.error('❌ Error loading bugs:', err);
      setError('Failed to load bugs');
      setApiConnected(false);
    } finally {
      setLoading(false);
      console.log('🏁 Loading completed');
    }
  };

  const handleCreateBug = async (bugData) => {
    console.log('📝 Creating bug:', bugData);
    try {
      setLoading(true);
      const newBug = await createBug(bugData);
      setBugs(prev => [...prev, newBug]);
      setShowForm(false);
      setError('');
      console.log('✅ Bug created successfully:', newBug);
      return newBug;
    } catch (err) {
      console.error('❌ Error creating bug:', err);
      setError(err.message || 'Failed to create bug');
      throw new Error('Failed to create bug. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Refreshing bugs...');
    setError('');
    loadBugs();
  };

  const toggleForm = () => {
    setShowForm(prev => !prev);
    setError('');
  };

  const handleFilterByStatus = () => {
    console.log('Filter by status');
  };

  const handleFilterByPriority = () => {
    console.log('Filter by priority');
  };

  return (
    <div className="bug-tracker">
      <header className="bug-tracker-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-bug"></i>
            <div>
              <h1>MERN Bug Tracker</h1>
              <div className="tagline">Track, manage, and resolve bugs efficiently</div>
            </div>
          </div>
        </div>
        
        <div className="actions">
          <button className="btn btn-primary" onClick={toggleForm}>
            <i className="fas fa-plus-circle"></i>
            Report New Bug
          </button>
          <button className="btn btn-secondary" onClick={handleRefresh} disabled={loading}>
            <i className="fas fa-sync-alt"></i>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <div className="filters">
            <button className="filter-btn" onClick={handleFilterByStatus}>
              <i className="fas fa-filter"></i>
              Filter by Status
            </button>
            <button className="filter-btn" onClick={handleFilterByPriority}>
              <i className="fas fa-sort-amount-down"></i>
              Filter by Priority
            </button>
          </div>
        </div>
      </header>
      
      <div className="main-content">
        <div className="section-header">
          <h2 className="section-title">
            Bug Reports <span className="bug-count">{bugs.length}</span>
          </h2>
        </div>
        
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}
        
        {showForm && (
          <BugForm 
            onSubmit={handleCreateBug}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        )}
        
        {bugs.length === 0 && !showForm ? (
          <div className="empty-state">
            <i className="fas fa-bug"></i>
            <h3>No bugs reported yet</h3>
            <p>Be the first to report a bug and help improve the application!</p>
          </div>
        ) : (
          <BugList bugs={bugs} loading={loading} />
        )}
        
        <div className="debug-info">
          <div>
            <strong>Debug Info:</strong> {bugs.length} bugs loaded | Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className={`status ${apiConnected ? 'connected' : 'disconnected'}`}>
            <i className={`fas ${apiConnected ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
            API Connected: {apiConnected ? '✓' : '✗'}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this to your BugTracker.jsx component
const testBugCreation = async () => {
  console.log('🧪 Testing bug creation with different data formats...');
  
  const testCases = [
    {
      name: "Minimal valid data",
      data: {
        title: "Test Bug - Minimal",
        description: "This is a minimal test bug",
        priority: "medium",
        status: "open",
        environment: { os: "windows" }
      }
    },
    {
      name: "Full data",
      data: {
        title: "Test Bug - Full",
        description: "This is a full test bug description",
        priority: "high",
        status: "open",
        environment: {
          os: "windows",
          browser: "Chrome",
          version: "1.0.0"
        },
        stepsToReproduce: "1. Go to page\n2. Click button\n3. See error",
        expectedBehavior: "Button should work",
        actualBehavior: "Button does nothing"
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log('📦 Test data:', JSON.stringify(testCase.data, null, 2));
    
    try {
      const result = await createBug(testCase.data);
      console.log('✅ SUCCESS:', result);
      break; // Stop if one works
    } catch (error) {
      console.error('❌ FAILED:', error.message);
    }
  }
};

// Add this button temporarily to your BugTracker return JSX:
<button 
  onClick={testBugCreation}
  style={{
    margin: '10px',
    padding: '10px',
    backgroundColor: '#ffeb3b',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }}
>
  🧪 Test Bug Creation
</button>

export default BugTracker;