import React from 'react';
import { useInventory } from '../../../contexts/InventoryContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CategoryReportProps {
  period: string;
}

const COLORS = ['#1E40AF', '#0D9488', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#F97316'];

const CategoryReport: React.FC<CategoryReportProps> = ({ period }) => {
  const { items, categories } = useInventory();
  
  // Group items by category
  const categorySummary = categories.map(category => {
    const categoryItems = items.filter(item => item.category === category.name);
    const totalQuantity = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = categoryItems.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0);
    const potentialSales = categoryItems.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
    const potentialProfit = potentialSales - totalValue;
    
    return {
      category: category.name,
      itemCount: categoryItems.length,
      totalQuantity,
      totalValue,
      potentialSales,
      potentialProfit,
      averageMargin: totalValue > 0 ? (potentialProfit / totalValue) * 100 : 0
    };
  }).filter(category => category.itemCount > 0); // Remove empty categories
  
  // Sort by total value
  categorySummary.sort((a, b) => b.totalValue - a.totalValue);
  
  // Prepare pie chart data
  const pieChartData = categorySummary.map(item => ({
    name: item.category,
    value: item.totalValue
  }));
  
  // Prepare bar chart data for profit margins
  const marginChartData = [...categorySummary]
    .sort((a, b) => b.averageMargin - a.averageMargin)
    .map(item => ({
      name: item.category,
      margin: Math.round(item.averageMargin)
    }));

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Category Analysis</h3>
        <p className="mt-1 text-sm text-gray-500">
          Breakdown of your inventory by category
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Value Distribution */}
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">
              Inventory Value by Category
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Value']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Profit Margin by Category */}
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">
              Profit Margin by Category
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={marginChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" unit="%" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Margin']} />
                  <Bar dataKey="margin" fill="#0D9488" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Category Details Table */}
        <div className="mt-8">
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Category Details
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Potential Sales
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Margin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categorySummary.map((category, index) => (
                  <tr key={category.category} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.itemCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.totalQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${category.totalValue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${category.potentialSales.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {category.averageMargin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {categorySummary.reduce((sum, cat) => sum + cat.itemCount, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {categorySummary.reduce((sum, cat) => sum + cat.totalQuantity, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${categorySummary.reduce((sum, cat) => sum + cat.totalValue, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${categorySummary.reduce((sum, cat) => sum + cat.potentialSales, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Average margin across all categories */}
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {(categorySummary.reduce((sum, cat) => sum + cat.potentialProfit, 0) / 
                       categorySummary.reduce((sum, cat) => sum + cat.totalValue, 0) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryReport;