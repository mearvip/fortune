import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // 深紫色
      light: '#9a67ea',
      dark: '#320b86',
    },
    secondary: {
      main: '#9c27b0', // 紫罗兰色
      light: '#d05ce3',
      dark: '#6a0080',
    },
    background: {
      default: '#f5f0fa', // 浅紫色背景
      paper: '#ffffff',
    },
  },
});