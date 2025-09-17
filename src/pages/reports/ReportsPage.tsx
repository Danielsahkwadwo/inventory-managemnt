import React, { useState } from 'react';
import { 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  ShoppingCart
} from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';

// Components
import InventorySummary from './components/InventorySummary';
import CategoryReport from './components/CategoryReport';
import TopSellingItems from './components/TopSellingItems';
import ProfitReport from './components/ProfitReport';

// Date periods
const DATE_PERIODS = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last Year', value: '1y' },
  { label: 'All Time', value: 'all' },
];

const ReportsPage: React.FC = () => {
  const { items, categories } = useInventory();
  const [activePeriod, setActivePeriod] = useState('30d');
  const [activeReport, setActiveReport] = useState('summary');

  // Report types
  const reportTypes = [
    { id: 'summary', name: 'Inventory Summary', icon: <FileText size={18} /> },
    { id: 'category', name: 'Category Analysis', icon: <BarChart3 size={18} /> },
    { id: 'topSelling', name: 'Top Selling Items', icon: <ShoppingCart size={18} /> },
    { id: 'profit', name: 'Profit Analysis', icon: <TrendingUp size={18} /> },
  ];
  
  const renderReportContent = () => {
    switch (activeReport) {
      case 'summary':
        return <InventorySummary period={activePeriod} />;
      case 'category':
        return <CategoryReport period={activePeriod} />;
      case 'topSelling':
        return <TopSellingItems period={activePeriod} />;
      case 'profit':
        return <ProfitReport period={activePeriod} />;
      default:
        return <InventorySummary period={activePeriod} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Get insights and detailed reports about your inventory and sales.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Export Report
          </button>
        </div>
      </div>
      
      {/* Date filter */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-sm text-gray-700 font-medium">Time Period:</span>
          <div className="ml-4 flex space-x-2">
            {DATE_PERIODS.map((period) => (
              <button
                key={period.value}
                type="button"
                onClick={() => setActivePeriod(period.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activePeriod === period.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Report Types</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  className={`w-full flex items-center px-4 py-4 hover:bg-gray-50 text-left ${
                    activeReport === report.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setActiveReport(report.id)}
                >
                  <div className={`flex-shrink-0 p-2 rounded-full ${
                    activeReport === report.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {report.icon}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    activeReport === report.id ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {report.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;