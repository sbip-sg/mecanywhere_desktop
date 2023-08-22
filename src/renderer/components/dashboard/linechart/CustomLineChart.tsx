import {
  LineChart,
  Label,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';

interface GroupedData {
  month: string;
  resource_consumed: number;
}

interface CustomLineChartProps {
  groupedData: GroupedData[];
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({ groupedData }) => {
  return (
    <ResponsiveContainer width="85%" height="100%">
      <LineChart data={groupedData} margin={{ top: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }}>
          <Label
            value="Resource Consumed per Month"
            position="insideLeft"
            angle={-90}
            style={{ textAnchor: 'middle', fontSize: 16 }}
          />
        </YAxis>
        <Tooltip />
        <Line type="monotone" dataKey="resource_consumed" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
