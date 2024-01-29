import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import useIsLightTheme from 'renderer/components/common/useIsLightTheme';

interface ColumnWidths {
  [key: string]: number;
}
interface CustomListHeaderProps {
  isAnyAccordionExpanded: boolean;
  columnWidths: ColumnWidths;
}

const CustomListHeader: React.FC<CustomListHeaderProps> = ({
  isAnyAccordionExpanded,
  columnWidths,
}) => {
  const columnLabels = ['Date', 'Status', '', 'Amount'];
  const columnKeys = ['first', 'second', 'third', 'fourth'];
  let headerTextColor = 'text.primary'; // dark theme case
  const isLightTheme = useIsLightTheme();
  if (isLightTheme) {
    headerTextColor = isAnyAccordionExpanded
      ? 'text.primary'
      : 'text.secondary';
  }
  let headerBackgroundColor = 'background.paper'; // dark theme case
  if (isLightTheme) {
    headerBackgroundColor = isAnyAccordionExpanded
      ? 'background.paper'
      : 'primary.dark';
  }
  return (
    <Card
      id="billing-list-header"
      elevation={0}
      sx={{
        marginBottom: 0,
        backgroundColor: headerBackgroundColor,
        padding: '1rem 0rem 0.5rem 0rem',
      }}
    >
      <CardContent
        sx={{
          padding: 0,
          '&:last-child': {
            paddingBottom: '0.5rem',
          },
        }}
      >
        <Grid container alignItems="center" sx={{ paddingRight: '3.5rem' }}>
          {columnLabels.map((label, index) => (
            <Grid
              key={label}
              item
              xs={
                (columnWidths as { [key: string]: number })[columnKeys[index]]
              }
              sx={{ justifyContent: 'start' }}
            >
              {label && (
                <Typography
                  variant="body1"
                  sx={{
                    padding: '0rem 0rem 0rem 2rem',
                    color: headerTextColor,
                  }}
                >
                  {label}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CustomListHeader;
