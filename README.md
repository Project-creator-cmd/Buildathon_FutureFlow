# 🚀 FutureFlow - Complete Career Intelligence Portal

A production-ready, full-stack SaaS-style career guidance platform with Netflix-style splash screen, AI chatbot, community forum, and personalized career roadmaps.

## ✨ Features

### 🎬 Splash Screen
- Netflix-style full-screen animation
- Smooth fade + zoom effects
- Auto-transitions to landing page after 3 seconds

### 🏠 Landing Page
- Clean, minimal, professional SaaS design
- Hero section with CTA
- Feature highlights
- Smooth transitions

### 📝 2-Step Sign Up
**Step 1:** Basic Details
- Name, Email, Password
- 10th Marks, Current Education Level
- Progress indicator

**Step 2:** Strengths & Interests
- Multi-select pills for subjects
- Multi-select pills for career interests
- Visual feedback

### 🔐 Login with Confirmation
- Modal confirmation: "Do you want to log in?"
- Yes/No options
- Smooth authentication flow

### 📊 Professional Dashboard
- **Left Sidebar Navigation:**
  - Explore Careers
  - My Career Path
  - High-Demand Courses
  - Community Forum
  - AI Chatbot
  - Profile
  - Logout (with confirmation)

- **Top Header:**
  - Welcome message with username
  - Notification icon
  - Profile avatar

- **Dashboard Content:**
  - Stats cards (Careers Explored, Recommended Paths, Skills, Forum Posts)
  - Quick action cards
  - Recent activity feed

### 🔍 Explore Careers
- 20+ complete career roadmaps
- Filter by category
- Search functionality
- Career cards with:
  - Category badge
  - Description
  - Required stream
  - Salary range
  - View roadmap link

### 🗺️ Complete Career Roadmap (Career Detail)
Shows step-by-step journey:
1. 10th Class (with minimum marks required)
2. Intermediate/Diploma Stream
3. Entrance Exams (with full names)
4. Degree/Higher Studies (with duration)
5. Core Skills Required
6. Certifications
7. Internships (with duration)
8. Entry-Level Job (0-2 years) with salary
9. Mid-Level Job (3-6 years) with salary
10. Senior-Level Job (7-10 years) with salary
11. Alternative/Lateral Paths

### 🎯 My Career Path (Personalized)
- AI-powered recommendations based on:
  - 10th marks
  - Current education level
  - Subject strengths
  - Career interests
- Shows 3-5 ranked career suggestions
- Suitability score percentage
- Skill gap analysis
- Salary projections (Entry/Mid/Senior)
- 10-year growth timeline
- Improvement suggestions

### 📈 High-Demand Courses
- Trending careers based on market demand
- Filtered by user's education level and interests
- Shows:
  - Demand indicator badge
  - Market growth percentage
  - Salary range
  - Complete roadmap link

### 💬 Community Forum
- Ask questions
- Reply to discussions
- Like posts and replies
- View discussion threads
- Real-time interaction
- Purpose: Students clarify doubts before choosing careers

### 🤖 AI Chatbot
- Floating chat window
- Answer career-related questions
- Provide roadmap suggestions
- Explain exams
- Guide skill recommendations
- Quick reply buttons
- Clean modern chat UI

### 👤 Profile Page
- View user information
- 10th marks
- Education level
- Strengths and interests
- Edit profile button
- Update education level
- Regenerate career path

### 🚪 Logout Confirmation
- Modal: "Are you sure you want to log out?"
- Yes/No options
- Smooth logout flow

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for modern UI
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** & **Express.js**
- **MongoDB Local** (127.0.0.1:27017)
- **Mongoose** ODM
- **JWT** Authentication
- **bcrypt** for password hashing
- **Express Validator**

## 📋 Prerequisites

1. **Node.js** (v16 or higher) - https://nodejs.org/
2. **MongoDB Community Server** - https://www.mongodb.com/try/download/community
3. **MongoDB Compass** (Optional) - https://www.mongodb.com/try/download/compass

## 🚀 Installation & Setup

### Step 1: Install MongoDB

