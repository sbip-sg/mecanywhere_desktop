import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CustomListItem from './CustomListItem';
import { NavBarItem } from '../navBarItems';

const DrawerComponent = ({ docs }: { docs: NavBarItem[] }) => {
    return (
      <Drawer
        className="drawer"
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List component="nav" aria-labelledby="nested-list-subheader">
            {docs.map((doc, i) => {
              return <CustomListItem key={i} doc={doc} />;
            })}
          </List>
        </Box>
      </Drawer>
    );
  }

export default DrawerComponent