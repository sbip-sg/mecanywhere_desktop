import { Card, Typography, Grid, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ComputingType, Task } from 'renderer/utils/dataTypes';
import CustomButton from './CustomButton';
import {
  hasBeenDownloaded,
  addToBuilt,
  hasBeenBuilt,
  addToTested,
  hasBeenTested,
  addToActivated,
  removeFromActivated,
  hasBeenActivated,
  removeFromBuilt,
  removeFromTested,
} from './TaskListOperations';
import actions from '../../redux/actionCreators';
import { RootState } from '../../redux/store';
import CardDetail from './CardDetail';
import { addTaskToHost, deleteTaskFromHost } from 'renderer/services/HostContractService';
import { executeTask, getResourceStats, pauseExecutor, unpauseExecutor } from 'renderer/services/ExecutorServices';
import ErrorDialog from '../componentsCommon/ErrorDialogue';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [currentPhase, setCurrentPhase] = useState('toDownload');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isTested = useSelector((state: RootState) =>
    state.taskList.tested.includes(task.taskName)
  );
  const isActivated = useSelector((state: RootState) =>
    state.taskList.activated.includes(task.taskName)
  );
  const isExecutorRunning = useSelector((state: RootState) => state.executorStatusReducer.running);

  useEffect(() => {
    const checkAndSetPhase = async () => {
      const downloaded = await hasBeenDownloaded(task.cid);
      if (!downloaded) {
        setCurrentPhase('toDownload');
      } else {
        const built = await hasBeenBuilt(task.taskName);
        if (!built) {
          setCurrentPhase('toBuild');
        } else {
          setCurrentPhase('toTestOrActivate');
        }
      }
    };

    checkAndSetPhase();
    if (hasBeenTested(task.taskName)){
      actions.addToTested()
    }
  }, [task.taskName, task.cid]);

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      console.log("handleDownload", task.cid)
      await window.electron.downloadFromIPFS(task.cid);
      setCurrentPhase('toBuild');
      setIsDownloading(false);
    } catch (err) {
      console.error('Error downloading from IPFS:', err);
    }
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    const success = await window.electron.buildImage(task.tag, task.cid);
    if (success) {
      setCurrentPhase('toTestOrActivate');
      addToBuilt(task.taskName);
    } else {
      console.error('Error building image');
    }
    setIsBuilding(false);
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    try {
      const exampleInput = await window.electron.getLocalFile(task.cid, 'example_input.bin');
      const exampleOutput = await window.electron.getLocalFile(task.cid, 'example_output.bin');
      const decoder = new TextDecoder('utf-8');
      const decodedExampleInput = decoder.decode(exampleInput);
      const decodedExampleOutput = decoder.decode(exampleOutput);
      const isExecutorRunningBefore = isExecutorRunning;
      await unpauseExecutor();
      const resources = await getResourceStats();
      const maxResource = {
        cpu: resources.task_cpu,
        mem: resources.task_mem,
      };
      const testRes = await executeTask({
        containerRef: task.tag,
        input: decodedExampleInput,
        resource: maxResource,
        useGpu: task.computingType === ComputingType.GPU,
        gpuCount: 1,
        useSgx: task.computingType === ComputingType.SGX
      });
      if (!isExecutorRunningBefore) {
        await pauseExecutor();
      }
      if (testRes.trim() === decodedExampleOutput.trim()) {
        addToTested(task.taskName);
        actions.addToTested(task.taskName);
      } else {
        console.error('Test failed', testRes, decodedExampleOutput);
      }
    } catch (error) {
      console.log('Error during test: ', error);
    }
    setIsTesting(false);
  };

  const handleActivate = async () => {
    try {
      await addTaskToHost(task.cidBytes, 10, 10);
      addToActivated(task.taskName);
      actions.addToActivated(task.taskName);
    } catch (err) {
      setErrorMessage(`${err}`);
      setErrorDialogOpen(true);
    }
  };

  const handleDeactivate = async () => {
    try {
      await deleteTaskFromHost(task.cidBytes);
      actions.removeFromActivated(task.taskName);
      removeFromActivated(task.taskName);
    } catch (err) {
      setErrorMessage(`${err}`);
      setErrorDialogOpen(true);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await window.electron.deleteFolder(task.cid)
    removeFromTested(task.taskName);
    actions.removeFromTested(task.taskName);
    removeFromBuilt(task.taskName);
    actions.removeFromBuilt(task.taskName);
    removeFromActivated(task.taskName);
    actions.removeFromActivated(task.taskName);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCurrentPhase("toDownload")
    setIsDeleting(false);
  }

  const getTestLabel = () => {
    if (isTesting) return 'Testing';
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
      <ErrorDialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        errorMessage={errorMessage}
      />
      <Grid container>
        <Grid item xs={12} md={7.5}>
          <CardDetail task={task} isTested={isTested} />
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
            {currentPhase === 'toDownload' && (
              <>
                <CustomButton
                  label={isDownloading ? 'Downloading' : 'Download'}
                  onClick={handleDownload}
                  color="text.primary"
                  backgroundColor="primary.main"
                  isLoading={isDownloading}
                />
                <Typography variant="subtitle2">
                  {`Disk Space Required: ${task.sizeFolder}`}
                </Typography>
              </>
            )}
            {currentPhase === 'toBuild' && (
              <>
                <CustomButton
                  label={isBuilding ? 'Building' : 'Build'}
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
              <Grid container spacing={1} alignItems={"center"}>
              <Grid item xs={6} >
                <CustomButton
                  label={getTestLabel()}
                  onClick={handleRunTest}
                  color="text.primary"
                  backgroundColor="primary.main"
                  isLoading={isTesting}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomButton
                  label={isDeleting ? 'Purging' : 'Purge'}
                  onClick={handleDelete}
                  color="text.primary"
                  backgroundColor="secondary.contrastText"
                  isLoading={isDeleting}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomButton
                  label={isActivated ? 'Deactivate' : 'Activate'}
                  onClick={isActivated ? handleDeactivate : handleActivate}
                  color={isTested ? 'text.primary' : 'text.secondary'}
                  backgroundColor={getActivateButtonColor()}
                  showBlockIcon={!isTested}
                  fullWidth
                />
              </Grid>
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
              </Grid>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TaskCard;
