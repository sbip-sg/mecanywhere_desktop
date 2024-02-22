import React from 'react';
import { Box, Stack, Typography, Slider } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import { ExecutorSettings } from '../../../../utils/dataTypes';

interface MemorySelectorSliderProps {
  executorSettings: ExecutorSettings;
  setExecutorSettings: React.Dispatch<React.SetStateAction<ExecutorSettings>>;
}

const MemorySelectorSlider: React.FC<MemorySelectorSliderProps> = ({
  executorSettings,
  setExecutorSettings,
}) => {
  const totalMem = useSelector(
    (state: RootState) => state.deviceStatsReducer.totalMem
  );
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setExecutorSettings({ ...executorSettings, memory_mb: newValue });
    } else {
      console.error(
        'Expected newValue to be a number, but received:',
        newValue
      );
    }
  };
  const sliderStep = 256;
  const sliderMinMark = 1024;
  const sliderMaxMark = Math.floor(totalMem / sliderStep) * sliderStep;
  const sliderMarks = [
    {
      value: sliderMinMark,
      label: `${sliderMinMark}`,
    },
    {
      value: sliderMaxMark,
      label: `${sliderMaxMark}`,
    },
  ];
  return (
    <Stack
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body1" sx={{ color: 'text.primary' }}>
          Memory (MB)
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.primary',
            fontWeight: '600',
          }}
        >
          {executorSettings.memory_mb}
        </Typography>
      </Box>

      <Slider
        value={executorSettings.memory_mb}
        min={sliderMinMark}
        max={sliderMaxMark}
        step={sliderStep}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value} MB`}
        marks={sliderMarks}
        sx={{
          width: 'calc(100% - 20px)',
          mx: '10px',

          '& .MuiSlider-thumb': {
            color: 'primary.main',
            zIndex: 100,
          },
          '& .MuiSlider-mark': {
            color: 'transparent',
            backgroundColor: 'transparent',
            zIndex: 100,
          },

          '& .MuiSlider-rail': {
            color: 'primary.main',
            zIndex: 100,
          },
          '& .MuiSlider-track': {
            color: 'primary.main',
            zIndex: 100,
          },
          '& .MuiSlider-valueLabel': {
            display: 'none',
            zIndex: 100,
          },
          '& .MuiSlider-markLabel': {
            fontSize: '12px',
            // top: '25px',
            color: 'text.primary',
          },
          '& .MuiSlider-markLabel[data-index="0"]': {
            transform: 'translateX(-10%) ',
          },
          '& .MuiSlider-markLabel[data-index="1"]': {
            transform: 'translateX(-90%) ',
          },
        }}
      />
    </Stack>
  );
};

export default MemorySelectorSlider;
