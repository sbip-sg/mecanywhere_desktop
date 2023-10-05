import { Typography, FormControl, MenuItem } from '@mui/material';
import { useTheme } from '@emotion/react';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const PresetSelectorWidget = ({
  executorSettings,
  setExecutorSettings,
}) => {
  const theme = useTheme();
  const handleSelectChange = (event: SelectChangeEvent) => {
    switch (event.target.value) {
      case 'low':
        setExecutorSettings((prevState) => ({
          ...prevState,
          option: 'low',
          cpu_cores: 1,
          memory_mb: 2048,
        }));
        break;
      case 'medium':
        setExecutorSettings((prevState) => ({
          ...prevState,
          option: 'medium',
          cpu_cores: 2,
          memory_mb: 3072,
        }));
        break;
      case 'high':
        setExecutorSettings((prevState) => ({
          ...prevState,
          option: 'high',
          cpu_cores: 4,
          memory_mb: 4096,
        }));
        break;
      case 'custom':
        setExecutorSettings((prevState) => ({
          ...prevState,
          option: 'custom',
        }));
        break;
      default:
        console.error('Invalid option received:', event.target.value);
        break;
    }
  };
  return (
    <>
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
          value={executorSettings.option}
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
    </>
  );
};

export default PresetSelectorWidget;