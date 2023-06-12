import { useState } from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { NavBarItem } from './navBarItems';

interface CustomListItemProps {
  doc: NavBarItem;
}

const CustomListItem: React.FC<CustomListItemProps> = ({ doc }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const navigate = useNavigate();

  return (
    <div>
      <ListItem onClick={handleClick} disablePadding>
        <ListItemButton>
          <Typography variant="body1">{doc.Name}</Typography>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="li" disablePadding>
          {doc.Sheets.map((sheet, i) => {
            return (
              <ListItemButton
                onClick={() => {
                  navigate(sheet.Link);
                }}
                key={i}
              >
                <Typography>{sheet.Title}</Typography>
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
      <Divider />
    </div>
  );
};

export default CustomListItem;
