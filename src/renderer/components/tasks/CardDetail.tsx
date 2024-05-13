import { CardContent, Grid, Divider, Typography  } from '@mui/material';
import React from 'react';
import { Task } from 'renderer/utils/dataTypes';

interface LabelWithValueProps {
  label: string;
  value: string;
}

const LabelWithValue: React.FC<LabelWithValueProps> = ({ label, value }) => {
  return (
    <Typography variant="subtitle2" sx={{ margin: '0 0 0.2rem 0' }}>
      <span style={{ fontWeight: 600 }}>{label}</span>: {value}
    </Typography>
  );
};

interface CardDetailProps {
  task: Task;
  isTested: boolean;
}

const CardDetail: React.FC<CardDetailProps> = ({ task, isTested }) => {
  return (
    <CardContent>
      <Typography variant="h4" margin="0 0 0.5rem 0">
        {task.taskName}
      </Typography>
        <Grid item xs={12} md={12} marginBottom="0.5rem">
          <LabelWithValue label="CID" value={task.cid} />
        </Grid>
      <Grid container>
        <Grid item xs={12} md={4}>
          <LabelWithValue
            label="I/O Size"
            value={task.sizeIo.toString() + 'B'}
          />
          <LabelWithValue
            label="Folder Size"
            value={task.sizeFolder.toString() + 'B'}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <LabelWithValue label="Computing Type" value={task.computingType} />
          <LabelWithValue label="Fee" value={'$' + task.fee.toString()} />
        </Grid>

      </Grid>
        {isTested && (
          <>
            {/* <Divider orientation="vertical" flexItem /> */}
            <Typography variant="subtitle2" sx={{fontWeight: 600, color: "primary.main", paddingTop: "0.5rem"}}>File tested, no issue.</Typography >
          </>
        )}
    </CardContent>
  );
};

export default CardDetail;
