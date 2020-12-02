import React, {
  ReactChild,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { dark, light } from '../theme';

import { ThemeProvider as BaseThemeProvider } from 'styled-components/native';
import { ThemeType } from '../types';

interface ContextType {
  themeString: ThemeType;
  setThemeString: React.Dispatch<React.SetStateAction<ThemeType>>;
}

const ThemeContext = createContext<ContextType | undefined>(undefined);

interface Props {
  children: ReactChild;
}

const ThemeProvider = (props: Props) => {
  const [themeString, setThemeString] = useState<ThemeType>(ThemeType.LIGHT);
  const themeObject = themeString === ThemeType.DARK ? dark : light;
  return (
    <ThemeContext.Provider value={{ themeString, setThemeString }}>
      <BaseThemeProvider theme={themeObject}>
        {props.children}
      </BaseThemeProvider>
    </ThemeContext.Provider>
  );
};
function useTheme() {
  const context = useContext<ContextType | undefined>(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  const { themeString, setThemeString } = context;
  const toggleTheme = useCallback(() => {
    if (themeString === ThemeType.LIGHT) {
      setThemeString(ThemeType.DARK);
    } else if (themeString === ThemeType.DARK) {
      setThemeString(ThemeType.LIGHT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeString]);
  return {
    theme: themeString === ThemeType.LIGHT ? light : dark,
    toggleTheme,
  };
}
export { ThemeProvider, useTheme };
