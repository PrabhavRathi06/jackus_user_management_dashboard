import { useState, useEffect, useMemo, useCallback } from 'react';
import { getUsers, addUser, updateUser, deleteUser } from './api';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import SearchBar from './components/SearchBar';
import FilterPopup from './components/FilterPopup';
import Pagination from './components/Pagination';
import Toast from './components/Toast';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Search, Sort, Filter, Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Toast helpers
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      addToast('Failed to load users. Please check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- Derived data: filter → search → sort → paginate ---
  const processedUsers = useMemo(() => {
    let result = [...users];

    // 1. Apply filters
    if (filters.firstName) {
      result = result.filter((u) =>
        u.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
      );
    }
    if (filters.lastName) {
      result = result.filter((u) =>
        u.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
      );
    }
    if (filters.email) {
      result = result.filter((u) =>
        u.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.department) {
      result = result.filter((u) =>
        u.department.toLowerCase().includes(filters.department.toLowerCase())
      );
    }

    // 2. Apply search (across all fields)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstName.toLowerCase().includes(query) ||
          u.lastName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.department.toLowerCase().includes(query) ||
          String(u.id).includes(query)
      );
    }

    // 3. Apply sort
    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, filters, searchQuery, sortConfig]);

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(processedUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedUsers.slice(start, start + pageSize);
  }, [processedUsers, currentPage, pageSize]);

  // Reset to page 1 when filters/search/pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, pageSize]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // CRUD handlers with error handling & toast notifications
  const handleAddUser = async (userData) => {
    try {
      const newUser = await addUser(userData);
      const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
      newUser.id = maxId + 1;
      setUsers((prev) => [...prev, newUser]);
      setShowForm(false);
      addToast(`User "${userData.firstName} ${userData.lastName}" added successfully!`, 'success');
    } catch (error) {
      console.error('Failed to add user:', error);
      addToast('Failed to add user. Please try again.', 'error');
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const updated = await updateUser(editingUser.id, userData);
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? updated : u))
      );
      setEditingUser(null);
      setShowForm(false);
      addToast(`User "${userData.firstName} ${userData.lastName}" updated successfully!`, 'success');
    } catch (error) {
      console.error('Failed to update user:', error);
      addToast('Failed to update user. Please try again.', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const deletedUser = users.find((u) => u.id === id);
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      addToast(`User "${deletedUser?.firstName} ${deletedUser?.lastName}" deleted successfully!`, 'success');
    } catch (error) {
      console.error('Failed to delete user:', error);
      addToast('Failed to delete user. Please try again.', 'error');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleFormSubmit = (formData) => {
    if (editingUser) {
      handleUpdateUser(formData);
    } else {
      handleAddUser(formData);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ firstName: '', lastName: '', email: '', department: '' });
  };

  return (
    <div className="app">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className="app-header" id="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h1>User Management</h1>
              <p className="header-subtitle">Manage your team members and their details</p>
            </div>
          </div>
          <button
            className="btn btn-primary btn-add"
            id="add-user-btn"
            onClick={() => setShowForm(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add User
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-number">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {new Set(users.map((u) => u.department)).size}
          </span>
          <span className="stat-label">Departments</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{processedUsers.length}</span>
          <span className="stat-label">Showing</span>
        </div>
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="toolbar">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterPopup
          filters={filters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </div>

      {/* Main Content */}
      <main className="main-content" id="main-content">
        <UserTable
          users={paginatedUsers}
          onEdit={handleEdit}
          onDelete={handleDeleteUser}
          loading={loading}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {/* Pagination */}
        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={processedUsers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </main>

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default App;
