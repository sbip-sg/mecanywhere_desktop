import { CardContent, Typography, Grid, Divider } from '@mui/material';

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

const CardDetail = ({ task, testData, isTested }) => {
  return (
    <CardContent>
      <Typography variant="h4" margin="0 0 0.5rem 0">
        {task.taskName}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <LabelWithValue label="Docker File CID" value={task.dockerFileCID} />
          <LabelWithValue label="Object File CID" value={task.objectFileCID} />
        </Grid>
        <Grid item xs={12} md={3}>
          <LabelWithValue
            label="Input Size Limit"
            value={task.inputSizeLimit}
          />
          <LabelWithValue
            label="Output Size Limit"
            value={task.outputSizeLimit}
          />
          <LabelWithValue label="Block Time Out" value={task.blockTimeOut} />
        </Grid>
        <Grid item xs={12} md={2.5}>
          <LabelWithValue label="CPU Gas" value={task.cpuGas} />
          <LabelWithValue label="GPU Gas" value={task.gpuGas} />
          <LabelWithValue label="Fee" value={task.fee} />
        </Grid>
        {isTested && (
          <>
            <Divider orientation="vertical" flexItem />
            <Grid item xs={12} md={3}>
              <LabelWithValue
                label="Tested CPU Gas"
                value={testData.TestedCpuGas}
              />
              <LabelWithValue
                label="Tested GPU Gas"
                value={testData.TestedGpuGas}
              />
              <LabelWithValue label="Tested Fee" value={testData.TestedFee} />
            </Grid>
          </>
        )}
      </Grid>
    </CardContent>
  );
};

export default CardDetail;
