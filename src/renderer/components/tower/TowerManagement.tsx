import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TowerCard from './TowerCard';
import ErrorDialog from '../componentsCommon/ErrorDialogue';
import loadTowers from '../componentsCommon/loadTower';

const TowerManagement: React.FC = () => {
  const [registeredTowerList, setRegisteredTowers] = useState<string[]>([]);
  const [unregisteredTowerList, setUnregisteredTowers] = useState<string[]>([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const handleRefresh = async () => {
    try {
      const { myTowers, restTowers } = await loadTowers();
      setRegisteredTowers(myTowers);
      setUnregisteredTowers(restTowers);
    } catch (error) {
      setErrorMessage(`Failed to load towers: ${error}`);
      setErrorDialogOpen(true);
    }
  };

  return (
    <Box sx={{ height: '100%', overflowY: 'scroll', padding: '2rem' }}>
      <Typography variant="h3" sx={{ padding: '1rem 0 3rem 0' }}>
        Tower Management
      </Typography>
      <Typography variant="body1" sx={{ margin: '1rem' }}>
        {registeredTowerList.length + unregisteredTowerList.length} results
        found.
        <IconButton size="small" onClick={handleRefresh}>
          <RefreshIcon fontSize="small" sx={{ color: 'text.primary' }} />
        </IconButton>
      </Typography>
      <Grid container spacing={1}>
        {registeredTowerList.map((tower) => (
          <Grid item xs={12} key={tower}>
            <TowerCard tower={tower} isInitiallyRegistered />
          </Grid>
        ))}
        {unregisteredTowerList.map((tower) => (
          <Grid item xs={12} key={tower}>
            <TowerCard tower={tower} isInitiallyRegistered={false} />
          </Grid>
        ))}
      </Grid>
      <ErrorDialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        errorMessage={errorMessage}
      />
    </Box>
  );
};

export default TowerManagement;
