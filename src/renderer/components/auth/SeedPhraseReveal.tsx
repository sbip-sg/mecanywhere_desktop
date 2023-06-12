import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface SeedPhraseRevealProps {
  seedPhrase: string[];
}

const SeedPhraseReveal: React.FC<SeedPhraseRevealProps> = ({ seedPhrase }) => {
  const [reveal, setReveal] = useState(false);

  const handleRevealClick = () => {
    setReveal(true);
  };

  return (
    <Box
      maxWidth="25rem"
      display="inline-flex"
      flexWrap="wrap"
      bgcolor="#f0f0f0"
      p={2}
      borderRadius={1}
    >
      {reveal ? (
        seedPhrase.map((word, index) => (
          <Typography key={index} variant="body1" color="textPrimary" mr={1}>
            {word}
          </Typography>
        ))
      ) : (
        <>
          <Typography variant="body1" color="textSecondary">
            Click to reveal
          </Typography>
        </>
      )}
      {!reveal && (
        <IconButton size="small" onClick={handleRevealClick}>
          <VisibilityIcon fontSize="small" color="inherit" />
        </IconButton>
      )}
    </Box>
  );
};

export default SeedPhraseReveal;
