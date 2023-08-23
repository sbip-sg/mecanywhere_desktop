import {
  Bar,
  BarChart,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface GroupedData {
    month: string;
    resource_consumed: number;
  }

interface CustomBarChartProps {
    groupedData: GroupedData[];
}

const CustomBarChart: React.FC<CustomBarChartProps>  = ({groupedData}) => {
    console.log("groupedData", groupedData)
    return (
        <ResponsiveContainer width="85%" height="90%">
          <BarChart data={groupedData} margin={{ top: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }}>
              <Label
                value="Amount Billed (SGD) by Month"
                position="insideLeft"
                angle={-90}
                style={{ textAnchor: 'middle', fontSize: 16 }}
              />
            </YAxis>
            <Tooltip />
            <Bar dataKey="resource_consumed" fill="#8884d8" barSize={60} />
          </BarChart>
        </ResponsiveContainer>
    );
}

export default CustomBarChart