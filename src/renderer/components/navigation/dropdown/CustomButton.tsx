import { FC, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface CustomButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  buttonText: string;
  maxWidth: string;
  isLoading: boolean
}

const CustomButton: FC<CustomButtonProps> = ({ onClick, buttonText, maxWidth, isLoading }) => (
  <Button
    onClick={onClick}
    variant="contained"
    color="primary"
    style={{ margin: "0.5rem 0.5rem 0.5rem 0.5rem" }}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: '9rem',
      pointerEvents: isLoading ? "none" : "auto",
    }}
    data-testid={buttonText}
  >
    <Typography
      variant="body1"
      maxWidth={maxWidth}
      style={{ fontSize: '12px', wordWrap: "break-word" }}
    >
      {buttonText}
    </Typography>
  </Button>
);

export default CustomButton;