# 🔐 SpeakEasy Admin Panel Access Guide

## Admin Panel Overview

Your SpeakEasy app has a comprehensive admin panel built with React Admin that allows you to manage all aspects of your language learning platform.

## 🌐 Access URL

**Admin Panel**: `http://localhost:3000/admin`

## 👤 Admin Credentials

### How Admin Authentication Works

SpeakEasy uses **Clerk** for authentication. Admin access is controlled by user IDs, not traditional username/password.

### Setting Up Admin Access

#### Step 1: Create Your Admin Account

1. **Visit**: `http://localhost:3000`
2. **Click**: "Sign Up" button
3. **Create Account** with:
   - **Email**: `admin@speakeasy.com` (or your preferred email)
   - **Password**: `Admin@123456` (or your preferred password)
4. **Complete** the sign-up process

#### Step 2: Get Your User ID

After signing up, you need to get your Clerk User ID:

**Method 1: From Clerk Dashboard**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Go to "Users" section
4. Find your admin account
5. Copy the User ID (starts with `user_`)

**Method 2: From Browser Console**
1. Sign in to your SpeakEasy account
2. Open browser console (F12)
3. Type: `localStorage.getItem('clerk-db-jwt')`
4. Decode the JWT token to find your user ID

**Method 3: From Database**
1. Check your `user_progress` table
2. The `userId` column contains Clerk user IDs

#### Step 3: Add Your User ID to .env

1. Open `speakeasy/.env` file
2. Find the line: `CLERK_ADMIN_IDS="user_abc123, user_def456"`
3. Replace with your actual User ID:
   ```
   CLERK_ADMIN_IDS="user_2abc123xyz456"
   ```
4. For multiple admins, separate with comma and space:
   ```
   CLERK_ADMIN_IDS="user_2abc123xyz456, user_2def789ghi012"
   ```
5. Save the file
6. Restart your development server

## 🎯 Quick Setup (For Testing)

### Recommended Test Admin Account

**Email**: `admin@speakeasy.com`
**Password**: `SpeakEasy2024!`

**Steps:**
1. Sign up with above credentials
2. Get your User ID from Clerk dashboard
3. Add to `.env` file
4. Restart server
5. Access `/admin`

## 📊 Admin Panel Features

### What You Can Manage

#### 1. **Courses** 📚
- **View**: All language courses (Spanish, French, German, Hindi, Kannada, Tamil)
- **Create**: New language courses
- **Edit**: Course titles and images
- **Delete**: Remove courses

**Fields:**
- Title (e.g., "Spanish", "French")
- Image Source (e.g., "/es.svg", "/fr.svg")

#### 2. **Units** 📖
- **View**: All units across all courses
- **Create**: New units for courses
- **Edit**: Unit titles and descriptions
- **Delete**: Remove units

**Fields:**
- Title (e.g., "Unit 1", "Unit 2")
- Description (e.g., "Learn the basics of Spanish")
- Course ID (which course this unit belongs to)
- Order (sequence number)

#### 3. **Lessons** ✏️
- **View**: All lessons in all units
- **Create**: New lessons
- **Edit**: Lesson titles and order
- **Delete**: Remove lessons

**Fields:**
- Title (e.g., "People", "Characters", "Basics")
- Unit ID (which unit this lesson belongs to)
- Order (sequence number)

#### 4. **Challenges** 🎯
- **View**: All challenges in all lessons
- **Create**: New challenges
- **Edit**: Challenge questions and types
- **Delete**: Remove challenges

**Fields:**
- Lesson ID (which lesson this challenge belongs to)
- Type (SELECT or ASSIST)
- Question (e.g., 'Which one of these is "the man"?')
- Order (sequence number)

**Challenge Types:**
- **SELECT**: Multiple choice with images
- **ASSIST**: Multiple choice text-only

#### 5. **Challenge Options** ✅
- **View**: All answer options for challenges
- **Create**: New answer options
- **Edit**: Option text, correctness, images, audio
- **Delete**: Remove options

**Fields:**
- Challenge ID (which challenge this option belongs to)
- Text (the answer text in target language)
- Correct (true/false - is this the right answer?)
- Image Source (optional, for SELECT type)
- Audio Source (optional, for pronunciation)

#### 6. **Users** 👥
- **View**: All registered users
- **Monitor**: User progress and activity
- **Manage**: User accounts

**User Information:**
- User ID
- Username
- Email
- Registration date
- Progress data

## 🛠️ Admin Panel Interface

### Navigation

The admin panel has a sidebar with all resources:

```
📚 Courses
📖 Units
✏️ Lessons
🎯 Challenges
✅ Challenge Options
👥 Users
```

### Actions Available

**For Each Resource:**
- **List View**: See all items in a table
- **Create**: Add new items with a form
- **Edit**: Modify existing items
- **Delete**: Remove items (with confirmation)
- **Filter**: Search and filter items
- **Sort**: Order by any column
- **Pagination**: Navigate through large datasets

### Example Workflows

#### Adding a New Language Course

1. Go to **Courses**
2. Click **Create**
3. Fill in:
   - Title: "Italian"
   - Image Source: "/it.svg"
4. Click **Save**
5. Course is now available!

