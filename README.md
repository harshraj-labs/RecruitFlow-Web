# RecruitFlow - Application Management Dashboard

![RecruitFlow](https://img.shields.io/badge/RecruitFlow-v1.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

A full-stack web application that automates the validation and management of internship applications. Built to solve a real HR pain point - manually checking hundreds of application submissions for correct file formats and naming conventions.

## 🌐 Live Demo

**[https://recruitflow-web-labs.vercel.app](https://recruitflow-web-labs.vercel.app)**

## 🎯 Problem 

When companies receive internship applications via Google Forms, applicants submit:
- Resume (PDF)
- ID Card (Image)
- Project Showcase (Video)

**The Problem:** HR teams manually check hundreds of files for:
- Correct naming format (`FirstName_LastName_FileType.ext`)
- Correct file extensions
- Missing files
- Capitalization errors

**This is time-consuming, error-prone, and scales poorly.**

## ✨ Solution

RecruitFlow automates the entire validation process:
1. Import applicant data directly from Google Forms CSV export
2. Upload all submitted files in bulk
3. System automatically validates every file
4. Generates instant eligibility reports
5. Export results as CSV for further processing

## 🚀 Features

- **🔐 Authentication** - Secure JWT-based login/register system
- **📊 Dashboard** - Real-time stats (Total/Eligible/Rejected/Pending)
- **📁 Batch Management** - Organize applications by intake/batch
- **📤 Two-Step Upload** - CSV import + bulk file validation
- **✅ Auto Validation** - Checks naming conventions and file formats
- **📋 Applicants Table** - View all applicants with status badges
- **📥 CSV Export** - Download eligible/rejected/all reports
- **🔍 Batch Filtering** - View stats per batch or combined
- **📱 Responsive UI** - Works on all screen sizes

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Axios | API Calls |
| Lucide React | Icons |
| Vite | Build Tool |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| PostgreSQL | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Multer | File Uploads |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| Render PostgreSQL | Database Hosting |

## 📂 Project Structure

```
RecruitFlow-Web/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── ApplicantsTable.tsx
│   │   │   ├── CreateBatchModal.tsx
│   │   │   ├── UploadFilesSection.tsx
│   │   │   └── DownloadDropdown.tsx
│   │   ├── pages/              # Full page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── services/           # API service layer
│   │   │   └── api.ts
│   │   └── types/              # TypeScript interfaces
│   │       └── index.ts
│   └── vercel.json             # Vercel SPA routing config
│
└── server/                     # Node.js Backend
    └── src/
        ├── config/
        │   ├── database.js     # PostgreSQL connection
        │   └── init-db.js      # Auto table creation
        ├── controllers/
        │   ├── authController.js
        │   ├── batchController.js
        │   └── DashboardController.js
        ├── middleware/
        │   └── authMiddleware.js  # JWT verification
        ├── routes/
        │   ├── authRoutes.js
        │   ├── batchRoutes.js
        │   └── DashboardRoutes.js
        └── index.js            # Server entry point
```

## 🏃 Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### Setup

**1. Clone the repository:**
```bash
git clone https://github.com/harshraj-labs/RecruitFlow-Web.git
cd RecruitFlow-Web
```

**2. Setup Backend:**
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=recruitflow
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

**3. Setup Frontend:**
```bash
cd client
npm install
npm run dev
```

**4. Open:** `http://localhost:5173`

## 📋 File Naming Convention

For applicants to be marked **Eligible**, files must follow this exact format:

| File | Required Format | Valid Extensions |
|------|----------------|-----------------|
| Resume | `FirstName_LastName_Resume.pdf` | `.pdf` |
| ID Card | `FirstName_LastName_ID.jpg` | `.jpg` `.jpeg` `.png` |
| Project | `FirstName_LastName_Project.mp4` | `.mp4` `.avi` `.mov` |

**⚠️ Strict Rules:**
- Capitalization must be exact
- Underscores required between parts
- Wrong naming = automatic rejection with detailed reason

## 🔄 How It Works

```
1. HR uploads Google Forms CSV export
         ↓
2. System creates a batch with applicant list
         ↓
3. HR uploads all submitted files in bulk
         ↓
4. System validates each file per applicant:
   - Checks file exists
   - Checks naming convention
   - Checks file extension
   - Checks capitalization
         ↓
5. Dashboard shows real-time results
         ↓
6. HR downloads CSV reports for:
   - Eligible candidates (for next round)
   - Rejected candidates (with reasons)
```


## 🔮 Future Enhancements

- [ ] Email notifications to rejected applicants
- [ ] Bulk applicant file download
- [ ] Interview scheduling integration
- [ ] Analytics and charts
- [ ] Multi-recruiter collaboration
- [ ] Mobile app (React Native)

## 👤 Author

**Harsh Raj**
- GitHub: [@harshraj-labs](https://github.com/harshraj-labs)
- LinkedIn: [@harshrajlabs](https://linkedin.com/in/harshrajlabs)

## 📄 License

MIT License - feel free to use this project as inspiration!

---

> **Also check out [RecruitFlow CLI](https://github.com/harshraj-labs/RecruitFlow-C)** - the original C-based version of this tool that inspired this webapp!

⭐ **Star this repo if you found it useful!**