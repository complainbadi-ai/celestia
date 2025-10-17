
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/celestial-theme';
import { Stack } from 'expo-router';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';

export default function HomeScreen() {
  const { colorScheme = 'light' } = useColorScheme();

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => <ThemeToggleButton />,
          title: "Home",
        }}
      />
      <ThemedView style={styles.container}>
        <Image
          source={require('@/assets/images/icon.png')} // Add your app's logo here
          style={styles.logo}
          accessibilityLabel="Celestia app logo"
        />
        <ThemedText type="title" style={styles.title}>
          Welcome to Celestia
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Your personal guide to the stars. Explore your horoscope, chat with our AI, and learn more about yourself.
        </ThemedText>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
  },
});
