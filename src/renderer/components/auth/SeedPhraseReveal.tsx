import React, { useState } from 'react';
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
      sx={{
        maxWidth: '30rem',
        backgroundColor: 'customColor.lightGrey',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '1rem 1rem 1rem 1rem',
        margin: '2rem 0 0 0',
        borderRadius: '0.5rem',
      }}
    >
      {reveal ? (
        seedPhrase.map((word) => (
          <Typography key={word} variant="body1" mr="1rem">
            {word}
          </Typography>
        ))
      ) : (
        <Typography variant="body1">Click to reveal</Typography>
      )}
      {!reveal && (
        <IconButton size="small" onClick={handleRevealClick}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default SeedPhraseReveal;
