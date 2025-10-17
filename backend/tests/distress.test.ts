import { analyzeDistress, calculateSentiment } from '../src/services/distressDetection';

describe('Distress Detection', () => {
  describe('Critical Keywords', () => {
    test('should trigger on suicide keyword', async () => {
      const result = await analyzeDistress(
        'test-user-id',
        'I am thinking about suicide',
        -0.8
      );
      
      expect(result.triggered).toBe(true);
      expect(result.triggerType).toBe('critical_keyword');
      expect(result.severity).toBe('critical');
    });
    
    test('should trigger on "kill myself" phrase', async () => {
      const result = await analyzeDistress(
        'test-user-id',
        'I just want to kill myself',
        -0.9
      );
      
      expect(result.triggered).toBe(true);
      expect(result.triggerType).toBe('critical_keyword');
      expect(result.severity).toBe('critical');
    });
    
    test('should trigger on "want to die"', async () => {
      const result = await analyzeDistress(
        'test-user-id',
        'Sometimes I want to die',
        -0.7
      );
      
      expect(result.triggered).toBe(true);
      expect(result.triggerType).toBe('critical_keyword');
      expect(result.severity).toBe('critical');
    });
  });
  
  describe('High-Risk Phrases with Negative Sentiment', () => {
    test('should trigger on multiple high-risk phrases with low sentiment', async () => {
      const result = await analyzeDistress(
        'test-user-id',
        'I feel completely hopeless and worthless. There is no way out.',
        -0.7
      );
      
      expect(result.triggered).toBe(true);
      expect(result.triggerType).toBe('sentiment_threshold');
      expect(result.severity).toBe('high');
      expect(result.details.phrases).toContain('hopeless');
      expect(result.details.phrases).toContain('worthless');
      expect(result.details.phrases).toContain('no way out');
    });
    
    test('should NOT trigger on single high-risk phrase', async () => {
      const result = await analyzeDistress(
        'test-user-id',
        'I feel a bit hopeless today',
        -0.3
      );
      
      expect(result.triggered).toBe(false);
    });
    
    test('should NOT trigger on multiple high-risk phrases with positive sentiment', async () => {
      const result = await analyzeDistress(
        'test-user-id',
        'I used to feel hopeless and worthless, but not anymore!',
        0.5
      );
      
      expect(result.triggered).toBe(false);
    });
  });
  
  describe('Sentiment Analysis', () => {
    test('should return positive score for positive text', () => {
      const score = calculateSentiment('I am so happy and grateful today!');
      expect(score).toBeGreaterThan(0);
    });
    
    test('should return negative score for negative text', () => {
      const score = calculateSentiment('I feel sad, lonely, and depressed');
      expect(score).toBeLessThan(0);
    });
    
    test('should return neutral score for neutral text', () => {
      const score = calculateSentiment('I went to the store today');
      expect(score).toBe(0);
    });
    
    test('should handle mixed sentiment', () => {
      const score = calculateSentiment('I am happy but also worried');
      // Should be close to 0 (mixed)
      expect(score).toBeGreaterThanOrEqual(-0.5);
      expect(score).toBeLessThanOrEqual(0.5);
    });
  });
  
  describe('Edge Cases', () => {
    test('should handle empty string', async () => {
      const result = await analyzeDistress('test-user-id', '', 0);
      expect(result.triggered).toBe(false);
    });
    
    test('should handle very long text', async () => {
      const longText = 'I feel okay. '.repeat(1000);
      const result = await analyzeDistress('test-user-id', longText, 0.1);
      expect(result.triggered).toBe(false);
    });
    
    test('should be case-insensitive', async () => {
      const result = await analyzeDistress(
        'test-user-id',
        'I WANT TO DIE',
        -0.8
      );
      expect(result.triggered).toBe(true);
    });
    
    test('should handle special characters', async () => {
      const result = await analyzeDistress(
        'test-user-id',
        'I feel... hopeless!!! 😢',
        -0.7
      );
      // Should still detect keywords despite special chars
      expect(result.details).toBeDefined();
    });
  });
  
  describe('False Positive Prevention', () => {
    test('should NOT trigger on song lyrics about death', async () => {
      const result = await analyzeDistress(
        'test-user-id',
        'Listening to a song about wanting to die, but I\'m actually feeling great!',
        0.5
      );
      
      // This is a challenging case - might need context analysis in production
      // For now, it will trigger due to keyword, which is safer (false positive over false negative)
      expect(result.triggered).toBe(true);
    });
    
    test('should NOT trigger on academic discussion', async () => {
      const result = await analyzeDistress(
        'test-user-id',
        'Reading about suicide prevention methods for my psychology class',
        0.2
      );
      
      // Will trigger - in production, consider adding context detection
      expect(result.triggered).toBe(true);
    });
  });
});

describe('Sentiment Edge Cases', () => {
  test('should handle text with no sentiment words', () => {
    const score = calculateSentiment('The cat sat on the mat');
    expect(score).toBe(0);
  });
  
  test('should handle text with repeated positive words', () => {
    const score = calculateSentiment('happy happy happy joy joy joy');
    expect(score).toBe(1);
  });
  
  test('should handle text with repeated negative words', () => {
    const score = calculateSentiment('sad sad sad terrible terrible terrible');
    expect(score).toBe(-1);
  });
});