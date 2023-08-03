import { Grid, Typography, Stack, Box, Button } from '@mui/material';
import pinkLogo from '../../../../assets/pink-app-logo.png';
import redLogo from '../../../../assets/red-app-logo.png';
import orangeLogo from '../../../../assets/orange-app-logo.png';
import cardLogo from '../../../../assets/card-app-logo.png';
import gameLogo from '../../../../assets/game-app-logo.png';
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from '@emotion/react';

const LogoButton = ({ logo, title, installed }) => {
    const theme = useTheme();
    return (
        <Grid item xs={4} sx={{justifyContent:"center", alignItems:"center", padding: "1rem 1rem 1.5rem 1rem"}}>

      <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        {/* <Button sx={{ backgroundColor: 'transparent' }} onClick={() => {}}> */}
          <img src={logo} width="120px" height="120px" style={{ }} />
        {/* </Button> */}
        <Typography variant="h4" style={{ fontSize: '17px', fontWeight: '700', margin: '0.6rem 0 0.6rem 0' }}>
                {title}
        </Typography>
        <Box sx={{display: 'flex', justifyContent:"center", alignItems:"center"}}>
           
                {installed ? (
                     <Button sx={{ 
                        backgroundColor: theme.palette.mintGreen.main, 
                        color: theme.palette.darkBlack.main,
                        padding: '0rem 0.4rem 0rem 0.4rem',
                        width: '8rem',
                        height: '2.2rem'
                    }} onClick={() => {}}>
                        <Typography variant="h4" style={{ fontSize: '17px', margin: '0 0 0 0', fontWeight: '700' }}>
                            Run App
                        </Typography>
                    </Button>

                ) : (
                    <Button sx={{ 
                        backgroundColor: theme.palette.cerulean.main, 
                        color: theme.palette.darkBlack.main,
                        padding: '0.2rem 0.4rem 0.2rem 0.4rem',
                        width: '8rem',
                        height: '2.2rem'
                    }} onClick={() => {}}>
                        <Typography variant="h4" style={{ fontSize: '17px', margin: '0 0 0 0', fontWeight: '700'  }}>
                            Install
                        </Typography>
                        <DownloadIcon style={{fontSize:'22px'}} />
                    </Button>
                )
}
            
        </Box>
      </Stack>
        </Grid>
    );
  };

const AppView = () => {
    return (
        <Stack height="100%" alignItems="center" margin="4rem 0 0 0">
            <Typography variant="h1" style={{ fontSize: '24px', margin: '0 0 3rem 0' }}>
                Installed App
            </Typography>
            <Box id="app-box" sx={{}}>
            <Grid container xs={12} justifyContent="center" alignItems="center">
                <LogoButton logo={pinkLogo} title={'Pink App'} installed={true}/>
                <LogoButton logo={redLogo} title={'Red App'} installed={false}/>
                <LogoButton logo={orangeLogo} title={'Orange App'} installed={true}/>
                <LogoButton logo={cardLogo} title={'Card App'} installed={false}/>
                <LogoButton logo={gameLogo} title={'Game App'} installed={false}/>
                <Grid item xs={4} justifyContent="center" alignItems="center" title={'Pink App'}/>
            </Grid>
            </Box>
        </Stack>
    )
}

export default AppView;