# UniVault – Student Project and Skills Management Portal

UniVault is a web-based platform designed to manage student projects and skills in one centralized place. It provides an organized environment where students' projects and technical skills can be managed through dedicated administrative and teacher portals.

## Key Features

- **Home Page:** Displays the introduction and overview of the platform.
- **About Section:** Provides information about the platform.
- **Projects Management:** Displays and manages student projects.
- **Skills Management:** Organizes and displays technical skills.
- **Admin Dashboard:** Provides administrative management functionality.
- **Teacher Portal:** Provides a dedicated dashboard for teachers.
- **Authentication:** Secure login and role-based access.
- **Theme Customization:** Supports light and dark modes.
- **Contact Section:** Allows visitors to send messages.

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB
- Mongoose

## Project Structure

```text
UniVault/
│
├── client/          # Frontend application
│   ├── public/
│   └── src/
│
├── server/          # Backend application
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── validators/
│
└── .gitignore
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/harpreetkaur09/UniVault.git
```

### 2. Open the project folder

```bash
cd UniVault
```

### 3. Setup the backend

```bash
cd server
npm install
```

Configure the environment variables using the provided `.env.example` file. Add your own MongoDB connection string and other required configuration values.

Start the backend using the start script defined in `server/package.json`.

### 4. Setup the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Project Purpose

The main objective of UniVault is to provide a centralized platform for organizing student projects and technical skills while supporting administrative and teacher-level management.

## Repository

## Application Screenshots

### 1. Home Page
![Home Page](screenshots/home-page.png)

### 2. Login Page
![Login Page](screenshots/login-page.png)

### 3. Projects Page
![Projects Page](screenshots/projects-page.png)

### 4. Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

### 5. Dark Theme
![Dark Theme](screenshots/dark-theme.png)

GitHub: https://github.com/harpreetkaur09/UniVault

---

**Developed as a Major Project – B.Tech Computer Science and Engineering.**
