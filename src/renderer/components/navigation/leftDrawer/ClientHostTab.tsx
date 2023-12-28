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
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => {
          console.log('tab changed ', newValue);
          if (newValue === 0) {
            navigate('/clienttxndashboard');
          } else if (newValue === 1) {
            navigate('/hosttxndashboard');
          } else {
            console.error('uncaught error');
          }
          setActiveTab(newValue);
        }}
        variant="fullWidth"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'transparent',
          },
          '& .MuiButtonBase-root.MuiTab-root': {
            borderRadius: '15px 15px 0 0',
            paddingTop: '1rem',
            color: 'text.primary',
            fontSize: '16px',
          },
          backgroundColor: isLightTheme
            ? 'customColor.lightGrey'
            : 'primary.dark',
          '& .Mui-selected': {
            backgroundColor: isLightTheme
              ? 'background.default'
              : 'primary.dark',
            paddingTop: '1rem',
            height: '3rem',
            color: 'black',
            fontWeight: '600',
          },
        }}
      >
        <Tab label="Client" />
        <Tab label="Host" />
      </Tabs>
      <div role="tabpanel" hidden={activeTab !== 0}>
        <ClientTab />
      </div>
      <div role="tabpanel" hidden={activeTab !== 1}>
        <HostTab />
      </div>
    </Box>
  );
};

export default ClientHostTab;
