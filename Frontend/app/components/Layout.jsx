import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Switch } from '@mui/material';
import {AcUnitRounded, LightMode, DarkMode} from '@mui/icons-material';
import Login from "./Login";
import ThemeSwitch from './ThemeSwitch';

const Layout = ({children}) => {

  const [themechange, setThemeChange] = useState("")

  const theme = createTheme({
    palette: {
      mode: themechange ? 'dark' : 'light',
    },
  });

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <AcUnitRounded/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Frost Chat
          </Typography>
          <ThemeSwitch themeChange={setThemeChange}/>
        </Toolbar>
      </AppBar>
      
    </>
  );
};

export default Layout;
