# Wispr 🕵️‍♂️

**Wispr** is a modern, anonymous social platform designed with a sleek Cyberpunk aesthetic. Built with a React frontend and a Node.js/Express backend, Wispr allows users to create encrypted identities, transmit thoughts, and interact with the community completely anonymously.

## Features ✨
- **Ghost Protocol Registration**: Create anonymous identities (aliases) rather than traditional accounts.
- **Global Feed**: A live feed of transmissions from around the neural net.
- **Cyberpunk UI**: Glassmorphism, neon glows (cyan, purple, pink), and a terminal-like experience.
- **Redux State Management**: Seamless real-time state synchronization for posts, auth, and notifications.
- **In-Memory Fallback**: Runs on a local MongoDB Memory Server automatically if a local MongoDB instance isn't detected.

## Tech Stack 🛠️
- **Frontend**: React, Vite, Redux Toolkit, TailwindCSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT Authentication

## Getting Started 🚀

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/004KUNAL/Wispr.git
   cd Wispr
   ```

2. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. Start the backend server (from the `backend` directory):
   ```bash
   npm run dev
   ```
   *Note: If you don't have a local MongoDB instance running, the backend will automatically download and start an in-memory MongoDB instance!*

2. Start the frontend development server (from the `frontend` directory):
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## License 📄
This project is licensed under the MIT License.
