import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import './theme/index.scss'
import Demo from './pages/Demo';

import { theme } from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" className='app-content' maxWidth="xl">
        <CssBaseline />
          <Demo />
      </Container>
    </ThemeProvider>
  );
}