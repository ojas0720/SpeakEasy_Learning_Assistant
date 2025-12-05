# 🗣️ SpeakEasy Learning Assistant

An interactive language learning platform inspired by Duolingo, built with Next.js 14, featuring gamified lessons, pronunciation practice, progress tracking, and a comprehensive admin dashboard.

![SpeakEasy](public/mascot.png)

## ✨ Features

### 🎓 Learning Experience
- **Interactive Lessons**: Engaging language lessons with multiple challenge types
- **Pronunciation Practice**: Real-time pronunciation feedback and practice
- **Progress Tracking**: Visual progress indicators and learning streaks
- **Gamification**: Hearts system, XP points, and achievement quests
- **Leaderboard**: Compete with other learners globally
- **Multiple Languages**: Support for Spanish, French, German, Italian, Japanese, Hindi, Kannada, Tamil, and more

### 👨‍💼 Admin Features
- **Comprehensive Dashboard**: Manage courses, units, lessons, and challenges
- **User Management**: View and manage user progress and subscriptions
- **Content Creation**: Easy-to-use interface for adding new learning content
- **Analytics**: Track user engagement and learning metrics
- **Secure Authentication**: Separate admin authentication system

### 💎 Premium Features
- **Unlimited Hearts**: Never run out of attempts
- **Ad-Free Experience**: Uninterrupted learning
- **Stripe Integration**: Secure payment processing

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Neon PostgreSQL](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Text-to-Speech**: [Google Cloud TTS](https://cloud.google.com/text-to-speech)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Clerk account for authentication
- Stripe account for payments (optional)
- Google Cloud account for TTS (optional)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/ojas0720/SpeakEasy_Learning_Assistant.git
cd SpeakEasy_Learning_Assistant/speakeasy
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Disable telemetry
NEXT_TELEMETRY_DISABLED=1

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Neon PostgreSQL
DATABASE_URL=your_postgresql_connection_string

# Stripe (Optional)
STRIPE_API_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Configuration
CLERK_ADMIN_IDS="admin@yourdomain.com"
ENABLE_DEV_ADMIN=true

# Admin Login Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
ADMIN_JWT_SECRET=your_jwt_secret_key
```

4. **Set up the database**

Push the database schema:
```bash
npm run db:push
```

Seed the database with initial data:
```bash
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Check code formatting
- `npm run format:fix` - Fix code formatting
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed database with sample data
- `npm run db:prod` - Run production database scripts
- `npm run tts:generate` - Generate TTS audio files
- `npm run admin:get-id` - Get admin user ID

## 🎯 Usage

### For Learners

1. **Sign Up**: Create an account using Clerk authentication
2. **Choose a Course**: Select from available language courses
3. **Start Learning**: Complete lessons to earn XP and progress
4. **Practice Pronunciation**: Use the pronunciation feature to improve speaking
5. **Track Progress**: Monitor your learning journey on the dashboard
6. **Compete**: Check the leaderboard to see how you rank

### For Admins

1. **Access Admin Panel**: Navigate to `/admin-login`
2. **Login**: Use admin credentials (default: admin/SpeakEasy2024!)
3. **Manage Content**: Create and edit courses, units, lessons, and challenges
4. **Monitor Users**: View user progress and manage subscriptions
5. **Analytics**: Track platform usage and engagement

## 📖 Documentation

- [Adding Challenges Guide](ADDING_CHALLENGES_GUIDE.md)
- [Admin Access Guide](ADMIN_ACCESS_GUIDE.md)
- [Admin Quick Start](ADMIN_QUICK_START.md)
- [Admin Login Guide](ADMIN_LOGIN_GUIDE.md)
- [Pronunciation Feature Guide](PRONUNCIATION_FEATURE_GUIDE.md)
- [Technical Deep Dive Q&A](TECHNICAL_DEEP_DIVE_QA.md)
- [Project Exam Questions](PROJECT_EXAM_QUESTIONS.md)

## 🏗️ Project Structure

```
speakeasy/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication pages
│   ├── (main)/              # Main app pages
│   ├── (marketing)/         # Marketing/landing pages
│   ├── admin/               # Admin dashboard
│   ├── admin-login/         # Admin login page
│   ├── api/                 # API routes
│   └── lesson/              # Lesson pages
├── components/              # React components
│   ├── modals/             # Modal components
│   └── ui/                 # UI components (shadcn)
├── db/                      # Database configuration
│   ├── schema.ts           # Drizzle schema
│   └── queries.ts          # Database queries
├── lib/                     # Utility functions
├── public/                  # Static assets
├── scripts/                 # Utility scripts
└── store/                   # Zustand stores
```

## 🔐 Security

- Environment variables are used for sensitive data
- Admin authentication is separate from user authentication
- JWT tokens for admin sessions
- Stripe webhook signature verification
- SQL injection protection via Drizzle ORM

See [SECURITY.md](SECURITY.md) for more details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Ojas Patil**
- GitHub: [@ojas0720](https://github.com/ojas0720)
- Repository: [SpeakEasy Learning Assistant](https://github.com/ojas0720/SpeakEasy_Learning_Assistant)

## 🙏 Acknowledgments

- Original inspiration from Duolingo
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Authentication by [Clerk](https://clerk.com/)

## 📧 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] AI-powered conversation practice
- [ ] Speech recognition improvements
- [ ] More language courses
- [ ] Social features (friends, groups)
- [ ] Offline mode
- [ ] Advanced analytics dashboard
- [ ] Gamification enhancements

---

Made with ❤️ by Ojas Patil
