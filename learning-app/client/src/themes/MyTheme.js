import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#388e3c", // Green
    },
    secondary: {
      main: "#f4511e", // Orange
    },
  },
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
        },
        bar: {
          borderRadius: 4,
          transition: "width 0.5s ease-in-out",
        },
        // Override for progress bar color based on tier
        colorPrimary: {
          backgroundColor: "#e0e0e0", // Default background
        },
        barColorPrimary: {
          "&.gold": {
            backgroundColor: "gold",
          },
          "&.silver": {
            background: "linear-gradient(90deg, silver, gold)",
          },
          "&.bronze": {
            background: "linear-gradient(90deg, bronze, silver)",
          },
        },
      },
    },
  },
});

export default theme;
