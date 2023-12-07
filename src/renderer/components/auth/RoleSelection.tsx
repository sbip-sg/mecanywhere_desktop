import { Grid, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import actions from '../../redux/actionCreators';
import handleAccountRegistration from './handleAccountRegistration';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const RoleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const password = location.state?.password;
  const [selectedRole, setSelectedRole] = useState('host');
  const isImportingAccount = useSelector(
    (state: RootState) => state.importingAccountReducer.importingAccount
  );
  const handleOnClick = async () => {
    await handleAccountRegistration(password, isImportingAccount);
    navigate(isImportingAccount === true ? '/login' : '/mnemonics');
  };
  useEffect(() => {
    if (selectedRole === 'host') {
      window.electron.store.set('role', 'host');
      actions.setRole('host');
    } else if (selectedRole === 'provider') {
      window.electron.store.set('role', 'provider');
      actions.setRole('provider');
    } else {
      console.error('no role selected!');
    }
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
          borderRadius: '12px',
          padding: '0rem 3rem 0rem 3rem',
          margin: '0rem 3rem 1rem 3rem',
        }}
      >
        <FormControl>
          <FormLabel
            id="demo-radio-buttons-group-label"
            sx={{
              color: 'text.primary',
              '&.Mui-focused': {
                color: 'text.primary',
              }, // required to override the color when not focused
            }}
          >
            Select a role below:
          </FormLabel>
          <RadioGroup
            defaultValue="host"
            name="radio-buttons-group"
            onChange={(event) => setSelectedRole(event.target.value)}
          >
            <Card
              sx={{
                backgroundColor:
                  selectedRole === 'host'
                    ? 'customColor.lightGrey'
                    : 'background.paper',
                borderRadius: '12px',
                margin: '1rem',
              }}
            >
              <CardContent sx={{ padding: '1rem' }}>
                <FormControlLabel
                  value="host"
                  control={
                    <Radio
                      sx={{
                        color: 'primary.main',
                        '&.Mui-checked': { color: 'secondary.contrastText' },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color:
                          selectedRole === 'host'
                            ? 'secondary.contrastText'
                            : 'primary.main',
                        fontWeight: selectedRole === 'host' ? '600' : '500',
                      }}
                    >
                      HOST
                    </Typography>
                  }
                />
                <Typography
                  fontSize="16px"
                  sx={{
                    margin: '0 0.5rem',
                    color: 'text.primary',
                  }}
                >
                  Select this role if you are intending to use this application
                  as an edge device host which shares compute resources.
                </Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                backgroundColor:
                  selectedRole === 'provider'
                    ? 'customColor.lightGrey'
                    : 'background.paper',
                borderRadius: '12px',
                margin: '1rem',
              }}
            >
              <CardContent sx={{ padding: '1rem' }}>
                <FormControlLabel
                  value="provider"
                  control={
                    <Radio
                      sx={{
                        color: 'primary.main',
                        '&.Mui-checked': { color: 'secondary.contrastText' },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color:
                          selectedRole === 'provider'
                            ? 'secondary.contrastText'
                            : 'primary.main',
                        fontWeight: selectedRole === 'provider' ? '600' : '500',
                      }}
                    >
                      PROVIDER
                    </Typography>
                  }
                />
                <Typography
                  fontSize="16px"
                  sx={{
                    margin: '0 0.5rem',
                    color: 'text.primary',
                  }}
                >
                  Select this if you are intending to use this application as
                  the parent organization or provider which manages end users
                  which may be the aforementioned host roles. If you wish to use
                  this application as some other roles in the future, keep in
                  mind that you will need to overwrite the existing data on this
                  device before you can register for those new roles.{' '}
                </Typography>
              </CardContent>
            </Card>
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ justifyContent: 'center', alignItems: 'top' }}
      >
        <Button onClick={handleOnClick} sx={{ height: '60%' }}>
          Continue
        </Button>
        <Button
          variant="contained"
          sx={{ marginLeft: '1rem', height: '60%' }}
          onClick={() => navigate('/login')}
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export default RoleSelection;
