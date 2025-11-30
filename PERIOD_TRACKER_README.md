# Period Tracker - Offline-First Menstrual Cycle Management App

## 🎯 Overview

A modern, privacy-focused period tracking web application that works entirely offline after the first load. All data is stored locally on your device using IndexedDB, ensuring complete privacy and no external dependencies.

## ✨ Features

### Core Features
- **Cycle Calendar** - Visual calendar interface for tracking period, symptoms, and events
- **Mood Tracker** - Log daily emotions with intensity levels
- **Personal Chat Assistant** - AI-powered offline chatbot for health tips (coming soon)
- **Food Tracker** - Cycle-phase-based nutrition recommendations
- **Gynecologist Finder** - Locate nearby healthcare providers using local geolocation
- **Health Statistics** - Visual charts and insights into your cycle patterns
- **Settings** - Customize cycle parameters and app preferences

### Security & Privacy
- ✅ 100% offline operation (after initial load)
- ✅ All data stored locally in IndexedDB
- ✅ Password hashing with bcryptjs
- ✅ No external API calls
- ✅ User & Admin authentication
- ✅ Data export/import for backup

## 🏗️ Architecture

```
client/
├── pages/              # Route components
│   ├── Index.tsx       # Homepage
│   ├── Calendar.tsx    # Cycle calendar
│   ├── Mood.tsx        # Mood tracker
│   ├── Chat.tsx        # Chat assistant
│   ├── Food.tsx        # Food guide
│   ├── Gynecologist.tsx # Doctor finder
│   ├── Stats.tsx       # Statistics dashboard
│   ├── Settings.tsx    # App settings
│   ├── Login.tsx       # Authentication
│   ├── Register.tsx    # User registration
│   └── NotFound.tsx    # 404 page
├── components/
│   ├── BottomNav.tsx   # Mobile navigation bar
│   ├── Layout.tsx      # App layout wrapper
│   ├── ProfilePopover.tsx # User profile menu
│   └── ui/             # Radix UI components
├── contexts/
│   └── AuthContext.tsx # Auth state management
├── lib/
│   ├── db.ts           # Dexie IndexedDB schema
│   ├── auth.ts         # Authentication utilities
│   ├── db-init.ts      # Database initialization
│   └── utils.ts        # Utility functions
├── App.tsx             # Main app with routing
├── global.css          # Global styles & theme
└── vite-env.d.ts       # Vite environment types
```

## 🗄️ Database Schema

### Users Table
```typescript
{
  id: number,
  name: string,
  email: string,
  passwordHash: string,
  role: 'user' | 'admin',
  profile: {
    cycleLength: number,      // default: 28
    lutealLength: number,     // default: 14
    lastPeriodStart?: string  // YYYY-MM-DD
  },
  createdAt: number
}
```

### Events Table
```typescript
{
  id: number,
  userId: number,
  date: string,                           // YYYY-MM-DD
  type: 'period' | 'symptom' | 'note' | 'pill' | 'mood',
  mood?: 'happy' | 'neutral' | 'sad' | 'angry' | 'tired' | 'excited',
  moodIntensity?: number,                 // 1-5
  note?: string,
  intensity?: number,                     // 1-5
  symptoms?: string[],
  createdAt: number,
  updatedAt: number
}
```

### Gynecologists Table
```typescript
{
  id: number,
  name: string,
  clinic: string,
  address: string,
  phone: string,
  lat?: number,
  lng?: number,
  notes?: string,
  specialization?: string,
  createdAt: number
}
```

### Settings Table
```typescript
{
  id: number,
  userId: number,
  cycleLength: number,
  lutealLength: number,
  periodLength: number,
  notificationsEnabled: boolean,
  theme: 'light' | 'dark' | 'auto',
  language: string,
  createdAt: number,
  updatedAt: number
}
```

## 🔐 Authentication

### Demo Account
- **Email**: demo@example.com
- **Password**: demo123

### User Roles
- **User**: Can track their cycle, view statistics, and access all features
- **Admin**: Can manage users, import gynecologist data, and export/import system data

### Password Security
- Passwords are hashed using bcryptjs (10 salt rounds)
- Never stored in plain text
- Verified securely during login

## 🚀 Getting Started

