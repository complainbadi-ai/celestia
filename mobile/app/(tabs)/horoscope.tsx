
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HoroscopeScreen = () => {
  const fetchHoroscope = (period: string) => {
    // Fetch horoscope logic here
    console.log(`Fetching ${period} horoscope...`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Horoscope</Text>
      <View style={styles.buttonContainer}>
        <Button title="Daily" onPress={() => fetchHoroscope('daily')} />
        <Button title="Weekly" onPress={() => fetchHoroscope('weekly')} />
        <Button title="Monthly" onPress={() => fetchHoroscope('monthly')} />
        <Button title="Annual" onPress={() => fetchHoroscope('annual')} />
      </View>
      {/* Display horoscope here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default HoroscopeScreen;
