# 💬 ComX

**Collaborate in Real-Time. Assign Tasks Seamlessly.**  
A modern full-stack platform for team communication and task management.

![Status](https://img.shields.io/badge/project-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech Stack](https://img.shields.io/badge/built%20with-React%2C%20Express%2C%20Socket.io%2C%20PostgreSQL-informational)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## 🔍 Overview

**ComX** is a scalable and responsive collaboration platform that combines real-time messaging and task management in one unified interface.  
Ideal for teams that need lightweight communication and coordination.

---

## ✨ Features

- 🗨️ Real-time group chat using WebSockets
- ✅ Create, assign, and track tasks within teams
- 🔒 Authentication system with roles
- 🧑‍🤝‍🧑 Multiple spaces and teams support
- 📱 Fully responsive UI built with React and Tailwind CSS

---

## 🛠 Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Frontend     | React, Tailwind CSS      |
| Backend      | Node.js, Express         |
| Communication| Socket.IO                |
| Database     | PostgreSQL               |
| Auth         | JWT                      |
| Package Mgmt | NPM                      |

---

## 🧰 Getting Started

### 📦 Prerequisites

- Node.js ≥ 18
- PostgreSQL installed locally
- Git

---

### 🔧 Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/RB133/comX
   cd ComX
    ```

2. **Install dependencies**

   ```bash
   cd server
   npm install

   cd ../client
   npm install
   ```

---

### ⚙️ Environment Variables

Create `.env` files in both `server/` and `client/` folders.

#### 📁 `server/.env`

```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/comx
JWT_SECRET=your_jwt_secret
```

#### 📁 `client/.env`

```
VITE_BACKEND_URL=http://localhost:5000
```

---

### 🏁 Running Locally

In separate terminals:

* **Start Backend:**

  ```bash
  cd server
  npm start
  ```

* **Start Frontend:**

  ```bash
  cd client
  npm run dev
  ```

App will be available at `http://localhost:5173`

---

## 🧪 Testing

Coming soon: unit and integration tests.

```bash
npm test
```

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

Built with ❤️ by [Pratham Jain](https://github.com/PrathamJain2601)
Designed to boost productivity through simplicity.