### Development
```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server with hot reload
pnpm build      # Build for production
pnpm typecheck  # Check TypeScript errors
pnpm test       # Run tests
```

### Features to Test

1. **Login/Register**: Create a new account or use demo credentials
2. **Calendar**: Click dates to add events (period, symptoms, mood, pills)
3. **Mood Tracker**: Log your emotions and intensity levels
4. **Food Guide**: View cycle-phase-specific nutrition tips
5. **Doctor Finder**: Search and locate nearby gynecologists (uses geolocation)
6. **Stats**: View charts of your cycle patterns and mood trends
7. **Settings**: 
   - Customize cycle length and phases
   - Toggle notifications
   - Switch theme (light/dark/auto)
   - Export/import data as JSON

## 🎨 Design & Styling

- **Framework**: TailwindCSS 3
- **Component Library**: Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Color Scheme**: 
  - Primary: Magenta/Pink (#EC4899)
  - Secondary: Purple (#8B5CF6)
  - Accent colors for cycle phases

### Custom CSS Variables
- `--primary`: Main brand color
- `--secondary`: Accent color
- `--period`, `--fertile`, `--ovulation`: Phase indicators
- Complete light/dark theme support

## 📊 Key Algorithms

### Cycle Prediction
Calculates the next expected period based on:
- Average cycle length (user-configurable)
- Last period start date
- Current date

### Distance Calculation (Gynecologist)
Uses the Haversine formula to calculate distances from user location to providers:
```
distance = 2 * R * asin(sqrt(sin²((lat2-lat1)/2) + cos(lat1) * cos(lat2) * sin²((lng2-lng1)/2)))
```

### Mood Trends
- Calculates average mood intensity per date
- Plots trends over the last 30 days
- Identifies patterns across cycle phases

## 🔄 Data Flow

1. **Initialization**: 
   - App loads AuthContext
   - Database initializes with demo user if needed
   - User either logs in or registers

2. **Authenticated State**:
   - Layout renders with BottomNav
   - All pages accessible
   - Data persisted in IndexedDB

3. **Data Operations**:
   - All CRUD operations happen locally
   - Changes sync to IndexedDB immediately
   - Export creates JSON backup
   - Import restores from backup

## 🎯 UI/UX Highlights

- **Mobile-First Design**: Responsive layout with bottom navigation
- **Bottom Nav Bar**: Quick access to all 8 main sections
- **Gradient Branding**: Modern pink-to-purple gradient
- **Smooth Interactions**: Transitions and hover effects
- **Accessibility**: Proper semantic HTML and ARIA labels
- **Dark Mode**: System preference detection or manual toggle

## 🔗 Navigation

### Bottom Navigation Items
1. **Home** - Overview and quick actions
2. **Calendar** - Monthly calendar with event logging
3. **Mood** - Emotion tracking with intensity levels
4. **Chat** - AI assistant (coming soon)
5. **Food** - Nutrition by cycle phase
6. **Gynecologist** - Doctor finder by distance
7. **Stats** - Analytics and trend visualization
8. **Settings** - App configuration

## 🚀 Deployment

### Local Build
```bash
pnpm build      # Creates dist/ folder
pnpm start      # Serves production build
```

### Cloud Deployment
The app is optimized for deployment to:
- **Netlify** (recommended) - Static hosting with serverless functions
- **Vercel** - Edge functions and optimal performance
- **Any Static Hosting** - Just serve dist/spa/ folder

## 📝 Notes

- App requires IndexedDB support (modern browsers)
- First load may take a moment to initialize database
- All data is stored locally - clearing browser data will reset app
- Geolocation is optional for doctor finder feature
- Chat feature is placeholder and can be enhanced with ML models

## 🛣️ Future Enhancements

- [ ] Offline chatbot with ML models
- [ ] Reminder notifications
- [ ] CSV import for gynecologist data
- [ ] Wear OS/Apple Watch companion app
- [ ] Period prediction algorithms
- [ ] Community features (optional, with privacy)
- [ ] Symptom analysis
- [ ] PMS tracker
- [ ] Fertility window calculator

## 📄 License

Open source - feel free to customize and distribute.

## 🤝 Support

For issues or questions, refer to the codebase structure and existing implementations as examples.

---

**Made with ❤️ for women's health and privacy**
