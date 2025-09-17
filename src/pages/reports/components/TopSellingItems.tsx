import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Package } from 'lucide-react';
import { useInventory } from '../../../contexts/InventoryContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopSellingItemsProps {
  period: string;
}

// Mock sales data (in a real app, this would come from a sales database)
const MOCK_SALES = [
  { itemId: "item-1", name: "Smartphone", sold: 42, revenue: 20999.58, profit: 6299.58 },
  { itemId: "item-2", name: "Laptop", sold: 27, revenue: 24299.73, profit: 6749.73 },
  { itemId: "item-3", name: "T-Shirt", sold: 85, revenue: 1699.15, profit: 977.40 },
  { itemId: "item-4", name: "Notebook", sold: 156, revenue: 778.44, profit: 389.22 },
  { itemId: "item-5", name: "Headphones", sold: 38, revenue: 2279.62, profit: 909.62 },
  { itemId: "item-6", name: "Rice (5kg)", sold: 62, revenue: 1177.38, profit: 430.38 },
];

const TopSellingItems: React.FC<TopSellingItemsProps> = ({ period }) => {
  const { items, getItem } = useInventory();
  
  // Filter sales based on period (mock implementation)
  const filteredSales = MOCK_SALES;
  
  // Sort by quantity sold
  const sortedByQuantity = [...filteredSales].sort((a, b) => b.sold - a.sold);
  
  // Sort by profit
  const sortedByProfit = [...filteredSales].sort((a, b) => b.profit - a.profit);
  
  // Prepare chart data
  const quantityChartData = sortedByQuantity.slice(0, 5).map(item => ({
    name: item.name,
    sold: item.sold
  }));
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Top Selling Items</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your best performing products by sales volume and profit
        </p>
      </div>
      
      <div className="p-6">
        {/* Top sellers chart */}
        <div className="mb-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Top Items by Sales Volume
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={quantityChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip formatter={(value) => [`${Number(value)} units`, 'Sold']} />
                <Bar 
                  dataKey="sold" 
                  name="Units Sold" 
                  fill="#1E40AF" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top sellers table */}
        <div className="mt-8">
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Top Items by Profit
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Sold
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Margin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedByProfit.map((sale) => {
                  const item = getItem(sale.itemId);
                  const profitMargin = item 
                    ? (item.salePrice - item.purchasePrice) / item.purchasePrice * 100 
                    : 0;
                    
                  return (
                    <tr key={sale.itemId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item?.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="ml-4">
                            <Link to={`/inventory/${sale.itemId}`} className="text-sm font-medium text-blue-700 hover:underline">
                              {sale.name}
                            </Link>
                            <div className="text-xs text-gray-500">
                              {item?.sku || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sale.sold} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${sale.revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TrendingUp className="text-emerald-500 h-4 w-4 mr-1" />
                          <span className="text-sm text-emerald-700 font-medium">
                            ${sale.profit.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                          {profitMargin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSellingItems;