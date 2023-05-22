import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const CustomButton = ({ onClick, actionText, buttonText }) => (
    <Button
      onClick={onClick}
      variant="contained"
      color="primary"
      style={{ marginRight: '8px' }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '9rem',
      }}
    >
      <Box>
        {actionText && (
          <Typography
            variant="body1"
            component="span"
            display="block"
            style={{ fontSize: '12px' }}
          >
            {actionText}
          </Typography>
        )}
        <Typography
          variant="body1"
          component="span"
          display="block"
          style={{ fontSize: '12px' }}
        >
          {buttonText}
        </Typography>
      </Box>
    </Button>
  );

export default CustomButton;