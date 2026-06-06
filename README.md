# AI Resume Analyzer

A production-quality full-stack web application that allows users to upload a resume (PDF/DOCX), specify a target job role, and receive comprehensive, AI-driven ATS feedback including an ATS score, skill gaps, strengths, weaknesses, and a learning roadmap.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, TypeScript, SQLite
- **AI**: Groq API (Llama 3.3 70B)
- **Document Parsing**: `pdf-parse`, `mammoth`

## Features
- **Upload & Parse**: Drag-and-drop PDF and DOCX file uploads.
- **AI Analysis**: Get detailed ATS scoring, missing skills, improvements, and project recommendations.
- **Dashboard**: A premium SaaS-like dashboard to visualize your resume's performance.
- **History**: View past analyses stored locally in SQLite.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A [Groq API Key](https://console.groq.com/)

### 1. Clone & Install Dependencies
Navigate to both the `frontend` and `backend` directories to install dependencies.

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables
In the `backend` directory, create a `.env` file (or copy `.env.example`) and add your Groq API key:

```env
PORT=5000
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 3. Run the Application
Open two terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 4. Access the App
Open your browser and navigate to `http://localhost:5173`.
Upload a resume and start analyzing!

## Deployment
- **Frontend**: Can be deployed easily to Vercel or Netlify by pointing the build command to `npm run build` and output directory to `dist`.
- **Backend**: Can be deployed to Render or Railway. Make sure to set the `GROQ_API_KEY` environment variable on your hosting provider. For a production deployment, consider migrating SQLite to PostgreSQL (using an ORM like Prisma).
