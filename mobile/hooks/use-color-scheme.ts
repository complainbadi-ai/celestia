
import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const ColorSchemeContext = createContext({
  colorScheme: 'light',
  setColorScheme: (colorScheme: 'light' | 'dark') => {},
});

export const useColorScheme = () => useContext(ColorSchemeContext);

export const ColorSchemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [colorScheme, setColorScheme] = useState('light');
  const rnColorScheme = useRNColorScheme();

  useEffect(() => {
    setColorScheme(rnColorScheme ?? 'light');
  }, [rnColorScheme]);

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
