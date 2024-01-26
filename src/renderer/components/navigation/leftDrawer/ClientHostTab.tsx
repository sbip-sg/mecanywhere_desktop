import { useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import useIsLightTheme from 'renderer/components/common/useIsLightTheme';
import { useState } from 'react';
import ClientTab from './ClientTab';
import HostTab from './HostTab';

const ClientHostTab = () => {
  const navigate = useNavigate();
  const isLightTheme = useIsLightTheme();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box
      sx={{
        backgroundColor: isLightTheme ? '' : 'primary.dark',
        height: '100%',
      }}
    >
      <HostTab />
    </Box>
  );
};

export default ClientHostTab;
