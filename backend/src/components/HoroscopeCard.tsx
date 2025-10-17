import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HoroscopeCardProps {
  sign: string;
  content: string;
  actionPrompt: string;
  tags: string[];
}

// Zodiac sign colors and symbols
const ZODIAC_CONFIG: Record<string, { colors: string[]; symbol: string; emoji: string }> = {
  aries: { colors: ['#FF6B6B', '#EE5A6F'], symbol: '♈', emoji: '🐏' },
  taurus: { colors: ['#4ECDC4', '#44A08D'], symbol: '♉', emoji: '🐂' },
  gemini: { colors: ['#FFD93D', '#F6C90E'], symbol: '♊', emoji: '👯' },
  cancer: { colors: ['#A8E6CF', '#81C3D7'], symbol: '♋', emoji: '🦀' },
  leo: { colors: ['#FFA07A', '#FF7F50'], symbol: '♌', emoji: '🦁' },
  virgo: { colors: ['#DDA15E', '#BC6C25'], symbol: '♍', emoji: '👰' },
  libra: { colors: ['#FFB6C1', '#FF69B4'], symbol: '♎', emoji: '⚖️' },
  scorpio: { colors: ['#8B5CF6', '#7C3AED'], symbol: '♏', emoji: '🦂' },
  sagittarius: { colors: ['#F59E0B', '#D97706'], symbol: '♐', emoji: '🏹' },
  capricorn: { colors: ['#6B7280', '#4B5563'], symbol: '♑', emoji: '🐐' },
  aquarius: { colors: ['#60A5FA', '#3B82F6'], symbol: '♒', emoji: '🌊' },
  pisces: { colors: ['#A78BFA', '#8B5CF6'], symbol: '♓', emoji: '🐟' },
};

export default function HoroscopeCard({ sign, content, actionPrompt, tags }: HoroscopeCardProps) {
  const config = ZODIAC_CONFIG[sign.toLowerCase()] || ZODIAC_CONFIG.aries;
  
  return (
    <LinearGradient
      colors={config.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${sign} horoscope`}
    >
      <View style={styles.header}>
        <View style={styles.signContainer}>
          <Text style={styles.symbolEmoji} accessibilityHidden={true}>
            {config.emoji}
          </Text>
          <Text style={styles.signName} accessibilityRole="header">
            {sign.charAt(0).toUpperCase() + sign.slice(1)}
          </Text>
          <Text style={styles.symbol} accessibilityHidden={true}>
            {config.symbol}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.contentText} accessibilityRole="text">
          {content}
        </Text>
      </View>
      
      {actionPrompt && (
        <View style={styles.actionContainer}>
          <Text style={styles.actionLabel}>Today's Action:</Text>
          <Text style={styles.actionText} accessibilityRole="text">
            {actionPrompt}
          </Text>
        </View>
      )}
      
      {tags && tags.length > 0 && (
        <View style={styles.tagsContainer} accessibilityRole="list">
          {tags.map((tag, index) => (
            <View
              key={index}
              style={styles.tag}
              accessibilityRole="text"
              accessibilityLabel={`Tag: ${tag}`}
            >
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    marginBottom: 20,
  },
  signContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  signName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  symbol: {
    fontSize: 32,
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.8,
  },
  content: {
    marginBottom: 20,
  },
  contentText: {
    fontSize: 17,
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '400',
  },
  actionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});