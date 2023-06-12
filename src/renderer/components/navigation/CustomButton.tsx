import { FC, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface CustomButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  actionText?: string;
  buttonText: string;
}

const CustomButton: FC<CustomButtonProps> = ({ onClick, actionText, buttonText }) => (
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
    data-testid={actionText + " " + buttonText}
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