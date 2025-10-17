
import express from 'express';
import { authMiddleware, adminMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { validateRequest } from './middleware/validation';
import * as authController from './controllers/authController';
import * as horoscopeController from './controllers/horoscopeController';
import * as journalController from './controllers/journalController';
import * as adminController from './controllers/adminController';
import * as chatController from './controllers/chatController';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ========== AUTH ROUTES ==========
router.post(
  '/auth/register',
  [
    rateLimitMiddleware({ windowMs: 15 * 60 * 1000, max: 5 }),
    validateRequest('register'),
  ],
  authController.register
);

router.post(
  '/auth/login',
  [
    rateLimitMiddleware({ windowMs: 15 * 60 * 1000, max: 5 }),
    validateRequest('login'),
  ],
  authController.login
);

router.post(
  '/auth/logout',
  authMiddleware,
  authController.logout
);

router.get(
  '/auth/me',
  authMiddleware,
  authController.getCurrentUser
);

// ========== HOROSCOPE ROUTES ==========
router.get(
  '/horoscope/today',
  authMiddleware,
  validateRequest('getTodayHoroscope'),
  horoscopeController.getTodayHoroscope
);

router.get(
  '/horoscope/:sign/:date',
  authMiddleware,
  validateRequest('getHoroscopeByDate'),
  horoscopeController.getHoroscopeByDate
);

router.get(
  '/horoscope/compatibility',
  authMiddleware,
  validateRequest('getCompatibility'),
  horoscopeController.getCompatibility
);

// ========== JOURNAL ROUTES ==========
router.post(
  '/journal',
  [
    authMiddleware,
    rateLimitMiddleware({ windowMs: 60 * 1000, max: 10 }),
    validateRequest('createJournal'),
  ],
  journalController.createJournal
);

router.get(
  '/journal',
  authMiddleware,
  journalController.getJournals
);

router.delete(
  '/journal/:id',
  authMiddleware,
  validateRequest('deleteJournal'),
  journalController.deleteJournal
);

router.get(
  '/journal/export',
  authMiddleware,
  journalController.exportJournals
);

// ========== CHAT ROUTES ==========
router.post(
  '/chat/send',
  [
    authMiddleware,
    rateLimitMiddleware({ windowMs: 60 * 1000, max: 20 }), // Allow more frequent chat messages
    validateRequest('sendMessage'),
  ],
  chatController.sendMessage
);

// ========== SAFETY & REPORTING ROUTES ==========
router.post(
  '/report/distress',
  authMiddleware,
  validateRequest('reportDistress'),
  journalController.reportDistress
);

router.get(
  '/resources/crisis',
  horoscopeController.getCrisisResources
);

// ========== USER PROFILE ROUTES ==========
router.put(
  '/profile',
  authMiddleware,
  validateRequest('updateProfile'),
  authController.updateProfile
);

router.post(
  '/profile/export',
  authMiddleware,
  authController.exportUserData
);

router.delete(
  '/profile',
  authMiddleware,
  authController.deleteAccount
);

// ========== ADMIN ROUTES (Protected) ==========
router.get(
  '/admin/reports',
  authMiddleware,
  adminMiddleware,
  adminController.getDistressReports
);

router.put(
  '/admin/report/:id',
  authMiddleware,
  adminMiddleware,
  validateRequest('updateReport'),
  adminController.updateReportStatus
);

router.get(
  '/admin/metrics',
  authMiddleware,
  adminMiddleware,
  adminController.getMetrics
);

router.put(
  '/admin/horoscope/:id',
  authMiddleware,
  adminMiddleware,
  validateRequest('updateHoroscope'),
  adminController.updateHoroscope
);

router.post(
  '/admin/horoscope',
  authMiddleware,
  adminMiddleware,
  validateRequest('createHoroscope'),
  adminController.createHoroscope
);

// ========== ERROR HANDLING ==========
router.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default router;
