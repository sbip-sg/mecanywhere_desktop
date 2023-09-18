import { Box, Typography, Button, Grid, Stack } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PreSharingEnabledComponent = ({
  handleEnableResourceSharing,
  isLoading,
}) => {
  const theme = useTheme();
  const [isCustomSelected, setisCustomSelected] = useState(false);

  const [resourceSettings, setResourceSettings] = useState({
    cpu_cores: 1,
    memory_mb: 2048,
  });
  const [selectedOption, setSelectedOption] = useState('low');
  const handleSliderChange = (event, newValue) => {
    setResourceSettings({ ...resourceSettings, memory_mb: newValue });
  };
  useEffect(() => {
    console.log('resourceSettings', resourceSettings);
  }, [resourceSettings]);

  const [value, setValue] = useState(0);

  const incrementValue = () => {
    if (value < 4) {
      setValue(value + 1);
    }
  };

  const decrementValue = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };
  const sliderMarks = [
    {
      value: 1024,
      label: '1024',
    },
    {
      value: 8192,
      label: '8192',
    },
  ];
  const handleSelectChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    let newResourceSettings;
    setisCustomSelected(selectedValue === 'custom');
    switch (selectedValue) {
      case 'low':
        newResourceSettings = {
          cpu_cores: 1,
          memory_mb: 2048,
        };
        break;
      case 'medium':
        newResourceSettings = {
          cpu_cores: 2,
          memory_mb: 3072,
        };
        break;
      case 'high':
        newResourceSettings = {
          cpu_cores: 4,
          memory_mb: 4096,
        };
        break;
      default:
        newResourceSettings = resourceSettings;
    }
    setResourceSettings(newResourceSettings);
  };
  return (
    <Stack
      width="100%"
      sx={
        {
          // display: 'flex',
          // alignItems: 'center',
        }
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '2rem 0 0 1.5rem',
          color: theme.palette.cerulean.main,
        }}
      >
        <ErrorOutlineIcon />
        <Typography
          width="80%"
          variant="body2"
          fontSize="14px"
          textAlign="start"
          padding="0rem 0rem 0rem 1rem"
          style={{ color: theme.palette.cerulean.main, fontWeight: '600' }}
        >
          You are currently have resource sharing disabled.
        </Typography>
      </Box>
      <Typography
        width="80%"
        variant="body2"
        fontSize="16px"
        textAlign="start"
        padding="3rem 1.5rem 1rem 1.5rem"
      >
        Resource Allocation:
      </Typography>
      <FormControl sx={{ width: '100%', padding: '0rem 1.5rem 1rem 1.5rem' }}>
        <Select
          id="demo-simple-select"
          value={selectedOption}
          sx={{
            fontSize: '14px',

            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.lightPurple.main,
            },
            '& .MuiSvgIcon-root': {
              color: 'white',
            },
          }}
          fullWidth
          onChange={handleSelectChange}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: theme.palette.mediumBlack.main,
                '& .MuiMenuItem-root': {
                  padding: 2,
                  fontSize: '14px',
                },
              },
            },
          }}
        >
          <MenuItem value="low">Low (1 core CPU, 2048 MB Memory)</MenuItem>
          <MenuItem value="medium">
            Medium (2 core CPU, 3072 MB Memory)
          </MenuItem>
          <MenuItem value="high">High (4 core CPU, 4096 MB Memory)</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>
      <AnimatePresence mode="wait">
        <motion.div
          style={{
            height: isCustomSelected ? '50%' : '0',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            overflowY: 'hidden',
          }}
          initial={{ height: '0' }}
          animate={{ height: isCustomSelected ? '50%' : '0' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Grid
            container
            item
            sx={{
              height: '100%',
              width: '100%',
              padding: '0rem 1.5rem 0rem 1.5rem',
              overflow: 'hidden',
            }}
          >
            <Grid
              container
              item
              xs={12}
              sx={{ justifyContent: 'space-between' }}
            >
              <Typography
                style={{
                  height: '100%',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                CPU cores
              </Typography>
              <ButtonGroup variant="contained" size="small">
                <Button
                  disabled
                  sx={{
                    color: `${theme.palette.offWhite.main} !important`,
                    fontWeight: '600',
                  }}
                >
                  {value}
                </Button>
                <Stack>
                  <IconButton
                    onClick={incrementValue}
                    sx={{ padding: '0.1rem 0.1rem 0rem 0.1rem' }}
                  >
                    <KeyboardArrowUpIcon
                      sx={{ fontSize: '20px', color: 'white' }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={decrementValue}
                    sx={{ padding: '0rem 0.1rem 0.1rem 0.1rem' }}
                  >
                    <KeyboardArrowDownIcon
                      sx={{ fontSize: '20px', color: 'white' }}
                    />
                  </IconButton>
                </Stack>
              </ButtonGroup>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{
                padding: '1rem 0rem 0rem 0rem',
                justifyContent: 'space-between',
              }}
            >
              <Typography style={{ height: '100%', fontSize: '15px' }}>
                Memory (MB)
              </Typography>
              <Typography
                style={{
                  height: '100%',
                  fontSize: '15px',
                  color: theme.palette.offWhite.main,
                  fontWeight: '600',
                }}
              >
                {resourceSettings.memory_mb}
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sx={{ padding: '0rem 0rem 0rem 0rem' }}
            >
              <Slider
                value={resourceSettings.memory_mb}
                min={1024}
                max={8192}
                step={256}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} MB`}
                marks={sliderMarks}
                sx={{
                  '& .MuiSlider-thumb': {
                    color: theme.palette.cerulean.main,
                  },
                  '& .MuiSlider-mark': {
                    color: 'transparent',
                    backgroundColor: 'transparent',
                  },

                  '& .MuiSlider-rail': {
                    color: theme.palette.lightPurple.main,
                  },
                  '& .MuiSlider-track': {
                    color: theme.palette.deepCerulean.main,
                  },
                  '& .MuiSlider-valueLabel': {
                    display: 'none',
                  },
                  '& .MuiSlider-markLabel': {
                    fontSize: '12px',
                    top: '25px',
                    color: theme.palette.lightPurple.main,
                  },
                  '& .MuiSlider-markLabel[data-index="0"]': {
                    transform: 'none',
                  },
                  '& .MuiSlider-markLabel[data-index="1"]': {
                    transform: 'translateX(-100%)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </motion.div>
      </AnimatePresence>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem 1.5rem 2rem 1.5rem',
        }}
      >
        <Button
          onClick={handleEnableResourceSharing}
          sx={{
            width: '100%',
            padding: '0.6rem',
            color: isLoading
              ? theme.palette.cerulean.main
              : theme.palette.darkBlack.main,
            backgroundColor: isLoading
              ? theme.palette.darkBlack.main
              : theme.palette.mintGreen.main,
          }}
        >
          <Typography variant="h3" fontSize="15px" textAlign="center">
            Enable Resource&nbsp;Sharing
          </Typography>
        </Button>
      </Box>
    </Stack>
  );
};

export default PreSharingEnabledComponent;
