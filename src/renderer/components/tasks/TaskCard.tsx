import { Card, Typography, Grid, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { CustomButton } from './TaskCardComponents';
import React, { useState, useEffect } from 'react';
import {
  addToDownloaded,
  removeFromDownloaded,
  hasBeenDownloaded,
  addToBuilt,
  removeFromBuilt,
  hasBeenBuilt,
  addToTested,
  removeFromTested,
  hasBeenTested,
  addToActivated,
  removeFromActivated,
  hasBeenActivated,
} from './TaskListOperations';
import BlockIcon from '@mui/icons-material/Block';

import actions from '../../redux/actionCreators';
import { RootState } from '../../redux/store';
import CardDetail from './CardDetail';

interface TaskCardProps {
  task: any;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [currentPhase, setCurrentPhase] = useState('toDownload');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testData, setTestData] = useState({
    TestedCpuGas: 0,
    TestedGpuGas: 0,
    TestedFee: 0,
  });

  useEffect(() => {
    if (hasBeenTested(task.taskName)) {
      actions.addToTested(task.taskName);
    }
    if (hasBeenActivated(task.taskName)) {
      actions.addToActivated(task.taskName);
    }
    if (!hasBeenDownloaded(task.taskName)) {
      setCurrentPhase('toDownload');
    } else if (
      hasBeenDownloaded(task.taskName) &&
      !hasBeenBuilt(task.taskName)
    ) {
      setCurrentPhase('toBuild');
    } else if (
      hasBeenDownloaded(task.taskName) &&
      hasBeenBuilt(task.taskName)
    ) {
      setCurrentPhase('toTestOrActivate');
    }
  }, [task.taskName]);

  const isTested = useSelector((state: RootState) =>
    state.taskList.tested.includes(task.taskName)
  );
  const isActivated = useSelector((state: RootState) =>
    state.taskList.activated.includes(task.taskName)
  );

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    addToDownloaded(task.taskName);
    setCurrentPhase('toBuild');
    setIsDownloading(false);
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentPhase('toTestOrActivate');
    addToBuilt(task.taskName);
    setIsBuilding(false);
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTestData(getTestData());
    addToTested(task.taskName);
    actions.addToTested(task.taskName);
    setIsTesting(false);
  };

  const handleActivate = () => {
    addToActivated(task.taskName);
    actions.addToActivated(task.taskName);
  };

  const handleDeactivate = () => {
    removeFromActivated(task.taskName);
    actions.removeFromActivated(task.taskName);
  };

  const getTestData = () => {
    return {
      TestedCpuGas: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
      TestedGpuGas: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
      TestedFee: parseFloat((Math.random() * (1 - 0.5) + 0.5).toFixed(2)),
    };
  };

  const determineTestLabel = () => {
    if (isTesting) return 'Running Test...';
    if (isTested) return 'Rerun Test';
    return 'Run Test';
  };

  return (
    <Card sx={{ marginBottom: 2, minWidth: '10rem' }}>
      <Grid container>
        <Grid item xs={12} md={8}>
          <CardDetail task={task} testData={testData} isTested={isTested} />
        </Grid>
        <Grid item container xs={12} md={4}>
          <Stack
            sx={{
              alignItems: { xs: 'center', md: 'end' },
              justifyContent: 'center',
              margin: '0 1rem 0 1rem',
              width: '100%',
            }}
          >
            {currentPhase === 'toDownload' && (
              <>
                <CustomButton
                  label={isDownloading ? 'Downloading...' : 'Download'}
                  onClick={handleDownload}
                  color="text.primary"
                  backgroundColor="primary.main"
                  isLoading={isDownloading}
                />
                <Typography variant="subtitle2">
                  {`Disk Space Required: ${task.inputSizeLimit}`}
                </Typography>
              </>
            )}
            {currentPhase === 'toBuild' && (
              <>
                <CustomButton
                  label={isBuilding ? 'Building...' : 'Build'}
                  onClick={handleBuild}
                  color="text.secondary"
                  backgroundColor="secondary.contrastText"
                  isLoading={isBuilding}
                />
                <Typography variant="subtitle2">
                  File requires building.
                </Typography>
              </>
            )}
            {currentPhase === 'toTestOrActivate' && (
              <>
                <CustomButton
                  label={determineTestLabel()}
                  onClick={handleRunTest}
                  color="text.primary"
                  backgroundColor="primary.main"
                  isLoading={isTesting}
                />
                <CustomButton
                  label={isActivated ? 'Deactivate' : 'Activate'}
                  onClick={isActivated ? handleDeactivate : handleActivate}
                  color={isTested ? 'text.primary' : 'text.secondary'}
                  backgroundColor={
                    isTested ? 'secondary.main' : 'background.disabled'
                  }
                  isLoading={false}
                  disabled={!isTested}
                  startIcon={!isTested ? <BlockIcon /> : null}
                  sx={{
                    ...(isTested
                      ? {}
                      : {
                          '&:hover': {
                            backgroundColor: 'background.disabledHover', // Add custom hover color when button is disabled
                            cursor: 'not-allowed',
                          },
                        }),
                  }}
                />
                {!isTested && (
                  <Typography
                    variant="subtitle2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <BlockIcon sx={{ marginRight: '0.5rem' }} /> Compatibility
                    test required before Task Activation.
                  </Typography>
                )}
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TaskCard;
