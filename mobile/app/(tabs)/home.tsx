import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

const HomeScreen = () => {
  const { colorScheme = 'light' } = useColorScheme();
  const router = useRouter();

  const Card = ({ title, icon, screen, color }) => (
    <TouchableOpacity onPress={() => router.push(screen)}>
      <ThemedView style={[styles.card, { backgroundColor: Colors[colorScheme].card }]}>
        <IconSymbol name={icon} size={32} color={color} />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <ThemedView style={styles.header}>
          <IconSymbol name="sparkles" size={120} color={Colors[colorScheme].tint} />
        </ThemedView>
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Welcome!</ThemedText>
        <ThemedText type="subtitle">What would you like to do today?</ThemedText>

        <View style={styles.cardContainer}>
          <Card title="Daily Horoscope" icon="star.fill" screen="/horoscope" color="#FFD700" />
          <Card title="Chat with AI" icon="message.fill" screen="/chat" color="#1E90FF" />
        </View>

        <ThemedView style={[styles.quoteContainer, { backgroundColor: Colors[colorScheme].card }]}>
          <ThemedText style={styles.quote}>"The best way to predict the future is to create it."</ThemedText>
          <ThemedText style={[styles.quoteAuthor, { color: Colors[colorScheme].secondaryText }]}>- Abraham Lincoln</ThemedText>
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
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Updated from shadow*
    elevation: 3,
  },
  quoteContainer: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  quote: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  quoteAuthor: {
    // color has been moved to the component to use theme colors
  },
});

export default HomeScreen;
