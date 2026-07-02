# User Management Dashboard

A modern, responsive web application for managing users — built with **React 19** and **Vite**. Supports full CRUD operations (Create, Read, Update, Delete) using the [JSONPlaceholder](https://jsonplaceholder.typicode.com) mock REST API.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white)

---

## 🔗 Live Links
- **Live Deployment:** [https://jackus-user-management-dashboard.vercel.app](https://jackus-user-management-dashboard.vercel.app)
- **Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1tZqWPotwjbwzjPcJ_mNYObEihv1z2cbV/view?usp=sharing)

---

## ✨ Features

### Core Functionality
- **View Users** — Fetches and displays all users from the `/users` endpoint in a clean table
- **Add User** — Add new users via a modal form (simulated via POST to JSONPlaceholder)
- **Edit User** — Edit existing user details with pre-filled form data
- **Delete User** — Remove users with a confirmation dialog

### Search, Sort & Filter
- **Real-time Search** — Search across all fields (name, email, department, ID)
- **Column Sorting** — Click any column header to sort ascending/descending
- **Filter Popup** — Filter by First Name, Last Name, Email, or Department independently
- **Active Filter Badge** — Shows count of applied filters

### Pagination
- **Page Size Options** — Choose between 10, 25, 50, or 100 items per page
- **Page Navigation** — Numbered page buttons with Previous/Next controls
- **Smart Ellipsis** — Collapses page numbers for large datasets
- **Item Count** — Shows "Showing X–Y of Z" information

### Validation & Error Handling
- **Client-side Validation** — Required fields, minimum length (2 chars), email format regex, letters-only for names
- **Inline Errors** — Error messages shown per field on blur and on submit
- **Visual Feedback** — Red border for invalid fields, green for valid
- **Error Shake Animation** — Subtle shake animation on validation errors
- **API Error Handling** — try/catch on all API calls with user-friendly error messages
- **Toast Notifications** — Success/error toasts with auto-dismiss (4s) and progress bar

### Design & Responsiveness
- **Dark Theme** — Premium dark UI with glassmorphism and gradient accents
- **Fully Responsive** — Three breakpoints:
  - **Desktop** (1440px+) — Full table layout
  - **Tablet** (768px) — Compact table with horizontal scroll, bottom-sheet filter
  - **Mobile** (480px) — Card-style layout replacing the table
- **Smooth Animations** — Modal slide-up, toast slide-in, spinner, hover effects
- **Custom Scrollbar** — Styled scrollbar for consistent look
- **Inter Font** — Modern Google Fonts typography

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI library with hooks (useState, useEffect, useMemo, useCallback) |
| [Vite 8](https://vite.dev) | Build tool & dev server with HMR |
| [Axios](https://axios-http.com) | HTTP client for API requests |
| [JSONPlaceholder](https://jsonplaceholder.typicode.com) | Mock REST API for user data |
| Vanilla CSS | Styling — dark theme, glassmorphism, responsive media queries |

---

## 🚀 Setup & Run Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrabhavRathi06/jackus_user_management_dashboard.git
   cd jackus_user_management_dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
jackus_user_management_dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── FilterPopup.jsx    # Filter popup with per-field filtering
│   │   ├── Pagination.jsx     # Page controls with size selector
│   │   ├── SearchBar.jsx      # Real-time search input
│   │   ├── Toast.jsx          # Toast notification system
│   │   ├── UserForm.jsx       # Add/Edit modal form with validation
│   │   └── UserTable.jsx      # Sortable user data table
│   ├── api.js                 # Axios API service layer
│   ├── App.jsx                # Main application component
│   ├── index.css              # Complete design system & responsive CSS
│   └── main.jsx               # React entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 📝 Assumptions

1. **Data Mapping** — JSONPlaceholder's `/users` endpoint returns a `name` field (full name). This is split into `firstName` and `lastName` (first word vs rest). The `company.name` field is used as `Department`.

2. **Simulated CRUD** — JSONPlaceholder is a mock API:
   - **POST** (add) always returns `id: 11` regardless of data. The app generates unique local IDs instead.
   - **PUT** (update) and **DELETE** return success responses but don't persist changes on the server.
   - All changes are maintained in the client-side state during the session.

3. **Pagination** — Since JSONPlaceholder only returns 10 users, pagination becomes more meaningful when users are added locally. The page size options (10, 25, 50, 100) are provided as required.

4. **Search Scope** — The search bar searches across all visible fields: ID, First Name, Last Name, Email, and Department simultaneously.

5. **Validation Rules** — Names must be at least 2 characters and contain only letters (including spaces, hyphens, apostrophes). Email must match a standard format. All fields are required.

---

## 🤔 Challenges & Reflections

### Challenges Faced
- **Data Schema Mapping** — JSONPlaceholder doesn't have separate `firstName`/`lastName`/`department` fields. Mapping `name` → split names and `company.name` → department required careful handling.
- **Local State Management** — Since the mock API doesn't persist data, managing a consistent local state across add/edit/delete operations while keeping the UI in sync needed thoughtful state design.
- **Responsive Table Design** — Making data tables responsive is notoriously difficult. The solution uses horizontal scroll on tablets and a card-style layout on mobile using CSS `data-label` attributes.

### Improvements with More Time
- **State Management** — Adopt a state management library (Redux Toolkit or Zustand) for cleaner state handling as the app scales.
- **Unit & Integration Tests** — Add tests using React Testing Library and Vitest for component and integration testing.
- **Debounced Search** — Add a debounce to the search input to reduce unnecessary re-renders on rapid typing.
- **Skeleton Loading** — Replace the spinner with skeleton loaders for a more polished loading experience.
- **Dark/Light Theme Toggle** — Add a toggle to switch between dark and light modes.
- **Backend Integration** — Connect to a real backend with proper database persistence and authentication.
- **Accessibility (a11y)** — Enhance keyboard navigation, ARIA labels, and screen reader support.

---

## 📜 License

This project was built as part of a coding assignment.
