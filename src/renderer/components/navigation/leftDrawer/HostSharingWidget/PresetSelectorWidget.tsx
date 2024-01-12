import { Typography, FormControl, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const PresetSelectorWidget = ({ executorSettings, setExecutorSettings }) => {
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
        variant="body1"
        fontWeight="600"
        textAlign="start"
        padding="2rem 0 1rem 0"
        color="text.primary"
      >
        Resource Allocation:
      </Typography>
      <FormControl sx={{ width: '100%' }}>
        <Select
          id="demo-simple-select"
          value={executorSettings.option}
          sx={{
            fontSize: '14px',

            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'text.primary',
              opacity: 0.5,
            },
            '& .MuiSvgIcon-root': {
              color: 'text.primary',
            },
          }}
          fullWidth
          onChange={handleSelectChange}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: 'background.default',
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
