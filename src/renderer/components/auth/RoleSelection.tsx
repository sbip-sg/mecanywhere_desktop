import { Grid, Box, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import actions from '../../redux/actionCreators';

const RoleSelection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState('host/client');
  const handleOnClick = () => {
    navigate('/mnemonics');
  };
  useEffect(() => {
    if (selectedRole === 'host/client') {
      actions.setIsProvider(false);
    } else {
      actions.setIsProvider(true);
    }
    // console.log("what do you want redux selected () ")
  }, [selectedRole]);
  return (
    <Grid container sx={{ height: '92vh' }}>
      <Grid
        item
        container
        xs={12}
        sx={{
          height: '20%',
          justifyContent: 'center',
          alignItems: 'end',
          paddingBottom: '1rem',
        }}
      >
        <Typography variant="h1">Role Selection</Typography>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{
          height: '60%',
          // width: "80%",
          // backgroundColor: theme.palette.Black.main,
          borderRadius: '12px',
          padding: '0rem 3rem 0rem 3rem',
          margin: '0rem 3rem 1rem 3rem',
        }}
      >
        <FormControl>
          <FormLabel
            id="demo-radio-buttons-group-label"
            sx={{
              color: theme.palette.offWhite.main,
              '&.Mui-focused': {
                color: theme.palette.offWhite.main,
              },
            }}
          >
            Select a role below:
          </FormLabel>
          <RadioGroup
            defaultValue="host/client"
            name="radio-buttons-group"
            onChange={(event) => setSelectedRole(event.target.value)}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.mediumBlack.main,
                borderRadius: '12px',
                padding: '1rem 1rem 1rem 1rem',
                margin: '1rem 1rem 0rem 1rem',
              }}
            >
              <FormControlLabel
                value="host/client"
                control={
                  <Radio
                    sx={{
                      color: theme.palette.lightPurple.main,
                      '&.Mui-checked': {
                        color: theme.palette.cerulean.main,
                      },
                    }}
                  />
                }
                label="HOST / CLIENT"
              />
              <Typography
                fontSize="16px"
                sx={{
                  margin: '0 0.5rem 0 0.5rem',
                  color: theme.palette.cerulean.main,
                }}
              >
                Select this role if you are intending to use this application as
                an edge device host which shares compute resources or a client
                which develops apps which intend to consume said resources. You
                are able to switch freely between host / client roles once
                registered.
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: theme.palette.mediumBlack.main,
                borderRadius: '12px',
                // display: 'flex',
                // justifyContent: "center",
                // alignItems: "ascas"
                padding: '1rem 1rem 1rem 1rem',
                margin: '1rem 1rem 0rem 1rem',
              }}
            >
              <FormControlLabel
                value="parentOrganization"
                control={
                  <Radio
                    sx={{
                      color: theme.palette.lightPurple.main,
                      '&.Mui-checked': {
                        color: theme.palette.cerulean.main,
                      },
                    }}
                  />
                }
                label="PARENT ORGANIZATION"
              />
              <Typography
                fontSize="16px"
                sx={{
                  margin: '0 0.5rem 0 0.5rem',
                  color: theme.palette.cerulean.main,
                }}
              >
                Select this if you are intending to use this application as the
                parent organization or provider which manages end users which
                may be the aforementioned host / client roles. If you wish to
                use this application as some other roles in the future, keep in
                mind that you will need to overwrite the existing data on this
                device before you can register for those new roles.
              </Typography>
            </Box>
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ justifyContent: 'center', alignItems: 'top' }}
      >
        {/* <Box sx={{display:'flex', justifyContent: "center", alignItems: 'top'}}> */}

        <Button onClick={handleOnClick} sx={{ height: '60%' }}>
          Continue
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginLeft: '1rem', height: '60%' }}
          onClick={() => navigate('/roleSelection')}
        >
          Back
        </Button>
        {/* </Box> */}
      </Grid>
    </Grid>
  );
};

export default RoleSelection;
