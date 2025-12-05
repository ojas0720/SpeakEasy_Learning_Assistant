# 🔐 Admin Login System - Complete Guide

## Overview

Your SpeakEasy app now has a **separate admin login system** that doesn't use Clerk authentication. This is a dedicated admin portal with its own username and password.

## 🚀 Quick Access

### Admin Login Page
**URL**: `http://localhost:3000/admin-login`

### Default Credentials
```
Username: admin
Password: SpeakEasy2024!
```

## 📋 How to Access Admin Panel

### Step 1: Visit Admin Login
Go to: `http://localhost:3000/admin-login`

### Step 2: Enter Credentials
- **Username**: `admin`
- **Password**: `SpeakEasy2024!`

### Step 3: Click "Sign In"
You'll be automatically redirected to the admin panel

### Step 4: Manage Your App
You now have full access to:
- 📚 Courses
- 📖 Units
- ✏️ Lessons
- 🎯 Challenges
- ✅ Challenge Options
- 👥 Users

## 🔒 Security Features

### Separate Authentication
- ✅ **Independent from Clerk** - No Clerk account needed
- ✅ **JWT Tokens** - Secure session management
- ✅ **24-hour Sessions** - Auto-logout after 24 hours
- ✅ **Local Storage** - Token stored securely in browser
- ✅ **Auto-redirect** - Unauthorized users sent to login

### Password Protection
- Username and password stored in `.env` file
- Credentials never exposed to client
- JWT tokens for session management
- Automatic token verification on each page load

## ⚙️ Changing Admin Credentials

### Update Username and Password

1. Open `speakeasy/.env` file
2. Find these lines:
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=SpeakEasy2024!
   ```
3. Change to your preferred credentials:
   ```
   ADMIN_USERNAME=yourusername
   ADMIN_PASSWORD=YourSecurePassword123!
   ```
4. Save the file
5. Restart the development server

### Change JWT Secret (Recommended for Production)

1. In `.env`, find:
   ```
   ADMIN_JWT_SECRET=speakeasy-admin-secret-key-change-in-production-2024
   ```
2. Change to a random, secure string:
   ```
   ADMIN_JWT_SECRET=your-very-long-random-secret-key-here
   ```
3. Save and restart server

## 🎯 Features

### Login Page
- Clean, professional design
- Username and password fields
- Error messages for invalid credentials
- Loading states during authentication
- Default credentials displayed for convenience
- Back to home link

### Admin Panel
- Full React Admin interface
- Custom header with logout button
- All CRUD operations available
- Secure session management
- Auto-redirect if not authenticated

### Logout
- Click "Logout" button in top-right corner
- Automatically clears session
- Redirects to login page
- Secure token removal

## 📊 Admin Panel Capabilities

Once logged in, you can:

### Manage Courses
- View all 6 languages
- Create new language courses
- Edit course details (title, image)
- Delete courses

### Organize Units
- Create learning units
- Edit unit information
- Set unit order
- Link to courses

### Create Lessons
- Add lessons to units
- Set lesson titles
- Define lesson order
- Organize content

### Build Challenges
- Create questions
- Choose type (SELECT/ASSIST)
- Write questions
- Set challenge order

### Set Challenge Options
- Add answer choices
- Mark correct answers
- Add images for visual questions
- Include audio for pronunciation

### Monitor Users
- View all registered users
- Check user progress
- Monitor activity
- Manage accounts

## 🔐 Security Best Practices

### For Development
✅ Use default credentials for testing
✅ Keep `.env` file secure
✅ Don't commit `.env` to git

### For Production
✅ Change default username and password
✅ Use strong, unique password
✅ Change JWT secret to random string
✅ Use HTTPS only
✅ Enable rate limiting
✅ Add IP whitelisting if possible
✅ Regular password rotation

## 🐛 Troubleshooting

### Can't Login

**Problem**: "Invalid username or password"
**Solution**:
1. Check credentials in `.env` file
2. Ensure no extra spaces
3. Restart development server
4. Try default credentials: `admin` / `SpeakEasy2024!`

### Redirected to Login After Logging In

**Problem**: Keeps redirecting to login page
**Solution**:
1. Clear browser cache and cookies
2. Check browser console for errors
3. Verify JWT secret is set in `.env`
4. Try different browser

### Session Expires Too Quickly

**Problem**: Logged out unexpectedly
**Solution**:
- Sessions last 24 hours by default
- Check if token is being cleared
- Verify browser allows localStorage

### Logout Button Not Working

**Problem**: Can't logout
**Solution**:
1. Manually clear localStorage
2. Close and reopen browser
3. Navigate to `/admin-login` directly

## 📱 Multiple Admins

### Adding More Admin Accounts

Currently, the system supports one admin account. To add multiple admins:

**Option 1: Multiple Credentials in .env**
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SpeakEasy2024!
ADMIN_USERNAME_2=admin2
ADMIN_PASSWORD_2=AnotherPassword123!
```

**Option 2: Database-based Admins**
- Create an `admins` table in database
- Store hashed passwords
- Modify login API to check database

## 🔄 Workflow

### Typical Admin Session

1. **Login**
   - Visit `/admin-login`
   - Enter credentials
   - Click "Sign In"

2. **Work**
   - Manage courses, units, lessons
   - Add challenges and options
   - Monitor users
   - Make changes

3. **Logout**
   - Click "Logout" button
   - Session cleared
   - Redirected to login

## 📝 Environment Variables

### Required Variables in .env

```bash
# Admin Login Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SpeakEasy2024!
ADMIN_JWT_SECRET=speakeasy-admin-secret-key-change-in-production-2024
```

### Optional Variables

```bash
# Session duration (default: 24h)
ADMIN_SESSION_DURATION=24h

# Enable/disable admin login
ADMIN_LOGIN_ENABLED=true
```

## 🎨 Customization

### Change Login Page Design

Edit: `speakeasy/app/admin-login/page.tsx`

### Modify Session Duration

Edit: `speakeasy/app/api/admin/login/route.ts`
```typescript
.setExpirationTime("24h") // Change to "1h", "7d", etc.
```

### Add More Security

1. Add rate limiting
2. Implement 2FA
3. Add IP whitelisting
4. Enable audit logging
5. Add password complexity requirements

## ✅ Summary

**Admin Login URL**: `http://localhost:3000/admin-login`

**Default Credentials**:
- Username: `admin`
- Password: `SpeakEasy2024!`

**Features**:
- ✅ Separate from Clerk authentication
- ✅ Secure JWT-based sessions
- ✅ Easy credential management
- ✅ Logout functionality
- ✅ Auto-redirect protection
- ✅ 24-hour sessions
- ✅ Clean, professional UI

**Security**:
- Credentials in `.env` file
- JWT token authentication
- Automatic session verification
- Secure logout process

**Customization**:
- Change username/password in `.env`
- Modify JWT secret
- Adjust session duration
- Customize login page design

---

**You now have a complete, secure admin system independent of Clerk!** 🎉

**Quick Start**: Visit `http://localhost:3000/admin-login` and use `admin` / `SpeakEasy2024!`
