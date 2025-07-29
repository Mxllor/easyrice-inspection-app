# Rice Inspection App
Developed By Thanawin Ninkaew
A full-stack Rice Inspection App web application. This project is divided into two main folders:

* `frontend` – built with **Vite**, **React (TypeScript)**, **MUI (Material UI)**, and **Tailwind CSS**.
* `backend` – powered by **Node.js**, **Fastify**, **Prisma**, and **PostgreSQL**.

---

## 📁 Project Structure

```
easyrice-inspection-app/
│
├── frontend/   # React TS frontend with Vite, MUI, TailwindCSS
└── backend/    # Fastify backend with Prisma and PostgreSQL
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mxllor/easyrice-inspection-app.git
cd easyrice-inspection-app
```

---

## 📦 Backend Setup

### 📁 Navigate to the backend folder

```bash
cd backend
```

### 📋 Prerequisites

* Node.js ≥ 18
* PostgreSQL
* [Prisma CLI](https://www.prisma.io/docs/getting-started)

### ⚙️ Environment Setup

Create a `.env` file with the following:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
PORT=3000
```

### 🔧 Install dependencies

```bash
npm install
```

### 🔃 Generate Prisma Client

```bash
npx prisma generate
```

### 🛢️ Migrate database (optional)

```bash
npx prisma migrate dev --name init
```

### ▶️ Run the server

```bash
npm run dev
```

---

## 💻 Frontend Setup

### 📁 Navigate to the frontend folder

```bash
cd frontend
```

### ⚙️ Environment Setup

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 🔧 Install dependencies

```bash
npm install
```

### ▶️ Run the app

```bash
npm run dev
```

---

## 🛠 Tech Stack

### Frontend

* [React](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/)
* [MUI](https://mui.com/)
* [Tailwind CSS](https://tailwindcss.com/)

### Backend

* [Node.js](https://nodejs.org/)
* [Fastify](https://www.fastify.io/)
* [Prisma ORM](https://www.prisma.io/)
* [PostgreSQL](https://www.postgresql.org/)

---

## 📌 Notes

* Make sure PostgreSQL is running locally or accessible remotely.
* Ensure CORS is properly configured if frontend and backend are on different ports/domains.

---
