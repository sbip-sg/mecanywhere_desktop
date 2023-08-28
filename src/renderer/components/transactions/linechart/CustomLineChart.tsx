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
import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { ExternalDataEntry } from '../table/dataTypes';

interface GroupedData {
  month: string;
  resource_consumed: number;
}

interface CustomLineChartProps {
  yAxisLabel: string;
  data: ExternalDataEntry[];
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  yAxisLabel,
}) => {
  console.log(data)
  // const dateObjects = data.map(
  //   (entry) => new Date(entry.session_start_datetime * 1000)
  // );
  // const initialMinDate = dateObjects.reduce((min, date) =>
  //   date < min ? date : min
  // );
  // const initialMaxDate = dateObjects.reduce((max, date) =>
  //   date > max ? date : max
  // );
  // const [test, setTest] = useState("thisisastring")
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // const [minDate, setMinDate] = useState<Date>(initialMinDate); // Initialize with calculated values
  // const [maxDate, setMaxDate] = useState<Date>(initialMaxDate);

  useEffect(()=> {
    console.log(data)
  }, [])

  // useEffect(() => {
  //   // Debug: Log minDate and maxDate to check if they are updating
  //   console.log('initialMinDate', initialMinDate);
  //   console.log('minDate', minDate);
  //   console.log('maxDate', maxDate);
  // }, [minDate, maxDate]);
  // useEffect(() => {
  //   // Debug: Log minDate and maxDate to check if they are updating
  //   console.log('minDate', startDate);
  //   console.log('maxDate', endDate);
  // }, [startDate, endDate]);

  const filteredData = data.filter((entry) => {
    if (startDate && endDate) {
      const entryDate = new Date(entry.session_start_datetime * 1000);
      return entryDate >= startDate && entryDate <= endDate;
    }
    return true;
  });

  const groupedDataObject = filteredData.reduce((acc, entry) => {
    const month = new Date(entry.session_start_datetime * 1000).toLocaleString(
      'default',
      { month: 'long' }
    );
    acc[month] = acc[month] || { month, resource_consumed: 0 };
    acc[month].resource_consumed += Number(entry.resource_consumed);
    return acc;
  }, {} as { [key: string]: GroupedData });
  const groupedData: GroupedData[] = Object.values(groupedDataObject);

  return (
    <>
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          // minDate={minDate} // Set minimum date
          // maxDate={maxDate}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
          // minDate={minDate} // Set minimum date
          // maxDate={maxDate} // Set maximum date
        />
      </div>

      <ResponsiveContainer width="85%" height="100%">
        <LineChart data={groupedData} margin={{ top: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }}>
            <Label
              value={yAxisLabel}
              position="insideLeft"
              angle={-90}
              style={{ textAnchor: 'middle', fontSize: 16 }}
            />
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey="resource_consumed" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default CustomLineChart;
