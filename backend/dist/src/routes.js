"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./middleware/auth");
const rateLimit_1 = require("./middleware/rateLimit");
const validation_1 = require("./middleware/validation");
const authController = __importStar(require("./controllers/authController"));
const horoscopeController = __importStar(require("./controllers/horoscopeController"));
const journalController = __importStar(require("./controllers/journalController"));
const adminController = __importStar(require("./controllers/adminController"));
const router = express_1.default.Router();
// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ========== AUTH ROUTES ==========
router.post('/auth/register', [
    (0, rateLimit_1.rateLimitMiddleware)({ windowMs: 15 * 60 * 1000, max: 5 }),
    (0, validation_1.validateRequest)('register'),
], authController.register);
router.post('/auth/login', [
    (0, rateLimit_1.rateLimitMiddleware)({ windowMs: 15 * 60 * 1000, max: 5 }),
    (0, validation_1.validateRequest)('login'),
], authController.login);
router.post('/auth/logout', auth_1.authMiddleware, authController.logout);
router.get('/auth/me', auth_1.authMiddleware, authController.getCurrentUser);
// ========== HOROSCOPE ROUTES ==========
router.get('/horoscope/today', auth_1.authMiddleware, (0, validation_1.validateRequest)('getTodayHoroscope'), horoscopeController.getTodayHoroscope);
router.get('/horoscope/:sign/:date', auth_1.authMiddleware, (0, validation_1.validateRequest)('getHoroscopeByDate'), horoscopeController.getHoroscopeByDate);
router.get('/horoscope/compatibility', auth_1.authMiddleware, (0, validation_1.validateRequest)('getCompatibility'), horoscopeController.getCompatibility);
// ========== JOURNAL ROUTES ==========
router.post('/journal', [
    auth_1.authMiddleware,
    (0, rateLimit_1.rateLimitMiddleware)({ windowMs: 60 * 1000, max: 10 }),
    (0, validation_1.validateRequest)('createJournal'),
], journalController.createJournal);
router.get('/journal', auth_1.authMiddleware, journalController.getJournals);
router.delete('/journal/:id', auth_1.authMiddleware, (0, validation_1.validateRequest)('deleteJournal'), journalController.deleteJournal);
router.get('/journal/export', auth_1.authMiddleware, journalController.exportJournals);
// ========== SAFETY & REPORTING ROUTES ==========
router.post('/report/distress', auth_1.authMiddleware, (0, validation_1.validateRequest)('reportDistress'), journalController.reportDistress);
router.get('/resources/crisis', horoscopeController.getCrisisResources);
// ========== USER PROFILE ROUTES ==========
router.put('/profile', auth_1.authMiddleware, (0, validation_1.validateRequest)('updateProfile'), authController.updateProfile);
router.post('/profile/export', auth_1.authMiddleware, authController.exportUserData);
router.delete('/profile', auth_1.authMiddleware, authController.deleteAccount);
// ========== ADMIN ROUTES (Protected) ==========
router.get('/admin/reports', auth_1.authMiddleware, auth_1.adminMiddleware, adminController.getDistressReports);
router.put('/admin/report/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (0, validation_1.validateRequest)('updateReport'), adminController.updateReportStatus);
router.get('/admin/metrics', auth_1.authMiddleware, auth_1.adminMiddleware, adminController.getMetrics);
router.put('/admin/horoscope/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (0, validation_1.validateRequest)('updateHoroscope'), adminController.updateHoroscope);
router.post('/admin/horoscope', auth_1.authMiddleware, auth_1.adminMiddleware, (0, validation_1.validateRequest)('createHoroscope'), adminController.createHoroscope);
// ========== ERROR HANDLING ==========
router.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
exports.default = router;
