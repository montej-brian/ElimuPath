# ElimuPath

ElimuPath is a web application designed to help Kenyan students find eligible university courses based on their KCSE (Kenya Certificate of Secondary Education) results.

## Project Structure

- `frontend/`: React application (Vite, Tailwind CSS)
- `backend/`: Express.js API (PostgreSQL, Redis)
- `docker-compose.yml`: Infrastructure for local development.

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (if not using Docker)

## Getting Started

### 1. Infrastructure Setup

Start the database and caching services using Docker:

```bash
docker compose up -d
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API will be available at `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## Architecture

- **Frontend**: React (JavaScript) with Vite.
- **Backend API**: Express (Node.js) with JWT authentication.
- **Database**: PostgreSQL for persistent storage.
- **Caching**: Redis for background jobs and caching.
- **Storage**: Local filesystem (development) / S3 (production).

---

&copy; 2026 ElimuPath - Helping Students Shape Their Futures
