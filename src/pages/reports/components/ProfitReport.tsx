import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { useInventory } from '../../../contexts/InventoryContext';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProfitReportProps {
  period: string;
}

const ProfitReport: React.FC<ProfitReportProps> = ({ period }) => {
  const { getPotentialProfit } = useInventory();
  
  // Calculate total potential profit
  const potentialProfit = getPotentialProfit();
  
  // Mock data for profit trends
  const generateMockData = (periodLabel: string) => {
    let days;
    let format;
    
    switch(periodLabel) {
      case '7d': 
        days = 7; 
        format = 'day';
        break;
      case '30d': 
        days = 30; 
        format = 'day';
        break;
      case '90d': 
        days = 12; // Show weeks for 90d
        format = 'week';
        break;
      case '1y': 
        days = 12; // Show months for year view
        format = 'month';
        break;
      default: 
        days = 12; // All time shows full year
        format = 'month';
    }
    
    const data = [];
    let baseRevenue = 15000;
    let baseCost = 10000;
    
    for (let i = 0; i < days; i++) {
      // Create some variance in the data
      const variance = 0.1 + (Math.random() * 0.2);
      const revenue = baseRevenue * (1 + variance * (Math.random() > 0.5 ? 1 : -1));
      const cost = baseCost * (1 + (variance / 2) * (Math.random() > 0.5 ? 1 : -1));
      const profit = revenue - cost;
      const margin = (profit / revenue) * 100;
      
      // Generate label based on format
      let label;
      if (format === 'day') {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        label = `Day ${i+1}`;
      } else if (format === 'week') {
        label = `Week ${i+1}`;
      } else {
        const date = new Date();
        date.setMonth(date.getMonth() - (days - i - 1));
        label = date.toLocaleString('default', { month: 'short' });
      }
      
      data.push({
        name: label,
        revenue: Math.round(revenue),
        cost: Math.round(cost),
        profit: Math.round(profit),
        margin: Math.round(margin * 10) / 10
      });
      
      // Slightly increase base values for an upward trend
      baseRevenue *= 1.01;
      baseCost *= 1.008;
    }
    
    return data;
  };
  
  const profitData = generateMockData(period);
  
  // Calculate summary data
  const totalRevenue = profitData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = profitData.reduce((sum, item) => sum + item.cost, 0);
  const totalProfit = profitData.reduce((sum, item) => sum + item.profit, 0);
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Profit Analysis</h3>
        <p className="mt-1 text-sm text-gray-500">
          Detailed breakdown of your revenue, costs, and profit margins
        </p>
      </div>
      
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-700 font-medium">Revenue</p>
              <DollarSign className="h-5 w-5 text-blue-700" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ${Math.round(totalRevenue).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-amber-700 font-medium">Costs</p>
              <DollarSign className="h-5 w-5 text-amber-700" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ${Math.round(totalCost).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-emerald-700 font-medium">Profit</p>
              <TrendingUp className="h-5 w-5 text-emerald-700" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ${Math.round(totalProfit).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-teal-700 font-medium">Margin</p>
              <TrendingUp className="h-5 w-5 text-teal-700" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {avgMargin.toFixed(1)}%
            </p>
          </div>
        </div>
        
        {/* Profit Trend Chart */}
        <div className="mt-4">
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Revenue & Profit Trend
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={profitData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue" 
                  stackId="1" 
                  fill="rgba(30, 64, 175, 0.2)" 
                  stroke="#1E40AF"
                />
                <Area 
                  type="monotone" 
                  dataKey="cost" 
                  name="Cost" 
                  stackId="2" 
                  fill="rgba(245, 158, 11, 0.2)" 
                  stroke="#F59E0B" 
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  name="Profit" 
                  fill="rgba(13, 148, 136, 0.4)" 
                  stroke="#0D9488" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Profit Margin Chart */}
        <div className="mt-8">
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Profit Margin Trend
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={profitData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Margin']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="margin" 
                  name="Profit Margin" 
                  stroke="#0D9488" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Summary */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-gray-900 mb-2">
            Profit Analysis Summary
          </h4>
          <p className="text-sm text-gray-600">
            For the selected period, your business generated <strong>${Math.round(totalRevenue).toLocaleString()}</strong> in 
            revenue with costs of <strong>${Math.round(totalCost).toLocaleString()}</strong>, resulting in 
            a profit of <strong>${Math.round(totalProfit).toLocaleString()}</strong>.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Your average profit margin was <strong>{avgMargin.toFixed(1)}%</strong>, which means for every 
            dollar in sales, you earned <strong>${(avgMargin / 100).toFixed(2)}</strong> in profit.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Current inventory has a potential profit of <strong>${potentialProfit.toFixed(2)}</strong> if all 
            items are sold at their current prices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfitReport;