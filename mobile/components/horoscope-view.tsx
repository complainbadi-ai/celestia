
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

interface HoroscopeViewProps {
  horoscope: string | null;
  loading: boolean;
  error: string | null;
}

export const HoroscopeView: React.FC<HoroscopeViewProps> = ({ horoscope, loading, error }) => {
  const colorScheme = useColorScheme();

  if (loading) {
    return <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />;
  }

  if (error) {
    return <ThemedText style={{ color: 'red' }}>{error}</ThemedText>;
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <ThemedText style={styles.horoscopeText}>{horoscope || 'Select a period to view your horoscope.'}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
  },
  horoscopeText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
