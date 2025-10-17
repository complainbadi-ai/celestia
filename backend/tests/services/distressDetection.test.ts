import { analyzeDistress, calculateSentiment, getRecentJournalEntries } from '../../src/services/distressDetection';
import { db } from '../../src/server';

// Mocking the database functions
jest.mock('../../src/server', () => ({
  db: {
    query: jest.fn(),
  },
}));

jest.mock('../../src/services/distressDetection', () => {
    const originalModule = jest.requireActual('../../src/services/distressDetection');
    return {
        ...originalModule,
        // We are not mocking getRecentJournalEntries anymore, we will mock db.query directly
    };
});

describe('analyzeDistress', () => {
    beforeEach(() => {
        (db.query as jest.Mock).mockClear();
    });

    // Test for critical keyword detection
    it('should trigger for critical keywords', async () => {
        const criticalKeywords = [
            'I want to commit suicide',
            'I want to kill myself',
            'I want to end my life',
            'I want to die',
            'I am better off dead',
            'There is no reason to live',
            'I want to end it all',
            'I will take my life',
        ];

        for (const keyword of criticalKeywords) {
            (db.query as jest.Mock).mockResolvedValue({ rows: [] });
            const result = await analyzeDistress('test-user', keyword, 0);
            expect(result.triggered).toBe(true);
            expect(result.triggerType).toBe('critical_keyword');
            expect(result.severity).toBe('critical');
        }
    });

    // Test for sentiment analysis
    it('should trigger for multiple high-risk phrases and low sentiment', async () => {
        const text = 'I feel hopeless and worthless.';
        const sentimentScore = -0.8;
        (db.query as jest.Mock).mockResolvedValue({ rows: [] });
        const result = await analyzeDistress('test-user', text, sentimentScore);

        expect(result.triggered).toBe(true);
        expect(result.triggerType).toBe('sentiment_threshold');
        expect(result.severity).toBe('high');
    });
    
    it('should trigger for severe sentiment threshold (3+ entries in 24 hours)', async () => {
        const text = 'I feel extremely bad.';
        const sentimentScore = -0.8;

        const mockJournalEntries = {
            rows: [
                { sentiment_score: -0.9, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000) },
                { sentiment_score: -0.8, created_at: new Date(Date.now() - 5 * 60 * 60 * 1000) },
                { sentiment_score: -0.75, created_at: new Date(Date.now() - 10 * 60 * 60 * 1000) },
            ],
        };

        (db.query as jest.Mock).mockResolvedValue(mockJournalEntries);

        const result = await analyzeDistress('test-user', text, sentimentScore);

        expect(result.triggered).toBe(true);
        expect(result.triggerType).toBe('sentiment_threshold');
        expect(result.severity).toBe('high');
    });

    // Test for frequency pattern
    it('should trigger for 7+ days of negative sentiment', async () => {
        const text = 'I feel sad.';
        const sentimentScore = -0.6;

        const mockJournalEntries = {
            rows: [
                { sentiment_score: -0.6, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
                { sentiment_score: -0.7, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
                { sentiment_score: -0.8, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
                { sentiment_score: -0.6, created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
                { sentiment_score: -0.7, created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
                { sentiment_score: -0.8, created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
                { sentiment_score: -0.6, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            ],
        };

        (db.query as jest.Mock).mockResolvedValue(mockJournalEntries);

        const result = await analyzeDistress('test-user', text, sentimentScore);

        expect(result.triggered).toBe(true);
        expect(result.triggerType).toBe('frequency_pattern');
        expect(result.severity).toBe('medium');
    });

    // Test for no distress
    it('should not trigger for neutral or positive sentiment', async () => {
        const text = 'I feel happy today.';
        const sentimentScore = 0.8;
        (db.query as jest.Mock).mockResolvedValue({ rows: [] });
        const result = await analyzeDistress('test-user', text, sentimentScore);

        expect(result.triggered).toBe(false);
        expect(result.triggerType).toBe(null);
        expect(result.severity).toBe('low');
    });
});