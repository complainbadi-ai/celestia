
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/celestial-theme';
import { Stack } from 'expo-router';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';

export default function HoroscopeScreen() {
  const { colorScheme = 'light' } = useColorScheme();

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => <ThemeToggleButton />,
          title: "Horoscope",
        }}
      />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Your Daily Horoscope
        </ThemedText>
        <ThemedView style={styles.horoscopeContainer}>
          <ThemedText style={styles.horoscopeText}>
            Today is a day for new beginnings. Embrace the opportunities that come your way, and don't be afraid to take a leap of faith. The stars are aligned in your favor.
          </ThemedText>
        </ThemedView>
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
  title: {
    marginBottom: 24,
  },
  horoscopeContainer: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border, // Example of using a single theme color
  },
  horoscopeText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
