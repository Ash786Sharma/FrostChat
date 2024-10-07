import { useState } from 'react';
import { Switch } from '@mui/material';
import { LightMode, DarkMode} from '@mui/icons-material';

const ThemeSwitch = ({themeChange}) => {

  const [darkMode, setDarkMode] = useState(false);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
    themeChange(darkMode)
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleThemeChange} color="inherit">
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
              <Switch checked={darkMode} onChange={handleThemeChange} />
      </Box>
    </>
  )
}

export default ThemeSwitch

