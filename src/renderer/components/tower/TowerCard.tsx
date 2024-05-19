import { Card, Typography, Grid, Stack, CardContent } from '@mui/material';
import React, { useState } from 'react';
import CustomButton from '../tasks/CustomButton';
import { registerForTower } from 'renderer/services/HostContractService';

interface TowerCardProps {
  tower: string;
  isInitiallyRegistered: boolean;
}

const TowerCard: React.FC<TowerCardProps> = ({ tower, isInitiallyRegistered }) => {
  const [isRegistered, setRegistered] = useState(isInitiallyRegistered);

  const handleRegisterTower = async () => {
    const success = await registerForTower(tower);
    if (success) setRegistered(true);
  }

  const handleUnregisterTower = async () => {
    setRegistered(false);
  }

  return (
    <Card sx={{ marginBottom: 2, minWidth: '10rem' }}>
      <Grid container>
        <Grid item xs={12} md={7.5}>
          <CardContent>
            <Typography variant="body2">{tower}</Typography>
          </CardContent>
        </Grid>
        <Grid item container xs={12} md={4.5}>
          <Stack
            sx={{
              alignItems: { xs: 'center', md: 'end' },
              justifyContent: 'center',
              margin: '0 1rem 0 1rem',
              width: '100%',
            }}
          >
            {isRegistered && (
              <CustomButton
                label={isRegistered ? 'Unregister' : 'Register'}
                onClick={handleUnregisterTower}
                color="text.secondary"
                backgroundColor="secondary.contrastText"
              />
            )}
            {!isRegistered && (
              <CustomButton
                label={isRegistered ? 'Unregister' : 'Register'}
                onClick={handleRegisterTower}
                color="text.primary"
                backgroundColor="primary.main"
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TowerCard;
