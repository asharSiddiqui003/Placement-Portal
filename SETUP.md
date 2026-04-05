# Quick Setup Guide

Get your Placement Preparation Portal running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Supabase

1. The Supabase database is already configured and ready to use
2. The database schema has been created with all necessary tables
3. Sample data has been seeded into the database

## Step 3: Environment Variables

Your Supabase credentials are already configured in the `.env` file.

## Step 4: Seed the Database (if needed)

If you need to re-seed the database with sample data, use the Supabase SQL editor to run:

```sql
-- The seed-data.sql file contains:
-- - 3 mock tests (DSA, Aptitude, Amazon)
-- - 20 interview questions
-- - 5 announcements
```

## Step 5: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your application!

## Step 6: Create Your Account

1. Click "Register here" on the login page
2. Fill in your details:
   - Name
   - Email
   - Password
   - Roll Number
   - Branch (CSE/ECE/ME/EE/CE)
   - Year (1-4)
   - CPI (optional)
3. Click "Create Account"

## Step 7: Explore Features

After logging in, you can:

### Dashboard
- View your application stats
- See placement prep modules
- Check company question banks
- Read announcements
- Access upcoming mock tests

### Mock Tests
- Take timed tests
- Get instant results
- Review correct answers
- Track your attempts history

### Question Bank
- Filter by company, topic, difficulty
- Search for specific questions
- Bookmark important questions
- View detailed explanations

### Resume Builder
- Upload your resume (PDF/DOC)
- Get ATS score instantly
- Receive improvement suggestions
- Access resume templates

### Analytics
- View branch-wise packages
- See company hiring trends
- Track your performance
- Analyze skill gaps

### Profile
- Update personal information
- Add companies you've applied to
- Track offers received
- Manage your account

## Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## Features Overview

✅ Supabase Authentication (Email/Password)
✅ PostgreSQL Database with RLS
✅ Responsive Design (Mobile + Desktop)
✅ Real-time Data Sync
✅ Mock Tests with Timer
✅ Auto-grading System
✅ ATS Resume Scoring
✅ Performance Analytics
✅ Question Bookmarking
✅ Dark Mode Ready (configurable)

## Troubleshooting

### Build errors?
```bash
npm install
npm run build
```

### Database not connecting?
- Check your `.env` file has correct Supabase credentials
- Verify your Supabase project is active

### Authentication not working?
- Make sure you're using a valid email format
- Password must be at least 6 characters
- Check Supabase Auth settings

## Need Help?

Check the main README.md for detailed documentation.

## What's Included

### Database Tables ✅
- user_profiles
- mock_tests
- test_attempts
- question_bank
- announcements
- resumes

### Sample Data ✅
- 3 mock tests with questions
- 20+ interview questions from top companies
- 5 announcements
- Ready for your data!

### Pages ✅
- Login/Register
- Dashboard
- Mock Tests
- Question Bank
- Resume Builder
- Analytics
- Profile

Happy Coding! 🚀