**Windows:**
```bash
# Download and install MongoDB Community Server
# Install as Windows Service
# MongoDB will start automatically on port 27017
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Step 2: Verify MongoDB is Running

Open MongoDB Compass and connect to:
```
mongodb://127.0.0.1:27017
```

### Step 3: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 4: Seed the Database

```bash
# From root directory
npm run seed
```

This creates:
- 20+ careers
- 30+ job roles
- 15 entrance exams
- 10 streams
- 25 skills
- Admin account

### Step 5: Start the Application

**Option 1: Run both servers together**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Step 6: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://127.0.0.1:27017/futureflow

## 🎨 UI/UX Design Features

✅ Netflix-style splash screen with animations
✅ Professional SaaS dashboard layout
✅ Fixed left sidebar navigation
✅ Sticky top header with user info
✅ Rounded cards with soft shadows
✅ Blue/Indigo gradient theme
✅ Smooth hover transitions
✅ Loading skeletons
✅ Toast notifications
✅ Confirmation modals
✅ Responsive design
✅ Clean typography (Inter font)
✅ Proper spacing and padding
✅ Modern pill-style tags
✅ Floating AI chatbot
✅ Timeline visualization for roadmaps

## 📁 Project Structure

```
futureflow/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── careerController.js
│   │   └── forumController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Career.js
│   │   ├── Stream.js
│   │   ├── Degree.js
│   │   ├── Exam.js
│   │   ├── Skill.js
│   │   ├── JobRole.js
│   │   └── ForumPost.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── careerRoutes.js
│   │   └── forumRoutes.js
│   ├── scripts/
│   │   └── seed.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SplashScreen.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── ChatBot.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ExploreCareers.jsx
│   │   │   ├── CareerDetail.jsx
│   │   │   ├── MyCareerPath.jsx
│   │   │   ├── HighDemandCourses.jsx
│   │   │   ├── CommunityForum.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json
├── .gitignore
└── README.md
```

## 🌱 Seed Data Included

- **20+ Careers:**
  - Software Engineer
  - Data Scientist
  - Doctor (MBBS)
  - Chartered Accountant
  - UI/UX Designer
  - Lawyer
  - MBA Graduate
  - Civil Servant (IAS/IPS)
  - Teacher
  - Research Scientist
  - Cybersecurity Analyst
  - Cloud Engineer
  - Digital Marketer
  - Product Manager
  - AI Engineer
  - And more...

- **30+ Job Roles** with salary ranges
- **15 Entrance Exams** (JEE, NEET, CAT, CLAT, GATE, etc.)
- **10 Streams** (Science PCM/PCB, Commerce, Arts, etc.)
- **25 Skills** (Programming, Data Analysis, Communication, etc.)

## 🔑 Default Credentials

**Admin Account:**
- Email: `admin@futureflow.com`
- Password: `admin123`

**Test Student:**
- Create your own by signing up at http://localhost:3000/signup

## 🎯 Key Features Checklist

✅ Splash screen with Netflix-style animation
✅ Landing page with hero section
✅ 2-step signup with progress indicator
✅ Login with confirmation modal
✅ Professional dashboard with sidebar
✅ Explore careers with filters
✅ Complete career roadmaps (10th → Senior Job)
✅ Personalized career recommendations
✅ High-demand courses section
✅ Community forum with posts/replies/likes
✅ AI chatbot with floating window
✅ Profile page with edit functionality
✅ Logout with confirmation modal
✅ MongoDB local connection
✅ JWT authentication
✅ Responsive design
✅ Modern SaaS UI/UX

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error: "connect ECONNREFUSED"**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use

**Backend (5000):**
- Change `PORT` in `backend/.env`

**Frontend (3000):**
- Change port in `frontend/vite.config.js`

## 🚀 Deployment

### MongoDB Atlas (Production)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/futureflow
```
5. Run seed script again

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register student
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Careers
- `GET /api/careers` - Get all careers
- `GET /api/careers/:id` - Get career details
- `POST /api/careers/personalized` - Generate personalized roadmap
- `GET /api/careers/high-demand` - Get high-demand careers

### Forum
- `GET /api/forum` - Get all posts
- `POST /api/forum` - Create post
- `POST /api/forum/:id/reply` - Reply to post
- `POST /api/forum/:id/like` - Like post

## 🎨 Design System

**Colors:**
- Primary: Blue (#2563eb) to Indigo (#4f46e5)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Error: Red (#ef4444)

**Typography:**
- Font Family: Inter
- Headings: Bold, 2xl-5xl
- Body: Regular, sm-base

**Components:**
- Cards: rounded-xl, shadow-md
- Buttons: rounded-lg, gradient backgrounds
- Inputs: rounded-lg, focus rings
- Pills: rounded-full, colored backgrounds

## 📄 License

MIT License

## 🤝 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@futureflow.com

---

Built with ❤️ for students planning their future careers
