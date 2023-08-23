import {
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Typography,
  Card,
  CardContent,
  Box
} from '@mui/material';
import { useTheme } from '@emotion/react';

const PieChartCard = () => {
    const theme = useTheme();
    const getRandomPercent = () => Math.floor(Math.random() * 50) + 10; // Random percent between 10 and 60
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const tasks = ['game_render', 'ml_lstm', 'vr_render', 'ml_dbn'];
    const usageData = tasks.map((task) => ({
        name: task,
        value: getRandomPercent(),
      }));
    return (

        <Card
            sx={{
              minWidth: 220,
              height: 230,
              backgroundColor: theme.palette.lightBlack.main,
            }}
          >
            <CardContent
              sx={{
                height:"100%",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{height:"100%"}}>
                <Typography
                  sx={{ fontSize: 16, marginBottom: '2rem' }}
                  color={theme.palette.cerulean.main}
                  gutterBottom
                  >
                  Usage percent by Tasks
                </Typography>
              </Box>
              <PieChart width={240} height={180}>
                <Pie
                  dataKey="value"
                  labelLine={false}
                  data={usageData}
                  cx={80}
                  cy={80}
                  outerRadius={80}
                  fill="#8884d8"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    const labelRadius = radius * 1.1; // Adjust this factor as needed

                    const labelX =
                      cx + labelRadius * Math.cos(-midAngle * RADIAN);
                    const labelY =
                      cy + labelRadius * Math.sin(-midAngle * RADIAN);
                    const isLeftHalf = x > cx;

                    return (
                      <text
                        x={labelX}
                        y={labelY}
                        fill="white"
                        textAnchor={isLeftHalf ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={12}
                      >
                        {`${tasks[index]}: ${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {usageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </CardContent>
          </Card>
    )
}

export default PieChartCard;