# Placement Preparation Portal

A comprehensive full-stack web application for managing campus placement preparation activities, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### For Students
**Dashboard**: Overview of applications, offers, and upcoming interviews. **Mock Tests**: Timed assessments with auto-grading and detailed explanations. **Question Bank**: Searchable repository of interview questions from top companies. **Resume Builder**: Upload resumes and get instant ATS scoring with actionable feedback. **Analytics**: Visual insights into placement trends and personal performance. **Profile Management**: Track applications and manage personal information.

### Key Highlights
Real-time authentication with Supabase Auth. Responsive design with mobile-first approach. Beautiful animations with Framer Motion. Interactive charts with Recharts. PostgreSQL database with Row Level Security. ATS resume scoring algorithm. Bookmark questions for later review. Performance tracking across multiple test attempts.

## Tech Stack

**Frontend**: React v18, TypeScript, Tailwind CSS v3, Vite v6  
**Backend**: Supabase (PostgreSQL, Auth)

## Database Schema

### Tables
`user_profiles` for student information and placement data. `mock_tests` for test templates with questions. `test_attempts` for user test submissions and scores. `question_bank` for interview questions database. `announcements` for placement notifications. `resumes` for resume uploads with ATS scores.

## Getting Started

### Prerequisites
Node.js 18+ and npm. Supabase account.

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd placement-portal
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Database setup

The database schema has already been created. To seed sample data, run the SQL queries from `seed-data.sql` in your Supabase SQL editor.

5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### For New Users
**Register**: Create an account with your details (name, roll number, branch, year, CPI). **Explore Dashboard**: View your stats and upcoming opportunities. **Take Mock Tests**: Practice with company-specific and general aptitude tests. **Browse Questions**: Search and filter questions by company, topic, and difficulty. **Upload Resume**: Get instant ATS feedback and improvement suggestions. **Track Progress**: View analytics and performance trends. **Manage Profile**: Update information and track applications.

### Default Test Credentials (if seeded)
None required - create your own account to get started!

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Layout.tsx      # Main layout with sidebar
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── lib/                # Utilities and configurations
│   └── supabase.ts    # Supabase client and types
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── MockTests.tsx
│   ├── QuestionBank.tsx
│   ├── ResumeBuilder.tsx
│   ├── Analytics.tsx
│   └── Profile.tsx
├── App.tsx             # Main app component with routing
└── main.tsx           # Entry point
```

## Features Breakdown

### Mock Tests
Timer-based assessments. One question at a time interface. Auto-submit on timeout. Instant grading with explanations. Track all past attempts. Filter by company.

### Question Bank
50+ curated questions. Filter by company, topic, difficulty. Search functionality. Bookmark important questions. Detailed explanations. Pagination support.

### Resume Builder
PDF/DOC upload support. Mock ATS scoring algorithm. Keyword detection. Actionable feedback. Resume history tracking. 3 professional templates.

### Analytics
Branch-wise package trends. Company hiring statistics. Personal performance tracking. Skill gap analysis. Topic-wise performance. Interactive charts.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Security Features
Row Level Security (RLS) on all tables. Authenticated-only access to data. User can only view/edit their own data. Secure password hashing with Supabase Auth. Protected API endpoints.

## Performance Optimizations
Code splitting with dynamic imports. Lazy loading of components. Optimized bundle size. Efficient database queries with indexes. Client-side caching for bookmarks.

## Browser Support
Chrome (latest). Firefox (latest). Safari (latest). Edge (latest).

## Contributing
Fork the repository. Create a feature branch. Commit your changes. Push to the branch. Open a pull request.

## License
MIT License - feel free to use this project for learning and development.

## Support
For issues and questions, please open an issue in the repository.

## Acknowledgments
Design inspiration from modern placement portals. Icons from Lucide React. UI components styled with Tailwind CSS. Database powered by Supabase.
