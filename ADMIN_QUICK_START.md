# 🚀 Admin Panel - Quick Start Guide

## Get Admin Access in 5 Minutes

### Step 1: Sign Up (1 minute)

1. Visit: `http://localhost:3000`
2. Click **"Sign Up"**
3. Create account with:
   - **Email**: `admin@speakeasy.com`
   - **Password**: `SpeakEasy2024!`
4. Complete sign-up

### Step 2: Get Your User ID (2 minutes)

Run this command in your terminal:

```bash
npm run admin:get-id
```

This will show you all users and their IDs. Copy your User ID (looks like `user_2abc123xyz456`)

### Step 3: Add to .env (1 minute)

1. Open `speakeasy/.env`
2. Find this line:
   ```
   CLERK_ADMIN_IDS="user_abc123, user_def456"
   ```
3. Replace with your actual User ID:
   ```
   CLERK_ADMIN_IDS="user_2abc123xyz456"
   ```
4. Save the file

### Step 4: Restart Server (1 minute)

Stop your server (Ctrl+C) and restart:

```bash
npm run dev
```

### Step 5: Access Admin Panel

Visit: `http://localhost:3000/admin`

**You're now an admin!** 🎉

---

## What You Can Do

### Manage Everything:

- ✅ **Courses** - Add/edit languages
- ✅ **Units** - Organize lessons
- ✅ **Lessons** - Create learning content
- ✅ **Challenges** - Add questions
- ✅ **Challenge Options** - Set answers
- ✅ **Users** - View all users

### Quick Actions:

**Add a New Course:**
1. Go to "Courses"
2. Click "Create"
3. Enter title and image
4. Save

**Create a Lesson:**
1. Go to "Lessons"
2. Click "Create"
3. Select unit
4. Enter title and order
5. Save

**Add Challenges:**
1. Go to "Challenges"
2. Click "Create"
3. Select lesson
4. Choose type (SELECT/ASSIST)
5. Enter question
6. Save

---

## Troubleshooting

### Can't Access Admin?

**Check:**
1. ✅ Signed in?
2. ✅ User ID in `.env`?
3. ✅ Server restarted?
4. ✅ Using correct URL?

### Still Not Working?

Run the ID checker again:
```bash
npm run admin:get-id
```

Make sure your User ID matches exactly in `.env`

---

## Need More Help?

Read the full guide: `ADMIN_ACCESS_GUIDE.md`

---

**Admin URL**: `http://localhost:3000/admin`

**Test Credentials**:
- Email: `admin@speakeasy.com`
- Password: `SpeakEasy2024!`

(Remember to get your User ID after signing up!)
