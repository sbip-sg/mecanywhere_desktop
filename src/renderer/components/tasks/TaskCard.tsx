// add a method for checking locally if file has downloaded already - done
// task fields: CID, Fee, Computing Type (gpu/cpu etc), size_io, size_folder (see if possible to check), name will be CID
// test actual template, and integrate with docker

import { Card, Typography, Grid, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Task } from 'renderer/utils/dataTypes';
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
import { addTaskToHost } from 'renderer/services/HostContractService';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [currentPhase, setCurrentPhase] = useState('toDownload');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (hasBeenTested(task.taskName)){
      actions.addToTested()
    }

    }, [task.taskName, task.cid]);

  const isTested = useSelector((state: RootState) =>
    state.taskList.tested.includes(task.taskName)
  );
  const isActivated = useSelector((state: RootState) =>
    state.taskList.activated.includes(task.taskName)
  );

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      console.log("handleDownload", task.cid)
      // await window.electron.downloadFromIPFS(task.cid);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCurrentPhase('toBuild');
      setIsDownloading(false);
    } catch (err) {
      console.error('Error downloading from IPFS:', err);
    }
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCurrentPhase('toTestOrActivate');
    addToBuilt(task.taskName);
    setIsBuilding(false);
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const testRes = await window.electron.testReadFile(task.cid);
    console.log("testRes", testRes)
    addToTested(task.taskName);
    actions.addToTested(task.taskName);
    setIsTesting(false);
  };

  const handleActivate = () => {
    try {
      addTaskToHost(task.cidBytes, 10, 10);
    } catch (err) {
      console.error('Error adding task to host:', err);
    }
    addToActivated(task.taskName);
    actions.addToActivated(task.taskName);
  };

  const handleDeactivate = () => {
    removeFromActivated(task.taskName);
    actions.removeFromActivated(task.taskName);
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
