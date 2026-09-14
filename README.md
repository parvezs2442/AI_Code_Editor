# ⚡ VertexAI — Next-Gen Cloud Code Editor & AI Workspace

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react&logoColor=black" alt="React & Vite" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=nodedotjs&logoColor=white" alt="Node.js Express" />
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Auth-Firebase%20Admin-FFCA28?logo=firebase&logoColor=black" alt="Firebase Auth" />
  <img src="https://img.shields.io/badge/Architecture-Microservices-blueviolet" alt="Microservices" />
</p>

A powerful, full-stack cloud coding environment and project management platform built on a scalable **Microservices Architecture**. Features Firebase Google authentication, Redis distributed session management, a responsive multi-tab code editor, interactive file tree hierarchy, live preview, terminal integration, and an intelligent **VertexAI Chat Assistant**.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [User Workflow](#-user-workflow)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Environment Configuration](#2-environment-configuration)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Start Backend Microservices](#4-start-backend-microservices)
  - [5. Start Frontend Client](#5-start-frontend-client)
- [API Reference](#-api-reference)
- [Security & Environment Hardening](#-security--environment-hardening)
- [License](#-license)

---

## 🏗 System Architecture

The platform is designed around a decoupled, fault-tolerant microservice architecture orchestrated via a centralized **API Gateway**:

```mermaid
flowchart TD
    Client["Client Web App (React + Vite :5173)"]
    Gateway["API Gateway (Express :3000)"]
    AuthSvc["Auth Service (:3001)"]
    ProjectSvc["Project Service (:3002)"]
    FileSvc["File Service (:3003)"]
    Redis[("Redis Cache / Session Store :6379")]
    MongoAuth[("MongoDB Atlas - Auth DB")]
    MongoProj[("MongoDB Atlas - Project DB")]
    MongoFile[("MongoDB Atlas - File DB")]
    Firebase["Firebase Admin SDK"]

    Client -->|HTTP / Cookies| Gateway
    Gateway -->|/api/auth/*| AuthSvc
    Gateway -->|/api/project/*| ProjectSvc
    Gateway -->|/api/file/*| FileSvc

    AuthSvc <--> Redis
    AuthSvc <--> MongoAuth
    AuthSvc <--> Firebase

    ProjectSvc <--> Redis
    ProjectSvc <--> MongoProj

    FileSvc <--> MongoFile
```

---

## ✨ Key Features

### 🔐 Authentication & Session Security
- **Firebase Google Sign-In**: Client-side OAuth login via Firebase.
- **Backend Verification**: ID token verification using Firebase Admin SDK.
- **Distributed Sessions**: Cryptographically secure session IDs generated and cached in Redis with automatic TTL expiration.
- **HTTP-Only Cookies**: Protection against XSS and session hijacking.

### 📊 Modern Dashboard
- **Projects Overview**: Grid of user projects with real-time metadata.
- **Starred Projects**: Bookmark favorite projects with a single click without opening the editor.
- **Create Project Modal**: Intuitive modal with title, description, and instant validation.
- **Credit Counter**: Real-time AI credits tracker dynamically fetched from user profile.

### 💻 Rich IDE Workspace (`/project/:id`)
- **TopBar Navigation**:
  - `← VertexAI` quick link back to Dashboard.
  - Active project title with folder indicators.
  - Dedicated **Dashboard** button.
  - **Live Preview Toggle** switch.
- **Activity Bar (Sidebar)**:
  - **Dashboard Shortcut**: Return home with one click.
  - **File Explorer**: Browse and manage project folder hierarchies.
  - **VertexAI Chat**: Built-in coding assistant panel.
  - **Terminal**: Integrated console panel at the bottom.
  - **User Profile Popup (Bottom-Left)**: Displays user avatar, name, email, credits badge, Dashboard link, and Logout button.
- **Code Editor & Tabs**:
  - Multi-file tab navigation with active state tracking.
  - Syntax highlighted code editing.
- **Live Preview Pane**:
  - Renders project output in real time.
  - Supports fullscreen mode and responsive split-screen view.
- **Integrated Terminal**:
  - Bottom expandable terminal panel for command monitoring.

---

## 🔄 User Workflow

1. **Authentication**:
   - User visits the app and signs in via Google OAuth.
   - Auth Service validates credentials, provisions a User document in MongoDB, creates a Redis session, and sets an HTTP-only session cookie.
2. **Dashboard Management**:
   - User views existing projects or creates a new project using the **+ New Project** button.
   - User can star/unstar projects directly on the project card without leaving the page.
   - User opens any project by clicking the project title or **Open Project →**.
3. **Coding in IDE Workspace**:
   - File Service loads the project file tree hierarchy.
   - Selecting a file opens it in a new editor tab.
   - The user writes code, toggles the **Live Preview**, or interacts with the **AI Assistant**.
   - User can inspect credits or account info in the bottom-left avatar popover or return to the Dashboard at any time via TopBar/ActivityBar.

---

## 🛠 Tech Stack

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Frontend** | React 18, Vite, Redux Toolkit, Framer Motion, Lucide React, Axios, React Router v6 |
| **Styling** | Vanilla CSS, Tailwind CSS utilities, Modern Glassmorphism & Dark Mode Tokens |
| **API Gateway** | Express.js, `express-http-proxy`, CORS, Cookie Parser, Dotenv |
| **Auth Service** | Node.js, Express, Firebase Admin SDK, Mongoose, Redis (`ioredis`), Crypto |
| **Project Service** | Node.js, Express, Mongoose, Redis (`ioredis`), Dotenv |
| **File Service** | Node.js, Express, Mongoose, Tree Builder Utility, Dotenv |
| **Databases** | MongoDB Atlas (Cloud NoSQL), Redis (In-Memory Cache & Session Store) |
| **DevOps & Tools** | Docker, Docker Compose, Git |

---

## 📁 Repository Structure

```text
AI_Code_Editor/
├── .env.example                     # Root environment variable template
├── .gitignore                       # Master gitignore for secrets and builds
├── README.md                        # Documentation & setup guide
├── backend/
│   ├── docker-compose.yml           # Multi-container service orchestration
│   ├── package.json
│   ├── gateway/                     # Central API Gateway (Port 3000)
│   │   ├── index.js
│   │   ├── .env.example
│   │   └── package.json
│   ├── services/
│   │   ├── auth/                    # Authentication Service (Port 3001)
│   │   │   ├── config/              # DB & Firebase Admin config
│   │   │   ├── controllers/         # Login, getMe, logout, credits
│   │   │   ├── models/              # User Schema
│   │   │   ├── routes/              # Auth routes
│   │   │   ├── Dockerfile
│   │   │   └── .env.example
│   │   ├── project/                 # Project Management Service (Port 3002)
│   │   │   ├── controllers/         # Project CRUD & star toggle
│   │   │   ├── models/              # Project Schema
│   │   │   ├── routes/              # Project routes
│   │   │   └── .env.example
│   │   └── file/                    # File & Directory Service (Port 3003)
│   │       ├── controllers/         # File tree & file operations
│   │       ├── models/              # File Schema
│   │       ├── utils/               # Recursive tree builder
│   │       ├── Dockerfile
│   │       └── .env.example
│   └── shared/                      # Shared modules
│       └── redis/                   # Centralized Redis connection client
└── frontend/                        # React + Vite Client (Port 5173)
    ├── .env.example
    ├── .gitignore
    ├── firebase.js                  # Client Firebase configuration
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/              # ActivityBar, Editor, Explorer, TopBar, etc.
        ├── features/                # Axios API callers (auth, project, file)
        ├── pages/                   # Dashboard, ProjectPage, Plan
        ├── redux/                   # Redux slices (userSlice, projectSlice)
        └── utils/                   # Helper utilities
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance
- [Redis](https://redis.io/) (v6 or higher) running locally on port `6379`
- [Firebase Console](https://console.firebase.google.com/) project with Google Authentication enabled

---

### 1. Clone Repository

```bash
git clone https://github.com/parvezs2442/AI_Code_Editor.git
cd AI_Code_Editor
```

---

### 2. Environment Configuration

Copy the `.env.example` templates to `.env` in each service folder:

#### A. Gateway (`backend/gateway/.env`)
```env
PORT=3000
AUTH_URL=http://localhost:3001
PROJECT_URL=http://localhost:3002
FILE_URL=http://localhost:3003
REDIS_URL=redis://localhost:6379
```

#### B. Auth Service (`backend/services/auth/.env`)
```env
PORT=3001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/auth
REDIS_URL=redis://localhost:6379
NODE_ENV=development
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-firebase-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

#### C. Project Service (`backend/services/project/.env`)
```env
PORT=3002
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/project
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
```

#### D. File Service (`backend/services/file/.env`)
```env
PORT=3003
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/file
REDIS_URL=redis://localhost:6379
```

#### E. Frontend Client (`frontend/.env`)
```env
VITE_SERVER_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 3. Install Dependencies

Install root and workspace dependencies:

```bash
# Gateway
cd backend/gateway && npm install

# Auth Service
cd ../services/auth && npm install

# Project Service
cd ../project && npm install

# File Service
cd ../file && npm install

# Frontend
cd ../../../frontend && npm install
```

---

### 4. Start Backend Microservices

Ensure Redis is running (`redis-server`). Then launch each service:

```bash
# Terminal 1: Gateway
cd backend/gateway && npm start

# Terminal 2: Auth Service
cd backend/services/auth && npm run dev

# Terminal 3: Project Service
cd backend/services/project && npm run dev

# Terminal 4: File Service
cd backend/services/file && npm run dev
```

---

### 5. Start Frontend Client

```bash
cd frontend
npm run dev
```

Open your browser at **`http://localhost:5173`** to access the application!

---

## 📡 API Reference

All requests from the client route through the **API Gateway** on port `3000`:

| Service | Method | Gateway Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Authenticate with Firebase ID token & set cookie |
| **Auth** | `GET` | `/api/auth/me` | Fetch authenticated user data & credits |
| **Auth** | `POST` | `/api/auth/logout` | Revoke session & clear cookie |
| **Auth** | `POST` | `/api/auth/deduct` | Deduct credits for AI requests |
| **Project** | `GET` | `/api/project/` | Get all projects of current user |
| **Project** | `POST` | `/api/project/` | Create a new project |
| **Project** | `GET` | `/api/project/:id` | Get single project by ID |
| **Project** | `PATCH` | `/api/project/:id` | Toggle starred status |
| **Project** | `DELETE` | `/api/project/:id` | Delete project |
| **File** | `GET` | `/api/file/tree/:id` | Get file tree hierarchy for project |
| **File** | `POST` | `/api/file/` | Create a file or folder |
| **File** | `GET` | `/api/file/:id` | Get file contents |
| **File** | `PUT` | `/api/file/:id` | Save file content |
| **File** | `DELETE` | `/api/file/:id` | Delete file or folder |

---

## 🔒 Security & Environment Hardening

- **Zero Hardcoded Secrets**: All database connection strings, tokens, and keys are strictly loaded through environment variables.
- **Multi-Source Firebase Credential Loader**: Auth Service securely loads service credentials via environment variables without requiring sensitive JSON files in Git.
- **Git Ignore Protection**: Master [.gitignore](file:///d:/CodeEditor/.gitignore) protects all `.env*`, `.key`, `serviceAccountKey*.json`, and credential artifacts from accidental staging.
- **Audited Repository**: Verified through rigorous git status and history scanning before publishing.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
