import React from 'react';

const UserTable = ({ users, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <h3>No users found</h3>
        <p>Add a new user to get started or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="user-table" id="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td data-label="ID">
                <span className="id-badge">{user.id}</span>
              </td>
              <td data-label="First Name">{user.firstName}</td>
              <td data-label="Last Name">{user.lastName}</td>
              <td data-label="Email">
                <span className="email-text">{user.email}</span>
              </td>
              <td data-label="Department">
                <span className="dept-badge">{user.department}</span>
              </td>
              <td data-label="Actions">
                <div className="action-buttons">
                  <button
                    className="btn btn-edit"
                    id={`edit-user-${user.id}`}
                    onClick={() => onEdit(user)}
                    title="Edit user"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    id={`delete-user-${user.id}`}
                    onClick={() => onDelete(user.id)}
                    title="Delete user"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
