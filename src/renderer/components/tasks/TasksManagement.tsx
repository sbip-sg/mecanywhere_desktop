import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, ListItem } from '@mui/material';
import { List } from '@mui/icons-material';

const TasksManagement: React.FC = () => {
  const did = window.electron.store.get('did');

  useEffect(() => {
    console.log('task');
  }, []);

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
      <List>
        <ListItem>
          Hello
        </ListItem>
        <ListItem>
          World
        </ListItem>

      </List>
    </Box>
  );
};

export default TasksManagement;