#### Creating a New Lesson

1. Go to **Lessons**
2. Click **Create**
3. Fill in:
   - Title: "Food & Drinks"
   - Unit ID: Select the unit
   - Order: 6 (next in sequence)
4. Click **Save**

#### Adding Challenges to a Lesson

1. Go to **Challenges**
2. Click **Create**
3. Fill in:
   - Lesson ID: Select your lesson
   - Type: SELECT
   - Question: 'Which one of these is "apple"?'
   - Order: 1
4. Click **Save**
5. Now add Challenge Options (3 answers)

#### Adding Challenge Options

1. Go to **Challenge Options**
2. Click **Create** (do this 3 times for 3 options)
3. For each option:
   - Challenge ID: Select your challenge
   - Text: "la manzana" (correct answer)
   - Correct: true (for correct answer, false for others)
   - Image Source: "/apple.svg"
   - Audio Source: "/es_apple.mp3"
4. Click **Save**

## 🔒 Security Features

### Admin Protection

- **Authentication Required**: Must be signed in
- **Authorization Check**: User ID must be in `CLERK_ADMIN_IDS`
- **Automatic Redirect**: Non-admins redirected to homepage
- **Secure API**: All admin API routes protected

### Best Practices

1. **Keep Admin IDs Secret**: Don't share your `.env` file
2. **Use Strong Passwords**: For your Clerk account
3. **Limit Admin Access**: Only add trusted user IDs
4. **Regular Backups**: Backup your database regularly
5. **Monitor Changes**: Review admin actions periodically

## 🚀 Advanced Features

### Bulk Operations

- **Import**: Bulk import data via API
- **Export**: Export data to CSV/JSON
- **Batch Edit**: Edit multiple items at once
- **Batch Delete**: Remove multiple items

### Filtering & Search

- **Text Search**: Search by any field
- **Advanced Filters**: Combine multiple criteria
- **Date Ranges**: Filter by creation/update dates
- **Relationships**: Filter by related resources

### Data Validation

- **Required Fields**: Enforced on forms
- **Type Checking**: Ensures correct data types
- **Relationship Validation**: Checks foreign keys
- **Unique Constraints**: Prevents duplicates

## 📱 Mobile Access

The admin panel is responsive and works on:
- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile phones (limited functionality)

**Recommended**: Use desktop for best experience

## 🐛 Troubleshooting

### Can't Access Admin Panel

**Problem**: Redirected to homepage
**Solution**: 
1. Check you're signed in
2. Verify your User ID is in `.env`
3. Restart the development server
4. Clear browser cache

### Changes Not Saving

**Problem**: Form submission fails
**Solution**:
1. Check all required fields are filled
2. Verify database connection
3. Check browser console for errors
4. Ensure proper data types

### Can't See New Data

**Problem**: Created items don't appear
**Solution**:
1. Refresh the page
2. Check filters aren't hiding items
3. Verify database was updated
4. Check API responses in Network tab

## 📚 Additional Resources

### React Admin Documentation
- [Official Docs](https://marmelab.com/react-admin/)
- [Tutorial](https://marmelab.com/react-admin/Tutorial.html)
- [Demo](https://marmelab.com/react-admin-demo/)

### Clerk Documentation
- [User Management](https://clerk.com/docs/users/overview)
- [Authentication](https://clerk.com/docs/authentication/overview)
- [Dashboard](https://dashboard.clerk.com/)

## 🎓 Training Resources

### Video Tutorials
1. **Getting Started**: Introduction to admin panel
2. **Managing Courses**: Creating and editing courses
3. **Adding Content**: Lessons and challenges
4. **User Management**: Monitoring users

### Documentation
- `ADDING_CHALLENGES_GUIDE.md` - How to add challenges
- `PRONUNCIATION_FEATURE_GUIDE.md` - Pronunciation feature
- Database schema in `db/schema.ts`

## 📞 Support

### Getting Help

1. **Check Documentation**: Read this guide thoroughly
2. **Browser Console**: Check for error messages
3. **Database Logs**: Review database queries
4. **API Responses**: Inspect network requests

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't login | Check Clerk credentials |
| Not admin | Add User ID to `.env` |
| Data not saving | Check database connection |
| Images not showing | Verify file paths |
| Audio not playing | Check audio file format |

## ✅ Quick Checklist

Before using admin panel:
- [ ] Created admin account
- [ ] Got User ID from Clerk
- [ ] Added User ID to `.env`
- [ ] Restarted development server
- [ ] Can access `/admin` URL
- [ ] Can see all resources
- [ ] Can create/edit/delete items

## 🎯 Summary

**Admin URL**: `http://localhost:3000/admin`

**Setup Steps**:
1. Sign up at SpeakEasy
2. Get your Clerk User ID
3. Add to `CLERK_ADMIN_IDS` in `.env`
4. Restart server
5. Access admin panel

**What You Can Do**:
- Manage all courses, units, lessons
- Create and edit challenges
- Add challenge options with images/audio
- Monitor users
- Full CRUD operations on all data

**Security**:
- Clerk authentication required
- User ID authorization
- Protected API routes
- Automatic redirects for non-admins

---

**You now have complete control over your SpeakEasy platform!** 🎉
