import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Stack } from '@mui/material';
import { getResourceStats } from 'renderer/services/ExecutorServices';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import { ResourcesLog } from '../../../../utils/dataTypes';

interface InfoItemProps {
  caption: string;
  detail: string;
}

interface PostSharingEnabledComponentProps {
  handleDisableResourceSharing: () => Promise<void>;
  isLoading: boolean;
  initialResourcesLog: ResourcesLog;
}

const InfoItem: React.FC<InfoItemProps> = ({ caption, detail }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.7rem 0 0rem 0',
      }}
    >
      <Typography
        fontWeight="500"
        variant="h4"
        fontSize="13px"
        textAlign="left"
      >
        {caption}
      </Typography>
      <Typography
        fontWeight="700"
        variant="h4"
        fontSize="13px"
        textAlign="right"
      >
        {detail}
      </Typography>
    </Box>
  );
};

const PostSharingEnabledComponent: React.FC<
  PostSharingEnabledComponentProps
> = ({ handleDisableResourceSharing, isLoading, initialResourcesLog }) => {
  const [resourcesLog, setResourcesLog] =
    useState<ResourcesLog>(initialResourcesLog);

  useEffect(() => {
    const interval = setInterval(async () => {
      const fetchResource = async () => {
        const resources = await getResourceStats();
        if (
          Object.keys(resources).length ===
          Object.keys(initialResourcesLog).length
        ) {
          setResourcesLog(resources);
        }
      };
      fetchResource();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack
      width="100%"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack sx={{ width: '100%', padding: '1.5rem 1.5rem 0 1.5rem' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0.7rem 0 0.7rem 0',
            color: 'primary.main',
          }}
        >
          <WifiTetheringIcon
            style={{ fontSize: '32px', paddingRight: '0.5rem' }}
          />
          <Typography
            width="100%"
            variant="body2"
            fontSize="14px"
            textAlign="start"
            style={{ fontWeight: '600', paddingTop: '0.2rem' }}
          >
            You are sharing compute resource!
          </Typography>
        </Box>

        <InfoItem caption="Session ID" detail="01H65Y8SMXXCZQ" />
        <InfoItem
          caption="Total CPU Cores"
          detail={`${resourcesLog.total_cpu}`}
        />
        <InfoItem
          caption="Total Memory (MB)"
          detail={`${resourcesLog.total_mem}`}
        />
        <InfoItem
          caption="Allocated CPU Cores"
          detail={`${resourcesLog.task_cpu}`}
        />
        <InfoItem
          caption="Allocated Memory (MB)"
          detail={`${resourcesLog.task_mem}`}
        />
        <InfoItem
          caption="CPU Utilization (%)"
          detail={`${resourcesLog.used_cpu}`}
        />
        <InfoItem
          caption="Memory Utilization (%)"
          detail={`${resourcesLog.used_mem}`}
        />
        <InfoItem
          caption="Task Used CPU"
          detail={`${resourcesLog.task_used_cpu}`}
        />
        <InfoItem
          caption="Task Used Memory"
          detail={`${resourcesLog.task_used_mem}`}
        />
      </Stack>
      <Grid
        container
        item
        sx={{ justifyContent: 'center', padding: '2rem 1.5rem 2rem 1.5rem' }}
      >
        <Grid container item xs={12} sx={{ padding: '0 0 0 0rem' }}>
          <Button
            onClick={handleDisableResourceSharing}
            sx={{
              width: '100%',
              padding: '0.6rem',
              color: isLoading ? 'primary.main' : 'inherit',
              backgroundColor: isLoading
                ? 'background.paper'
                : 'secondary.contrastText',
            }}
          >
            <Typography
              sx={{
                fontSize: '15px',
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              Disable Resource&nbsp;Sharing
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default PostSharingEnabledComponent;
