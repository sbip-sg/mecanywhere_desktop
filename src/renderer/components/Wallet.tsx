import { Grid, Button, Box, TextField, Stack, IconButton, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {useState} from 'react';

const Wallet = () => {
    const [privateKey, setPrivateKey] = useState("");
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [getPrivateKeyToggled, setGetPrivateKeyToggled] = useState(false);
    const handleTogglePrivateKey = () => {
        setShowPrivateKey(showPrivateKey => !showPrivateKey)
    };
    const handleSetKey = () => {
        window.electron.store.set('privateKey', privateKey)
        // window.electron.ipcRenderer.sendMessage('storeKey', [privateKey]);
    }
    const handleGetKey = () => {
        window.electron.ipcRenderer.sendMessage('retrieveKey', "just passing by");
        if (window.electron.store.get('privateKey')) {
            setPrivateKey(window.electron.store.get('privateKey'));
            setGetPrivateKeyToggled(true);
        }
    };
    window.electron.ipcRenderer.once('retrieveKey', (arg) => {
        console.log(arg);
    });

    return (
        <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            marginTop: "2rem"
        }}
>
        <Stack direction="column" spacing={2}>
        <TextField type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
        <Button variant="contained" onClick={handleSetKey}>
            Set Private Key
        </Button>
        <Button variant="contained" onClick={handleGetKey}>
            Get Private Key
        </Button>
        {getPrivateKeyToggled && (
    <Grid container alignItems="center">
        {showPrivateKey ? (
            <>
                <Grid item container >
                    <Grid item xs={9} sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                    
                        
                        
                    <Typography fontSize="16px">{privateKey}</Typography>
                    
                    </Grid>
                    <Grid item xs={3}>

                    <IconButton
                        aria-label="toggle PrivateKey visibility"
                        onClick={handleTogglePrivateKey}
                        >
                        {showPrivateKey ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                        </Grid>
                </Grid>
            </>
        ) : (
            <>
                <Grid item container>
                <Grid item xs={9} sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>

                    <Typography fontSize="16px">{privateKey.replace(/./g, "*")}</Typography>
                    </Grid>
                    <Grid item xs={3}>

                    <IconButton
                        aria-label="toggle PrivateKey visibility"
                        onClick={handleTogglePrivateKey}
                        
                        >
                        {showPrivateKey ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                        </Grid>
                </Grid>
            </>
        )}
    </Grid>
)}

            </Stack>
        
      </Box>
    );
}

export default Wallet;