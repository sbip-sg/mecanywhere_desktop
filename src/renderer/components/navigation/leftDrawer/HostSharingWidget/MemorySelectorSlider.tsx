import { Grid, Typography, Slider } from '@mui/material';
import { useTheme } from '@emotion/react';

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
const MemorySelectorSlider = ({ executorSettings, setExecutorSettings }) => {
  const theme = useTheme();
  const handleSliderChange = (event, newValue) => {
    setExecutorSettings({ ...executorSettings, memory_mb: newValue });
  };
  return (
    <>
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
          {executorSettings.memory_mb}
        </Typography>
      </Grid>
      <Grid container item xs={12} sx={{ padding: '0rem 0rem 0rem 0rem' }}>
        <Slider
          value={executorSettings.memory_mb}
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
    </>
  );
};

export default MemorySelectorSlider;
