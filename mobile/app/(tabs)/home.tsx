
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const Card = ({ title, icon, screen, color }) => (
    <TouchableOpacity onPress={() => router.push(screen)}>
      <ThemedView style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <IconSymbol name={icon} size={32} color={color} />
        <ThemedText style={styles.cardText}>{title}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <ThemedView style={styles.header}>
          <IconSymbol name="sparkles" size={120} color={Colors[colorScheme ?? 'light'].tint} />
        </ThemedView>
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Welcome!</ThemedText>
        <ThemedText style={styles.subtitle}>What would you like to do today?</ThemedText>

        <View style={styles.cardContainer}>
          <Card title="Daily Horoscope" icon="star.fill" screen="/horoscope" color="#FFD700" />
          <Card title="Chat with AI" icon="message.fill" screen="/chat" color="#1E90FF" />
        </View>

        <ThemedView style={[styles.quoteContainer, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
          <ThemedText style={styles.quote}>"The best way to predict the future is to create it."</ThemedText>
          <ThemedText style={styles.quoteAuthor}>- Abraham Lincoln</ThemedText>
        </ThemedView>

      </ThemedView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  card: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  quoteContainer: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen;
