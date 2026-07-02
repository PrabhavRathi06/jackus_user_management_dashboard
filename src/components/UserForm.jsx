import React, { useState, useEffect } from 'react';

const UserForm = ({ user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isEditing = Boolean(user);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department,
      });
    }
  }, [user]);

  // Validation rules
  const validate = (data) => {
    const errs = {};

    if (!data.firstName.trim()) {
      errs.firstName = 'First name is required';
    } else if (data.firstName.trim().length < 2) {
      errs.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.firstName.trim())) {
      errs.firstName = 'First name can only contain letters';
    }

    if (!data.lastName.trim()) {
      errs.lastName = 'Last name is required';
    } else if (data.lastName.trim().length < 2) {
      errs.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(data.lastName.trim())) {
      errs.lastName = 'Last name can only contain letters';
    }

    if (!data.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!data.department.trim()) {
      errs.department = 'Department is required';
    } else if (data.department.trim().length < 2) {
      errs.department = 'Department must be at least 2 characters';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change if field was touched
    if (touched[name]) {
      const newData = { ...formData, [name]: value };
      const newErrors = validate(newData);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      department: true,
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Trim all values before submitting
    const trimmedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
    };

    onSubmit(trimmedData);
  };

  // Close modal on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  const getFieldClass = (fieldName) => {
    if (errors[fieldName] && touched[fieldName]) return 'input-error';
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName].trim()) return 'input-valid';
    return '';
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal" id="user-form-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit User' : 'Add New User'}</h2>
          <button className="modal-close" onClick={onClose} id="close-modal-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} id="user-form" noValidate>
          <div className={`form-group ${getFieldClass('firstName')}`}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter first name"
            />
            {errors.firstName && touched.firstName && (
              <span className="field-error">{errors.firstName}</span>
            )}
          </div>
          <div className={`form-group ${getFieldClass('lastName')}`}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter last name"
            />
            {errors.lastName && touched.lastName && (
              <span className="field-error">{errors.lastName}</span>
            )}
          </div>
          <div className={`form-group ${getFieldClass('email')}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter email address"
            />
            {errors.email && touched.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>
          <div className={`form-group ${getFieldClass('department')}`}>
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter department"
            />
            {errors.department && touched.department && (
              <span className="field-error">{errors.department}</span>
            )}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="submit-user-btn">
              {isEditing ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
