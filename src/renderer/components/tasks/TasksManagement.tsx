import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Pagination,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { Task } from 'renderer/utils/dataTypes';
import {
  cid_from_sha256,
  getTaskListFromContract,
} from 'renderer/services/TaskContractService';
import { retrieveIPFSFolderMetadata } from 'renderer/services/IPFSService';
import TaskCard from './TaskCard';
import SortWidget from './SortWidget';

const sortTasks = (
  tasks: Task[],
  field: keyof Task,
  direction: 'asc' | 'desc'
): Task[] => {
  return tasks.sort((a, b) => {
    if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
    if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

const TasksManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortField, setSortField] = useState<keyof Task>('taskName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getTaskListFromContract()
      .then(async (rawTasks) => {
        if (!rawTasks || rawTasks.length === 0) {
          return [];
        }
        console.log(rawTasks);
        if (!rawTasks) {
          return [];
        }
        const taskList = [];
        for (let i = 0; i < rawTasks.length; i++) {
          const task = rawTasks[i];
          const newTask = {} as Task;
          newTask.cidBytes = task.ipfsSha256;
          newTask.cid = await cid_from_sha256(task.ipfsSha256);
          newTask.fee = task.fee;
          newTask.sizeIo = task.size;
          newTask.owner = task.owner;
          const computingTypeNumber = Number(task.computingType);
          if (computingTypeNumber === 0) {
            newTask.computingType = 'CPU';
          } else if (computingTypeNumber === 1) {
            newTask.computingType = 'GPU';
          } else {
            newTask.computingType = 'Unknown';
          }
          const metadata = await retrieveIPFSFolderMetadata(newTask.cid);
          if (metadata) {
            newTask.taskName = metadata.name;
            newTask.description = metadata.description;
            newTask.sizeFolder = metadata.sizeFolder;
          }
          taskList.push(newTask);
        }
        return taskList;
      })
      .then((retrievedTasks) => {
        const filteredTasks = retrievedTasks.filter((task) => task !== null);
        setTasks(filteredTasks);
        return true;
      })
      .catch((error) => console.error(error));
  }, []);

  const tasksPerPage = 10;
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSortFieldChange = (event: SelectChangeEvent) => {
    setSortField(event.target.value as keyof Task);
  };

  const handleSortDirectionChange = (event: SelectChangeEvent) => {
    setSortDirection(event.target.value as 'asc' | 'desc');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTasks = tasks.filter((task) =>
    task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedTasks = sortTasks(filteredTasks, sortField, sortDirection);
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);

  return (
    <Box sx={{ height: '100%', overflowY: 'scroll', padding: '2rem' }}>
      <Typography variant="h3" sx={{ padding: '1rem 0 3rem 0' }}>
        Task Management
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'end',
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: { xs: 'normal', md: 'end' },
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
          }}
        >
          <TextField
            type="text"
            placeholder="Search by Task Name..."
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              minWidth: { md: '20rem', xs: '100%' },
              margin: { xs: '0 1rem 2rem 0', md: '0' },
            }}
            inputProps={{
              sx: { fontSize: '13px', padding: '1rem' },
            }}
          />
          <SortWidget
            sortField={sortField}
            sortDirection={sortDirection}
            handleSortFieldChange={handleSortFieldChange}
            handleSortDirectionChange={handleSortDirectionChange}
          />
        </Box>
        {currentTasks.length > 0 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChange}
            variant="outlined"
            shape="rounded"
            sx={{
              marginTop: { xs: '1rem', md: 0 },
            }}
          />
        )}
      </Box>
      {currentTasks.length > 0 ? (
        <>
          <Grid container spacing={1}>
            {currentTasks.map((task) => (
              <Grid item xs={12} key={task.cid}>
                <TaskCard task={task} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChange}
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </>
      ) : (
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', marginTop: '2rem' }}
        >
          No results found.
        </Typography>
      )}
    </Box>
  );
};

export default TasksManagement;
