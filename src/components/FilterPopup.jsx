import React, { useState } from 'react';

const FilterPopup = ({ filters, onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  });

  // Sync local state when popup opens
  const handleToggle = () => {
    if (!isOpen) {
      setLocalFilters({ ...filters });
    }
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = { firstName: '', lastName: '', email: '', department: '' };
    setLocalFilters(cleared);
    onClear();
    setIsOpen(false);
  };

  const activeCount = Object.values(filters).filter((v) => v.trim()).length;

  return (
    <div className="filter-container" id="filter-container">
      <button
        className={`btn btn-filter ${activeCount > 0 ? 'btn-filter-active' : ''}`}
        id="filter-toggle-btn"
        onClick={handleToggle}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="filter-count">{activeCount}</span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="filter-backdrop" onClick={() => setIsOpen(false)} />
          <div className="filter-popup" id="filter-popup">
            <div className="filter-popup-header">
              <h3>Filter Users</h3>
              <button className="modal-close" onClick={() => setIsOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="filter-popup-body">
              <div className="filter-field">
                <label htmlFor="filter-firstName">First Name</label>
                <input
                  type="text"
                  id="filter-firstName"
                  name="firstName"
                  value={localFilters.firstName}
                  onChange={handleChange}
                  placeholder="Filter by first name"
                />
              </div>
              <div className="filter-field">
                <label htmlFor="filter-lastName">Last Name</label>
                <input
                  type="text"
                  id="filter-lastName"
                  name="lastName"
                  value={localFilters.lastName}
                  onChange={handleChange}
                  placeholder="Filter by last name"
                />
              </div>
              <div className="filter-field">
                <label htmlFor="filter-email">Email</label>
                <input
                  type="text"
                  id="filter-email"
                  name="email"
                  value={localFilters.email}
                  onChange={handleChange}
                  placeholder="Filter by email"
                />
              </div>
              <div className="filter-field">
                <label htmlFor="filter-department">Department</label>
                <input
                  type="text"
                  id="filter-department"
                  name="department"
                  value={localFilters.department}
                  onChange={handleChange}
                  placeholder="Filter by department"
                />
              </div>
            </div>
            <div className="filter-popup-footer">
              <button className="btn btn-secondary" onClick={handleClear}>
                Clear All
              </button>
              <button className="btn btn-primary" id="apply-filter-btn" onClick={handleApply}>
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterPopup;
