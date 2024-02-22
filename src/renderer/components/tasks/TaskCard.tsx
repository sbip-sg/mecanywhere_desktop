import { Card, Typography, Grid, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Task } from 'renderer/utils/dataTypes';
import CustomButton from './CustomButton';
import {
  addToDownloaded,
  hasBeenDownloaded,
  addToBuilt,
  hasBeenBuilt,
  addToTested,
  hasBeenTested,
  addToActivated,
  removeFromActivated,
  hasBeenActivated,
  removeFromDownloaded,
  removeFromBuilt,
  removeFromTested,
} from './TaskListOperations';
import actions from '../../redux/actionCreators';
import { RootState } from '../../redux/store';
import CardDetail from './CardDetail';

interface TaskCardProps {
  task: Task;
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

  const getTestLabel = () => {
    if (isTesting) return 'Running Test...';
    if (isTested) return 'Rerun Test';
    return 'Run Test';
  };

  const getActivateButtonColor = () => {
    if (!isTested) return 'background.disabled';
    if (isActivated) return 'secondary.contrastText';
    if (!isActivated) return 'secondary.main';
    return 'error.main';
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
                  label={getTestLabel()}
                  onClick={handleRunTest}
                  color="text.primary"
                  backgroundColor="primary.main"
                  isLoading={isTesting}
                />
                <CustomButton
                  label={isActivated ? 'Deactivate' : 'Activate'}
                  onClick={isActivated ? handleDeactivate : handleActivate}
                  color={isTested ? 'text.primary' : 'text.secondary'}
                  backgroundColor={getActivateButtonColor()}
                  showBlockIcon={!isTested}
                />
                {!isTested && (
                  <Typography
                    variant="subtitle2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    Compatibility test required before Task Activation.
                  </Typography>
                )}
                {isTested && isActivated && (
                  <Typography
                    variant="subtitle2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    Task activated and available for resource sharing.
                  </Typography>
                )}
                {isTested && !isActivated && (
                  <Typography
                    variant="subtitle2"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    Task currently excluded from resource sharing.
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
