
import React from 'react';
import { StyleSheet, View, Switch, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/celestial-theme';
import { Stack } from 'expo-router';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';

export default function SettingsScreen() {
  const { colorScheme = 'light' } = useColorScheme();
  const [notifications, setNotifications] = React.useState(true);

  const toggleNotifications = () => {
    setNotifications(previousState => !previousState);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => <ThemeToggleButton />,
          title: "Settings",
        }}
      />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Settings
        </ThemedText>
        <View style={styles.settingRow}>
          <ThemedText style={styles.settingLabel}>Enable Notifications</ThemedText>
          <Switch
            trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
            thumbColor={notifications ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={toggleNotifications}
            value={notifications}
            accessibilityLabel="Toggle notifications"
          />
        </View>
        <TouchableOpacity style={styles.settingRow} accessibilityLabel="Go to Privacy Settings">
          <ThemedText style={styles.settingLabel}>Privacy Settings</ThemedText>
          <ThemedText>&gt;</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow} accessibilityLabel="Go to About Us screen">
          <ThemedText style={styles.settingLabel}>About Us</ThemedText>
          <ThemedText>&gt;</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingLabel: {
    fontSize: 16,
  },
});
