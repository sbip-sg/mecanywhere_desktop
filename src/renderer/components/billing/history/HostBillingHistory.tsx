import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Datagrid from './table/Datagrid';
import mockUserBillingData from '../../../../assets/mockUserBillingData.json';
import { ExternalBillingDataEntry } from './table/dataTypes';
import { ExternalPropConfigList } from './propConfig';

const ClientPastTxn = () => {
  const [data, setData] = useState<ExternalBillingDataEntry[]>([]);
  useEffect(() => {
    setData(mockUserBillingData);
  }, []);

  return (
    <Stack
      id="dashboard-stack"
      height="100%"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Box
        id="boxy"
        sx={{
          height: '100%',
          width: '95%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflowY: 'hidden',
        }}
      >
        <Datagrid
          data={data}
          propConfigList={ExternalPropConfigList}
        />
      </Box>
    </Stack>
  );
};

export default ClientPastTxn;
