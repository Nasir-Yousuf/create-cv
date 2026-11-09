# NovaCV — AI-Powered CV & Resume Builder SaaS Platform

> **"Make professional CV creation effortless, beautiful, intelligent, and accessible to everyone."**

NovaCV is a production-oriented, modern, and responsive AI-powered CV and Resume Builder SaaS platform built on the MERN stack with Google Gemini AI integration. Inspired by the intuitive design feel of Canva, the minimalism of Linear, and the clean structure of Notion, NovaCV enables anyone to build recruiter-grade, ATS-compliant CVs in minutes.

---

## 🌟 Key Features

### 🖥️ Public Experience & Template Gallery
- **Conversion-Optimized Landing Page**: Hero section, trust badges, 3-step workflow, transparent pricing tiers, and interactive FAQ accordion.
- **Interactive Live Preview Demonstration**: Switch between themes in real-time right from the hero section.
- **10+ Curated Production Templates**:
  - `Modern Minimal`: Ultra-clean, ATS-optimized layout with refined typography and subtle accents.
  - `Executive Slate`: Distinguished corporate design with dark header banner and serif hierarchy.
  - `Ocean Split`: Cool dual-column layout with left navy sidebar, skill visualizers, and avatar frame.
  - `ATS Classic`: Traditional single-column format engineered for 100% ATS parser compatibility.
  - `Creative Coral`: Vibrant design for designers and creatives with gradient accents and skill progress meters.
  - `Forest Pro`, `TechFlow`, `Academic Elegance`, `Sun Graduate`, `Breeze Compact`.
- **Searchable & Filterable Gallery**: Filter by 9 categories (Minimalist, Modern, Corporate, Creative, ATS-friendly, Executive, Student, Academic), live search, favorite toggles, and full-screen A4 preview modals.

### 📱 Responsive & Mobile-First Architecture
- Designed for mobile phones, tablets, and desktops.
- Dedicated mobile editor with 3 seamless modes:
  1. **Edit (Fill Resume)**: Touch-friendly forms and expandable sections.
  2. **Design**: Real-time typography, palette, and layout switcher.
  3. **Preview / Download**: Scaled interactive A4 paper sheet preview.

### 🤖 Google Gemini AI Suite (Backend Orchestration)
- Conversational CV generator from raw background descriptions.
- Professional summary writer with adjustable tones.
- Experience bullet quantifier (turning passive duties into quantifiable metric achievements).
- Smart skills suggestion engine based on target roles.
- Job description keyword matcher and ATS gap analyzer.

### 📄 Multi-Format Document Generation
- **Puppeteer Headless Engine**: High-resolution, multi-page vector PDF generation with print CSS formatting.
- **Genuine DOCX Generator**: Real Microsoft Word files using the `docx` library with editable headings, bullet points, and styles.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, React Router v6, React Hook Form, Lucide React, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JWT (HTTP-only cookies + Bearer), Zod, Helmet, Express Rate Limit, Morgan |
| **Database** | MongoDB Atlas with Mongoose Models (`User`, `CV`, `Template`, `Subscription`, `AIUsage`) |
| **AI Integration** | Google Gemini Generative AI SDK (`@google/generative-ai`) via secure backend endpoints |
| **Document Export** | Puppeteer (headless Chrome/Edge) + `docx` npm library |
| **Media Storage** | Cloudinary integration with local disk fallback |

---

## 📁 Monorepo Structure

```
create-cv/
├── client/                      # React 18 + Vite + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── app/                 # App routing & providers
│   │   ├── components/          # Reusable UI (Navbar, Footer, Button, Modal, Toast)
│   │   ├── features/            # Feature-sliced modules (Auth, Dashboard, Editor, AI, Exports)
│   │   ├── pages/               # LandingPage, TemplateGalleryPage, Editor, Dashboard
│   │   ├── services/            # Axios API client, authService, cvService, aiService, exportService
│   │   ├── store/               # Redux Toolkit (cvSlice, authSlice, uiSlice)
│   │   └── templates/           # 10 Production React Template Renderers
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Express.js + Mongoose + Puppeteer + Gemini SDK
│   ├── src/
│   │   ├── config/              # Database connection, env loader, multer
│   │   ├── controllers/         # Auth, CV, AI, Template, Export controllers
│   │   ├── middleware/          # authGuard, rateLimiter, errorHandler
│   │   ├── models/              # User, CV, Template, Subscription, AIUsage
│   │   ├── routes/              # /api/auth, /api/cvs, /api/ai, /api/export
│   │   ├── services/            # Gemini AI service, PDF generator, DOCX builder
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── shared/                      # Shared types, standard CV schema, template metadata
│   └── constants/               # INITIAL_CV_DATA, TEMPLATES_REGISTRY, design tokens
├── img/                         # Design inspirations and UI mockups
├── .env.example                 # Configuration template
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+ (Node 24 tested)
- [npm](https://www.npmjs.com/) v9+
- A Google Gemini API Key
- A MongoDB Atlas connection URI

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/Nasir-Yousuf/create-cv.git
cd create-cv

# Install root, client, and server dependencies
npm run install:all
```

### 3. Environment Configuration
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Fill in your credentials:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cv_builder?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key
```

### 4. Running Locally
Start both backend API and frontend Vite server concurrently:
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

---

## 🔒 Security & Privacy
- **Strict Separation of Secrets**: Gemini API keys and database credentials run exclusively on the backend.
- **Authentication**: Salted password hashing with `bcryptjs`, signed JWT tokens in HTTP-only cookies and Authorization headers.
- **CV Data Ownership**: Strict ownership verification for all reads, updates, exports, and deletions.
- **Safety**: Helmet HTTP headers, CORS origin restrictions, and rate limiting against brute force.

---

## 📄 License
This project is proprietary and built for personal and commercial SaaS portfolio deployment.
