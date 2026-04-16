# 🚀 Project Camp Backend

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=json-web-tokens&logoColor=white)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**A powerful RESTful API for collaborative project management**

Project Camp lets teams organize projects, break down work into tasks & subtasks, attach files, write notes, and collaborate securely with proper role-based access control.

---

## ✨ Features

- **Secure Authentication** — Register, login, email verification, forgot/reset password, refresh tokens
- **Role-Based Access Control** — Admin • Project Admin • Member (3-tier permissions)
- **Project Management** — Full CRUD + team member management
- **Task & Subtask System** — Hierarchical tasks with status tracking (Todo / In Progress / Done)
- **File Attachments** — Multiple files per task (Multer + secure handling)
- **Project Notes** — Rich collaboration notes (Admin-only creation)
- **Health Check Endpoint** — Ready for monitoring & deployment

---

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Refresh Tokens + bcrypt
- **File Uploads**: Multer
- **Email**: Nodemailer (verification & password reset)
- **Validation**: express-validator
- **Environment**: dotenv + CORS
- **Development**: Nodemon + ESLint + Prettier

---

## 📋 Prerequisites

- Node.js ≥ 18
- MongoDB (local or MongoDB Atlas)
- Git

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/gopaladhikari/project-camp-backend
cd project-camp-backend

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env

# 4. Start the server
npm run dev
```
