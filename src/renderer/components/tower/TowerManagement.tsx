import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getTowers } from 'renderer/services/TowerContractService';
import { getMyTowers } from 'renderer/services/HostContractService';
import { Tower } from 'renderer/utils/dataTypes';
import TowerCard from './TowerCard';
import actions from '../../redux/actionCreators';
import ErrorDialog from '../componentsCommon/ErrorDialogue';

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
    const myTowers = await getMyTowers()
      .then((retrievedTowers) => {
        const filteredTowers = retrievedTowers.filter(
          (tower: Tower) => tower !== null
        );
        const towerOwners = filteredTowers.map((tower: Tower) => tower.owner);
        setRegisteredTowers(towerOwners);
        return towerOwners;
      })
      .catch((error) => {
        setErrorMessage(`${error}`);
        setErrorDialogOpen(true);
        return []; // default
      });
    const allTowers = await getTowers()
      .then((retrievedTowers) => {
        const filteredTowers = retrievedTowers.filter(
          (tower: Tower) => tower !== null
        );
        const towerOwners = filteredTowers.map((tower: Tower) => tower.owner);
        return towerOwners;
      })
      .catch((error) => {
        setErrorMessage(`${error}`);
        setErrorDialogOpen(true);
        return []; // default
      });
    const restTowers = allTowers.filter((tower) => !myTowers.includes(tower));
    setUnregisteredTowers(restTowers);
    addTowers(myTowers, restTowers);
  };

  const addTowers = (
    registeredTowers: string[],
    unregisteredTowers: string[]
  ) => {
    registeredTowers.forEach((tower) => {
      actions.addRegisteredTower(tower);
    });
    unregisteredTowers.forEach((tower) => {
      actions.addUnregisteredTower(tower);
    });
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
