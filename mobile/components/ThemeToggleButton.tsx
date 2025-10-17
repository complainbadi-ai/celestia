
import React from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
      <Ionicons
        name={theme === 'dark' ? 'sunny' : 'moon'}
        size={24}
        color={theme === 'dark' ? 'white' : 'black'}
      />
    </TouchableOpacity>
  );
}
