import { Box, Typography, Button } from '@mui/material';
import SeedPhraseReveal from './utils/SeedPhraseReveal'
import { useNavigate } from 'react-router-dom';

const Mnemonics = () => {
    const navigate = useNavigate();

    return (
        <>
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                marginTop: "5rem"
            }}
            >
            <Typography variant="h1" fontSize="35px">Secret Backup Phrase</Typography>
            <Box sx={{ maxWidth: "30rem", textAlign: "left", marginTop: "2rem", marginBottom: "1rem" }}>
                <Typography variant="body1" mb="1rem" >Your secret backup phrase makes it easy to back up and restore your account. Write this phrase on a piece of paper and store it in a secured place. Memorize this phrase if possible.</Typography>
                <Typography variant="body1" >WARNING: Never disclose your backup phrase. Anyone with this phrase can take over your account</Typography>
            </Box>
            <SeedPhraseReveal seedPhrase={window.electron.store.get('mnemonic').trim().split(' ')}/>
      </Box>
      <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                marginTop: "4rem"
            }}
            >
          <Button variant="contained" color="secondary" onClick={() => navigate("/login")}>Continue to Login</Button>

            </Box>
    </>
    );
}

export default Mnemonics;