Sweet Shop Management System – Frontend
A modern single-page application (SPA) built with React, Vite, and Tailwind CSS for managing a Sweet Shop. It connects to the existing Node.js/Express + MongoDB backend and provides separate experiences for customers and admins.

Table of Contents
Features

Customer

Admin

Tech Stack

Project Structure

Backend Setup

Seeding Admin User & Sweets

Frontend Setup

Environment & API Config

Usage Guide

Authentication Flow

Customer Dashboard

Admin Panel

Testing

AI Usage Policy & Git Workflow

Future Improvements

License

Features
Customer
Register and login with email and password.

View all available sweets in a responsive, card-based grid.

Search sweets by name and description.

Filter sweets by category (e.g., Traditional, Special, etc.).​

See price and remaining quantity for each sweet.​

“Add to Cart” button:

Enabled when quantity > 0.

Disabled and labeled “Out of Stock” when quantity === 0.

Cart summary with list of items and computed total price.

Admin
Login as an admin user.

Access a protected Admin Panel route.

View all sweets in a grid.

Create new sweets with:

Name

Description

Category

Price

Quantity (must be a non‑negative integer)

Optional emoji and image URL

Edit existing sweets (update all fields).

Delete sweets.

Form validation and error messages when backend validation fails (e.g., invalid quantity).

Tech Stack
Frontend Framework: React (with Vite)

Styling: Tailwind CSS v3

Routing: React Router DOM

HTTP Client: Axios

Icons: Lucide React

State Management: React Context (custom AuthContext)

Testing: Vitest + React Testing Library (configured, tests can be added)

Project Structure
bash
src/
  components/
    Navbar.jsx
    ProtectedRoute.jsx
    SweetCard.jsx
  context/
    AuthContext.jsx
  pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx
    Admin.jsx
  services/
    api.js
  test/
    setup.js
  App.jsx
  main.jsx
AuthContext.jsx – Handles authentication state and exposes user, isAuthenticated, login, logout.

api.js – Axios instance with base URL, auth header interceptor, and authAPI / sweetsAPI.

ProtectedRoute.jsx – Guards routes for authenticated users and admin-only access.

SweetCard.jsx – Reusable sweet card with dual modes (customer: purchase, admin: edit/delete).

Dashboard.jsx – Customer-facing sweets listing with search, filter, and cart.

Admin.jsx – Admin-facing CRUD interface.

Backend Setup
This frontend expects the Sweet Shop Management System backend running locally on port 4000 with MongoDB configured.

From the backend project directory:

bash
npm install
npm run dev   # or equivalent command to start the server
By default, the backend should expose routes such as:

POST /api/auth/login

POST /api/auth/register

GET /api/sweets

POST /api/sweets

PUT /api/sweets/:id

DELETE /api/sweets/:id​

Seeding Admin User & Sweets
The backend includes a seed.js script that:

Connects to MongoDB via MONGODB_URI.

Clears existing User and Sweet collections.

Creates an admin user:

Email: admin@sweets.com

Password: AdminPass123!

Role: admin

Inserts sample sweets:

Gulab Jamun (quantity: 20, price: 50)

Rasgulla (quantity: 15, price: 40)

Kaju Barfi (quantity: 10, price: 200)​

Run the seed script (from backend folder):

bash
node seed/seed.js    # or the correct path, e.g., node seed.js
Note: Running this script will clear existing users and sweets and replace them with the seeded data.​

Frontend Setup
From the frontend project directory:

bash
# Install dependencies
npm install

# Start development server
npm run dev
The app will run at:

Frontend: http://localhost:3000

Backend (expected): http://localhost:4000

Environment & API Config
The frontend uses a fixed base URL pointing to the backend:

js
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const sweetsAPI = {
  getAll: () => api.get('/sweets'),
  getById: (id) => api.get(`/sweets/${id}`),
  create: (data) => api.post('/sweets', data),
  update: (id, data) => api.put(`/sweets/${id}`, data),
  delete: (id) => api.delete(`/sweets/${id}`),
};

export default api;
If the backend URL or port changes, update API_BASE_URL accordingly.

Usage Guide
Authentication Flow
Admin Login

Run the backend seed script to create the default admin.​

Go to http://localhost:3000/login.

Login with:

Email: admin@sweets.com

Password: AdminPass123!

After login, you are redirected to the Dashboard.

The navbar shows an Admin indicator and an “Admin Panel” link (visible only for admin role).

Customer Registration & Login

Go to http://localhost:3000/register.

Fill in name, email, password, and choose customer as role.

After successful registration, you are logged in and redirected to Dashboard.

Customers do not see the Admin Panel link.

Customer Dashboard
The Dashboard fetches sweets from /api/sweets on load and displays them in a responsive grid.​

Search:

Filters sweets by name and (optionally) description.

Category Filter:

Dropdown generated from distinct categories in the sweets list plus All.

Sweet Card:

Shows:

Emoji (if set) or a default candy emoji.

Name and short description.

Price (from price field).

Remaining stock (from quantity field).​

“Add to Cart”:

Enabled when quantity > 0.

Disabled and labeled “Out of Stock” when quantity === 0.

Cart Summary:

Fixed card in the corner when there are items.

Shows items with name, quantity, and line total.

Displays computed total price.

Admin Panel
Accessible at /admin only for authenticated admin users (protected route).

Sweets List:

Same underlying data as Dashboard, but cards show Edit and Delete buttons.

Add / Edit Sweet Form:

Fields:

Name (required)

Category (optional but recommended)

Description (optional)

Price (required, numeric)

Stock Quantity (required; converted to integer quantity for backend)

Emoji (optional)

Image URL (optional)

On submit:

For new sweet: calls POST /api/sweets.

For edit: calls PUT /api/sweets/:id.

Form performs basic validation and surfaces backend validation errors (e.g., “Quantity must be a non-negative integer”).

Delete Sweet:

Asks for confirmation via window.confirm.

On confirm, calls DELETE /api/sweets/:id and removes from list.

Testing
The project is configured with Vitest and React Testing Library.

Global test config is in vite.config.js under test section.

Setup file is src/test/setup.js (includes Jest DOM matchers).

Available script:

bash
npm test
You can add component/page tests under src/**/*.test.jsx.

AI Usage Policy & Git Workflow
This project uses AI tools as part of the development workflow. For every commit where an AI assistant contributed (e.g., generating boilerplate, helping with tests, suggesting refactors), add it as a co-author:

Example commit message:

bash
git commit -m "feat: implement dashboard and admin UI

Used an AI assistant to generate initial layout and refine state management.

Co-authored-by: Perplexity AI <perplexity@users.noreply.github.com>"
This maintains transparency and proper attribution.

Future Improvements
Add full test coverage for:

Auth flow (Login/Register components)

Dashboard filtering logic

Admin CRUD operations

Implement persistent cart with backend or localStorage.

Add pagination or infinite scroll for large sweets lists.

Enhance error boundary handling for network and render errors.

Add role management UI (promote/demote users) on the admin side.

License
This project respects all relevant copyrights and intellectual property.
Adapt or extend the license section to match your backend repository’s license.

