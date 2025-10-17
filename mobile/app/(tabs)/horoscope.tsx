
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import { HoroscopeView } from '@/components/horoscope-view';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { IconSymbol } from '@/components/ui/icon-symbol';

const horoscopeData = {
  Daily: 'Today is a great day to start something new. Your creativity is at its peak, so use it to your advantage.',
  Weekly: 'This week will bring new opportunities. Be open to change and embrace the challenges that come your way.',
  Monthly: 'A month of reflection and growth awaits you. Focus on your personal development and well-being.',
  Annual: 'The year ahead is full of promise. Your hard work will pay off, and you will achieve your long-term goals.',
};

const HoroscopeScreen = () => {
  const { colorScheme = 'light' } = useColorScheme();
  const [period, setPeriod] = useState('Daily');
  const [loading, setLoading] = useState(false);

  const handlePeriodChange = (index: number) => {
    setLoading(true);
    const selectedPeriod = Object.keys(horoscopeData)[index];
    setTimeout(() => {
      setPeriod(selectedPeriod);
      setLoading(false);
    }, 500);
  };

  const currentHoroscope = horoscopeData[period];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <ThemedView style={styles.header}>
          <IconSymbol name="moon.stars.fill" size={120} color={Colors[colorScheme].tint} />
        </ThemedView>
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Your Horoscope</ThemedText>
        <ThemedText style={[styles.subtitle, { color: Colors[colorScheme].secondaryText }]}>Select a period to view your horoscope</ThemedText>

        <SegmentedControl
          segments={Object.keys(horoscopeData)}
          currentIndex={Object.keys(horoscopeData).indexOf(period)}
          onChange={handlePeriodChange}
        />

        {currentHoroscope ? (
          <HoroscopeView horoscope={currentHoroscope} loading={loading} error={null} />
        ) : (
          <ThemedView style={styles.notFoundContainer}>
            <ThemedText>Horoscope not found for the selected period.</ThemedText>
          </ThemedView>
        )}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  notFoundContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
});

export default HoroscopeScreen;
