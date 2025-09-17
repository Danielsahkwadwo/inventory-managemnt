import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for inventory value over time
const data = [
  { date: 'Jan', value: 12000 },
  { date: 'Feb', value: 15000 },
  { date: 'Mar', value: 14000 },
  { date: 'Apr', value: 18000 },
  { date: 'May', value: 16000 },
  { date: 'Jun', value: 19000 },
  { date: 'Jul', value: 22000 },
];

const InventoryValueChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#e5e5e5' }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip 
          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Sales']}
          labelFormatter={(label) => `${label} 2024`}
          contentStyle={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: 'none'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#1E40AF" 
          strokeWidth={3} 
          dot={{ stroke: '#1E40AF', strokeWidth: 2, r: 4, fill: 'white' }}
          activeDot={{ r: 6, stroke: '#1E40AF', strokeWidth: 2, fill: 'white' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default InventoryValueChart;