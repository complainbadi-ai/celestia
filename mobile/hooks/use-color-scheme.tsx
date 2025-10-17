
import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const ColorSchemeContext = createContext({
  colorScheme: 'light' as 'light' | 'dark',
  setColorScheme: (colorScheme: 'light' | 'dark') => {},
});

export const useColorScheme = () => useContext(ColorSchemeContext);

export const ColorSchemeProvider = ({ children }: { children: React.ReactNode }) => {
  const rnColorScheme = useRNColorScheme();
  const [colorScheme, setColorScheme] = useState(rnColorScheme ?? 'light');

  useEffect(() => {
    setColorScheme(rnColorScheme ?? 'light');
  }, [rnColorScheme]);

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
