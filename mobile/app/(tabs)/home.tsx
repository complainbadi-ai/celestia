
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.quote}>"The only way to do great work is to love what you do." - Steve Jobs</Text>
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
  quote: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default HomeScreen;
