
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ColorSchemeProvider, useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

function RootLayoutNav() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <ThemeSwitcher />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ColorSchemeProvider>
      <RootLayoutNav />
    </ColorSchemeProvider>
  );
}
