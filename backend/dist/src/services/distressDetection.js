"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeDistress = analyzeDistress;
exports.calculateSentiment = calculateSentiment;
exports.createDistressReport = createDistressReport;
exports.shouldSendFollowUp = shouldSendFollowUp;
exports.markFollowUpSent = markFollowUpSent;
const server_1 = require("../server");
// Critical keywords that immediately trigger intervention
const CRITICAL_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
    'no reason to live', 'end it all', 'take my life'
];
// High-risk phrases that contribute to risk score
const HIGH_RISK_PHRASES = [
    'hopeless', 'no way out', 'can\'t go on', 'give up', 'worthless',
    'better off without me', 'burden', 'hate myself', 'want it to end'
];
/**
 * Analyzes journal entry for distress signals
 */
function analyzeDistress(userId, content, sentimentScore) {
    return __awaiter(this, void 0, void 0, function* () {
        const contentLower = content.toLowerCase();
        // Check for critical keywords (immediate trigger)
        const criticalMatch = CRITICAL_KEYWORDS.find(keyword => contentLower.includes(keyword));
        if (criticalMatch) {
            return {
                triggered: true,
                triggerType: 'critical_keyword',
                severity: 'critical',
                details: {
                    keyword: criticalMatch,
                    context: 'Critical keyword detected in journal entry'
                }
            };
        }
        // Check for multiple high-risk phrases + low sentiment
        const highRiskMatches = HIGH_RISK_PHRASES.filter(phrase => contentLower.includes(phrase));
        if (highRiskMatches.length >= 2 && sentimentScore < -0.6) {
            return {
                triggered: true,
                triggerType: 'sentiment_threshold',
                severity: 'high',
                details: {
                    phrases: highRiskMatches,
                    sentimentScore,
                    context: 'Multiple high-risk phrases with negative sentiment'
                }
            };
        }
        // Check for severe sentiment threshold (3+ entries in 24 hours)
        if (sentimentScore < -0.7) {
            const recentEntries = yield getRecentJournalEntries(userId, 24);
            const severeSentimentCount = recentEntries.filter(e => e.sentiment_score && e.sentiment_score < -0.7).length;
            if (severeSentimentCount >= 3) {
                return {
                    triggered: true,
                    triggerType: 'sentiment_threshold',
                    severity: 'high',
                    details: {
                        sentimentScore,
                        recentSevereCount: severeSentimentCount,
                        context: 'Sustained severe negative sentiment over 24 hours'
                    }
                };
            }
        }
        // Check for frequency pattern (7+ days of negative sentiment)
        if (sentimentScore < -0.5) {
            const weekEntries = yield getRecentJournalEntries(userId, 168); // 7 days
            const negativeDays = countConsecutiveNegativeDays(weekEntries);
            if (negativeDays >= 7) {
                return {
                    triggered: true,
                    triggerType: 'frequency_pattern',
                    severity: 'medium',
                    details: {
                        consecutiveNegativeDays: negativeDays,
                        context: 'Prolonged negative sentiment pattern detected'
                    }
                };
            }
        }
        // No distress detected
        return {
            triggered: false,
            triggerType: null,
            severity: 'low',
            details: {}
        };
    });
}
/**
 * Simple sentiment analysis (returns score from -1 to 1)
 * In production, consider using a library like sentiment or natural
 */
function calculateSentiment(text) {
    const positiveWords = [
        'happy', 'joy', 'love', 'great', 'wonderful', 'amazing', 'grateful',
        'blessed', 'thankful', 'excited', 'hopeful', 'peaceful', 'proud',
        'content', 'pleased', 'delighted', 'optimistic', 'confident'
    ];
    const negativeWords = [
        'sad', 'depressed', 'angry', 'terrible', 'awful', 'hate', 'hurt',
        'pain', 'lonely', 'anxious', 'worried', 'scared', 'hopeless',
        'worthless', 'miserable', 'devastated', 'overwhelmed', 'exhausted'
    ];
    const textLower = text.toLowerCase();
    const words = textLower.split(/\s+/);
    let score = 0;
    let matchCount = 0;
    words.forEach(word => {
        if (positiveWords.includes(word)) {
            score += 1;
            matchCount++;
        }
        else if (negativeWords.includes(word)) {
            score -= 1;
            matchCount++;
        }
    });
    // Normalize score to -1 to 1 range
    if (matchCount === 0)
        return 0;
    return Math.max(-1, Math.min(1, score / matchCount));
}
/**
 * Creates a distress report in the database
 */
function createDistressReport(userId, analysis) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!analysis.triggered)
            return;
        yield server_1.db.query(`INSERT INTO distress_reports 
     (user_id, trigger_type, trigger_details, severity, created_at)
     VALUES ($1, $2, $3, $4, NOW())`, [userId, analysis.triggerType, JSON.stringify(analysis.details), analysis.severity]);
    });
}
/**
 * Gets recent journal entries for a user
 */
function getRecentJournalEntries(userId, hoursBack) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield server_1.db.query(`SELECT sentiment_score, created_at 
     FROM journals 
     WHERE user_id = $1 
     AND created_at > NOW() - INTERVAL '${hoursBack} hours'
     AND deleted_at IS NULL
     ORDER BY created_at DESC`, [userId]);
        return result.rows;
    });
}
/**
 * Counts consecutive days with negative sentiment
 */
function countConsecutiveNegativeDays(entries) {
    if (entries.length === 0)
        return 0;
    // Group entries by day
    const dayGroups = new Map();
    entries.forEach(entry => {
        if (entry.sentiment_score !== null) {
            const day = entry.created_at.toISOString().split('T')[0];
            if (!dayGroups.has(day)) {
                dayGroups.set(day, []);
            }
            dayGroups.get(day).push(entry.sentiment_score);
        }
    });
    // Calculate average sentiment per day
    const dayAverages = Array.from(dayGroups.entries())
        .map(([day, scores]) => ({
        day,
        avgSentiment: scores.reduce((a, b) => a + b, 0) / scores.length
    }))
        .sort((a, b) => b.day.localeCompare(a.day)); // Most recent first
    // Count consecutive negative days from most recent
    let consecutiveDays = 0;
    for (const { avgSentiment } of dayAverages) {
        if (avgSentiment < -0.5) {
            consecutiveDays++;
        }
        else {
            break; // Stop at first non-negative day
        }
    }
    return consecutiveDays;
}
/**
 * Checks if user should receive follow-up check-in
 */
function shouldSendFollowUp(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield server_1.db.query(`SELECT id FROM distress_reports
     WHERE user_id = $1
     AND created_at > NOW() - INTERVAL '24 hours'
     AND created_at < NOW() - INTERVAL '23 hours'
     AND follow_up_sent = false
     LIMIT 1`, [userId]);
        return result.rows.length > 0;
    });
}
/**
 * Marks follow-up as sent
 */
function markFollowUpSent(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield server_1.db.query(`UPDATE distress_reports
     SET follow_up_sent = true
     WHERE user_id = $1
     AND follow_up_sent = false
     AND created_at > NOW() - INTERVAL '24 hours'`, [userId]);
    });
}
