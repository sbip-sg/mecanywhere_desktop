import {Stack, Box, Button, Typography, useTheme, Switch} from '@mui/material'
import reduxStore from '../../redux/store';
import {useState} from 'react'
import { styled } from '@mui/material/styles';


const IOSSwitch = styled(() => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.violet.main
          : theme.palette.mintGreen.main,
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const Settings = () => {
    const theme = useTheme();

    return (
        <Stack sx={{ display: 'flex', justifyContent: 'left', alignItems: 'top' , padding: '2rem'}}>
            <Box  sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' , padding: '1rem'}}>
                <Typography color={theme.palette.cerulean.main} variant="h1" style={{ fontSize: '24px', margin: '0rem 0 0 0' }}>
                    PAYMENT
                </Typography>
            </Box>
            <Box  sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' , padding: '1rem'}}>
                <Typography variant="h4" style={{ fontSize: '16px', margin: '1.5rem 0 0 0' }}>
                    You current have 432.17 SGD due by 31st August 2023.
                </Typography>
            </Box>
         <IOSSwitch />
        </Stack>
    )
}

export default Settings