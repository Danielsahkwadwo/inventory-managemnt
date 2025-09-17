import React from 'react';
import { DollarSign, ShoppingCart, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { useInventory } from '../../../contexts/InventoryContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InventorySummaryProps {
  period: string;
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ period }) => {
  const { items, getInventoryValue, getPotentialProfit } = useInventory();
  
  const inventoryValue = getInventoryValue();
  const potentialProfit = getPotentialProfit();
  
  // Mock data - in a real app this would come from sales history
  const generateMockData = (periodLabel: string) => {
    let days;
    switch(periodLabel) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 30; break; // We'll just show months for year view
      default: days = 12; // All time shows full year
    }
    
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      // For year view, show months instead of days
      let label;
      if (periodLabel === '1y' || periodLabel === 'all') {
        label = date.toLocaleString('default', { month: 'short' });
      } else {
        label = date.getDate().toString();
      }
      
      // Generate some realistic looking data
      const salesValue = Math.floor(1000 + Math.random() * 2000);
      const profitValue = Math.floor(salesValue * (0.3 + Math.random() * 0.2));
      
      data.push({
        name: label,
        sales: salesValue,
        profit: profitValue
      });
    }
    
    return data;
  };
  
  const chartData = generateMockData(period);
  
  // Calculate averages
  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);
  const totalProfit = chartData.reduce((sum, item) => sum + item.profit, 0);
  const averageSales = totalSales / chartData.length;
  const averageProfit = totalProfit / chartData.length;
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Inventory Summary</h3>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your inventory value, sales, and profits
        </p>
      </div>
      
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-700 font-medium">Items in Stock</p>
              <Package className="h-5 w-5 text-blue-700" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-emerald-700 font-medium">Inventory Value</p>
              <DollarSign className="h-5 w-5 text-emerald-700" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ${inventoryValue.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-amber-700 font-medium">Avg Daily Sales</p>
              <ShoppingCart className="h-5 w-5 text-amber-700" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ${averageSales.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-teal-700 font-medium">Potential Profit</p>
              <TrendingUp className="h-5 w-5 text-teal-700" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              ${potentialProfit.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Sales and Profit Chart */}
        <div className="mt-4">
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Sales and Profit Trend
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  label={{ 
                    value: period === '1y' || period === 'all' ? 'Month' : 'Day', 
                    position: 'insideBottomRight', 
                    offset: -10 
                  }} 
                />
                <YAxis 
                  label={{ 
                    value: 'Amount ($)', 
                    angle: -90, 
                    position: 'insideLeft' 
                  }} 
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, '']} />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="#1E40AF" />
                <Bar dataKey="profit" name="Profit" fill="#0D9488" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Summary */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-gray-900 mb-2">
            Summary
          </h4>
          <p className="text-sm text-gray-600">
            Your inventory currently consists of <strong>{items.length} unique items</strong> with a 
            total of <strong>{items.reduce((sum, item) => sum + item.quantity, 0)} units</strong> in stock.
            The total inventory value is <strong>${inventoryValue.toFixed(2)}</strong> with a potential 
            profit of <strong>${potentialProfit.toFixed(2)}</strong> if all items are sold at their current 
            prices.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            For the selected period, your average daily sales were <strong>${averageSales.toFixed(2)}</strong> with 
            an average profit of <strong>${averageProfit.toFixed(2)}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;