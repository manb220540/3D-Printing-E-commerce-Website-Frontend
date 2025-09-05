# 3D Printing E-commerce Website Frontend

This is the **frontend repository** for the 3D Printing E-commerce Website, a full-stack application that allows users to browse and purchase 3D printing products, place custom print orders, and manage their accounts.  
The frontend is built with **React**, styled with **Bootstrap**, and integrates with the backend APIs to provide real-time features such as authentication, order tracking, and an AI-powered chatbot.

---

## Features

- User authentication and session handling (login, register, logout).
- Product browsing with search and filter options.
- Shopping cart management and checkout process.
- Order management with real-time status updates and cancellation options.
- Custom 3D printing order form with file upload support.
- AI-powered chatbot integration via Gemini API for customer support.
- Responsive UI built with React and Bootstrap.

---

## Prerequisites

- Node.js (v16.x or higher recommended)
- Git
- Backend server running (see [Backend Repository](../print3d-backend))

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/manb220540/3D-Printing-E-commerce-Website-Frontend.git
cd 3D-Printing-E-commerce-Website-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project with the following variables:

```bash
REACT_APP_BACKEND_API= your_api_backend
REACT_APP_CHATBOT_API=your_api_backend/chatbot

```

- **REACT_APP_BACKEND_API:** The base URL of the backend API (used for authentication, products, orders, etc.).
- **REACT_APP_CHATBOT_API:** The endpoint for the AI chatbot integration.

### 4. Run the Application

- Development mode:

```bash
npm run start
```

- Build for production:

```bash
npm run build
```

---

## Project Structure

```bash
frontend/
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # Reusable React components
│   ├── pages/          # Application pages (Home, Products, Cart, Orders, Admin, etc.)
│   ├── services/       # API service calls using axios
│   ├── App.js          # Main React app
│   ├── index.js        # Entry point
├── .env                # Environment variables
├── package.json        # Project metadata and dependencies
```

---

## Dependencies

- **React** – Core UI framework
- **React Router DOM** – Client-side routing
- **Axios** – HTTP requests
- **Bootstrap & React-Bootstrap** – Styling and UI components
- **React Toastify** – Toast notifications
- **SweetAlert2** – Alert dialogs
- **js-cookie** – Manage cookies
- **jwt-decode** – Decode JWT tokens
- **xlsx, jspdf, jspdf-autotable** – Export reports
- **Three.js + @react-three/fiber + drei** – 3D rendering and model viewer
- **React Icons** – Icon library
  Dev utilities:
- **react-scripts** – Development/build scripts
- **testing-library** – React testing utilities
- **web-vitals** – Performance measurement

---

### Contributing

Feel free to fork this repository, submit issues, or create pull requests. Please follow the existing code style and update `.gitignore` if necessary.

---

### License

This project is licensed under the ISC License.

---

### Contact

For questions or support, please open an issue or contact the maintainer.
