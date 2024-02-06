import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import tasks from './tasks.json';
import TaskCard from './TaskCard';

const TasksManagement: React.FC = () => {
  // const [taskStates, setTaskStates] = useState(
  //   tasks.map((task) => ({
  //     taskName: task.taskName,
  //     downloaded: false,
  //     built: false,
  //   }))
  // );

  // const setTaskAsDownloaded = (taskName: string) => {
  //   const updatedTasks = taskStates.map((task) => {
  //     if (task.taskName === taskName) {
  //       return { ...task, downloaded: true };
  //     }
  //     return task;
  //   });

  //   setTaskStates(updatedTasks);
  // };

  // const checkHasDownloaded = (taskName: string) => {
  //   const task = taskStates.find((_task) => _task.taskName === taskName);
  //   return task ? task.downloaded : false;
  // };

  // const setTaskAsBuilt = (taskName: string) => {
  //   const updatedTasks = taskStates.map((task) => {
  //     if (task.taskName === taskName) {
  //       return { ...task, built: true };
  //     }
  //     return task;
  //   });
  //   setTaskStates(updatedTasks);
  // };

  // const checkHasBuilt = (taskName: string) => {
  //   const task = taskStates.find((_task) => _task.taskName === taskName);
  //   return task ? task.built : false;
  // };

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'scroll',
        padding: '1rem',
      }}
    >
      <Typography
        variant="h3"
        style={{
          padding: '1rem 0 0.5rem 2rem',
        }}
      >
        Task Management
      </Typography>
      {/* <TextField
        label="Search"
        variant="outlined"
        fullWidth
        onChange={}
      /> */}
      <Grid container spacing={2}>
        {tasks.map((task, index) => (
          <Grid item xs={12} key={index}>
            <TaskCard
              task={task}
              // setTaskAsDownloaded={setTaskAsDownloaded}
              // checkHasDownloaded={checkHasDownloaded}
              // setTaskAsBuilt={setTaskAsBuilt}
              // checkHasBuilt={checkHasBuilt}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TasksManagement;
