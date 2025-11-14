const BugList = ({ bugs, loading }) => {
  if (loading) {
    return (
      <div className="loading-state">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading bugs...</p>
      </div>
    );
  }

  // Safety check - ensure bugs is an array
  if (!bugs || !Array.isArray(bugs)) {
    return (
      <div className="error-state">
        <i className="fas fa-exclamation-triangle"></i>
        <p>No bugs data available</p>
      </div>
    );
  }

  return (
    <div className="bug-list">
      {bugs.map((bug, index) => (
        <div key={bug._id || index} className="bug-card">
          <div className="bug-header">
            <h3>{bug.title}</h3>
            <span className={`priority-badge priority-${bug.priority}`}>
              {bug.priority}
            </span>
          </div>
          <p>{bug.description}</p>
          <div className="bug-meta">
            <span>OS: {bug.environment?.os || 'Not specified'}</span>
            <span>Priority: {bug.priority}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BugList;