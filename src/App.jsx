import { useState, useEffect } from 'react';
import { getUsers, addUser, updateUser, deleteUser } from './api';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const newUser = await addUser(userData);
      // Assign a unique local ID since JSONPlaceholder always returns id: 11
      const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
      newUser.id = maxId + 1;
      setUsers((prev) => [...prev, newUser]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add user:', error);
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
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
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

  return (
    <div className="app">
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
      </div>

      {/* Main Content */}
      <main className="main-content" id="main-content">
        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDeleteUser}
          loading={loading}
        />
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
