import { useState } from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const CustomListItem = ({ doc }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const navigate = useNavigate();

  return (
    <div>
      <ListItem key={doc.Id} onClick={handleClick} disablePadding>
        <ListItemButton>
          <ListItemText
            primary={<Typography variant="body1">{doc.Name}</Typography>}
          />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse key={doc.Sheets.Id} in={open} timeout="auto" unmountOnExit>
        <List component="li" disablePadding key={doc.Id}>
          {doc.Sheets.map((sheet) => {
            return (
              <ListItem key={sheet.Id} disablePadding>
                <ListItemButton>
                  <ListItemText
                    key={sheet.Id}
                    primary={sheet.Title}
                    onClick={() => {
                      navigate(sheet.Link);
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
      <Divider />
    </div>
  );
};

export default CustomListItem;
