# Celestia Horoscope App

## Overview
Celestia is a production-ready horoscope mobile application with ethical safeguards, distress detection, and privacy-first design. Built with React Native (Expo), Node.js/Express, PostgreSQL, and Redis.

## Tech Stack
- **Mobile**: React Native (Expo managed workflow) - Cross-platform iOS/Android
- **Backend**: Node.js + Express (TypeScript)
- **Database**: PostgreSQL (primary data) + Redis (sessions/caching)
- **Auth**: JWT-based authentication with bcrypt password hashing
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Docker Compose

## Prerequisites
- Node.js 18+ and npm/yarn
- Docker & Docker Compose
- Expo CLI: `npm install -g expo-cli`
- PostgreSQL 14+ (or use Docker)
- Redis 7+ (or use Docker)

## Quick Start (Local Development)

### 1. Clone and Install
```bash
git clone <repo-url>
cd celestia

# Install backend dependencies
cd backend
npm install
cd ..

# Install mobile dependencies
cd mobile
npm install
cd ..

# Install admin dependencies (optional)
cd admin
npm install
cd ..
```

### 2. Environment Setup
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values:
# DATABASE_URL=postgresql://user:pass@localhost:5432/celestia
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=your-secret-key-here
# ENCRYPTION_KEY=32-byte-hex-key

# Mobile
cp mobile/.env.example mobile/.env
# Edit mobile/.env:
# API_URL=http://localhost:3000
```

### 3. Start Services with Docker Compose
```bash
# Start all services (PostgreSQL, Redis, Backend, Admin)
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### 4. Database Setup
```bash
# Run migrations
cd backend
npm run migrate

# Seed database with horoscope data
npm run seed
```

### 5. Run Mobile App
```bash
cd mobile
expo start

# Press 'a' for Android emulator
# Press 'i' for iOS simulator
# Scan QR code with Expo Go app for physical device
```

## Running Tests

### Backend Tests
```bash
cd backend
npm test                  # Run all tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:coverage    # With coverage report
```

### Mobile Tests
```bash
cd mobile
npm test                 # Jest unit tests
npm run test:e2e        # Detox E2E tests (requires setup)
```

## Building Mobile Artifacts

### Android APK (Local)
```bash
cd mobile
expo build:android
# Or with EAS Build:
eas build --platform android --profile production
```

### iOS IPA (Requires macOS + Apple Developer Account)
```bash
cd mobile
eas build --platform ios --profile production
```

### Development Builds
```bash
# Create development client
cd mobile
expo run:android  # Android
expo run:ios      # iOS
```

## API Endpoints

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login and receive JWT
- `POST /auth/logout` - Invalidate session

### Horoscopes
- `GET /horoscope/today?sign={zodiac}` - Today's horoscope
- `GET /horoscope/:sign/:date` - Specific date horoscope
- `GET /horoscope/compatibility?sign1={}&sign2={}` - Compatibility

### Journal
- `POST /journal` - Create journal entry
- `GET /journal` - Get user's journal entries
- `DELETE /journal/:id` - Delete entry
- `GET /journal/export` - Export all entries

### Safety & Reporting
- `POST /report/distress` - Submit distress detection trigger
- `GET /resources/crisis` - Get localized crisis resources

### Admin (Protected)
- `GET /admin/reports` - View distress reports
- `PUT /admin/horoscope/:id` - Update horoscope content
- `GET /admin/metrics` - App usage metrics

## Architecture

### Mobile App Structure
- **Screens**: OnboardingScreen, HomeScreen, ProfileScreen, JournalScreen
- **Services**: API client, Auth service, Distress detection
- **Components**: Reusable UI components with accessibility support
- **Localization**: i18n-ready with locale files

### Backend Structure
- **Controllers**: Business logic for each domain
- **Middleware**: Auth, rate limiting, input validation
- **Models**: Database models with TypeScript types
- **Services**: Encryption, distress detection algorithms

### Database Schema
- **users**: id, email, password_hash, birthdate, zodiac_sign, created_at
- **journals**: id, user_id, content_encrypted, sentiment_score, created_at
- **distress_reports**: id, user_id, trigger_type, resolved, created_at
- **horoscopes**: id, zodiac_sign, date, content, tags, action_prompt

## Security Features
- JWT authentication with HTTP-only cookies option
- bcrypt password hashing (10 rounds)
- AES-256-GCM encryption for journal entries
- Rate limiting on auth endpoints (5 attempts per 15min)
- CORS protection
- Input validation and sanitization
- SQL injection prevention via parameterized queries

## Privacy & Safety
- **Age Gating**: Users < 14 require parental consent
- **Distress Detection**: Keyword + sentiment analysis triggers support resources
- **Data Minimization**: Only nickname, birthdate, timezone required
- **Encryption**: PII encrypted at rest, journals encrypted
- **User Controls**: Export data, delete account, opt-out of personalization
- **Retention**: Logs anonymized after 30 days, journals kept until deleted

## Monitoring & Observability
```bash
# View backend logs
docker-compose logs -f backend

# Access metrics endpoint (requires admin auth)
curl http://localhost:3000/admin/metrics \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Key Metrics**:
- DAU (Daily Active Users)
- Retention (D1, D7, D30)
- Distress report count
- Error rates
- API response times

## Deployment

### Staging
```bash
# Build and tag images
docker-compose -f docker-compose.prod.yml build

# Deploy to staging
# (Configure your CI/CD pipeline with GitHub Actions)
```

### Production
See `infra/terraform/main.tf.stub` for infrastructure as code template.

**Recommended Setup**:
- Kubernetes cluster (GKE, EKS, or AKS)
- Managed PostgreSQL (RDS, Cloud SQL, etc.)
- Managed Redis (ElastiCache, MemoryStore, etc.)
- CDN for static assets
- Secrets management (AWS Secrets Manager, Vault)

## Troubleshooting

### Mobile app won't connect to backend
- Ensure backend is running: `docker-compose ps`
- Check mobile/.env has correct API_URL
- For Android emulator, use `http://10.0.2.2:3000`
- For iOS simulator, use `http://localhost:3000`

### Database connection errors
- Verify PostgreSQL is running: `docker-compose ps postgres`
- Check DATABASE_URL in backend/.env
- Run migrations: `npm run migrate`

### Tests failing
- Ensure test database is seeded: `npm run seed:test`
- Clear Jest cache: `npm test -- --clearCache`
- Check for port conflicts (3000, 5432, 6379)

## Contributing
See CONTRIBUTING.md for guidelines.

## License
Proprietary - All rights reserved.

## Support
For issues, contact: support@celestia-app.example.com

## Safety Resources
- **US**: National Suicide Prevention Lifeline: 988
- **International**: https://findahelpline.com
- **Crisis Text Line**: Text HOME to 741741