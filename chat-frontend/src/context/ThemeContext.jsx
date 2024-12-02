import React, { createContext, useContext } from "react";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppContext } from "./AppContext";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00a884",
    },
    background: {
      default: "#f0f2f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#65676b",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00a884",
    },
    background: {
      default: "#111b21",
      paper: "#202c33",
    },
    text: {
      primary: "#e9edef",
      secondary: "#8696a0",
    },
  },
});

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { isDarkMode, toggleTheme } = useAppContext();

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
