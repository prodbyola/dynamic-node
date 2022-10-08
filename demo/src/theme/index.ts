// import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { ThemeOptions } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    // type: 'light',
    primary: {
      main: '#0f6248',
    }
  }
};

export const theme = createTheme(themeOptions)