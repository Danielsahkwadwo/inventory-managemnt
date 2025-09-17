import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowUp,
  ArrowDown, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  LineChart,
  BarChart3
} from 'lucide-react';

import StatCard from './components/StatCard';
import LowStockItems from './components/LowStockItems';
import RecentActivity from './components/RecentActivity';
import InventoryValueChart from './components/InventoryValueChart';
import CategoryDistributionChart from './components/CategoryDistributionChart';

const DashboardPage: React.FC = () => {
  const { items, getLowStockItems, getInventoryValue, getPotentialProfit } = useInventory();
  const { user } = useAuth();
  
  const inventoryValue = getInventoryValue();
  const potentialProfit = getPotentialProfit();
  const lowStockItems = getLowStockItems();
  
  // Calculate simple statistics
  const totalItems = items.length;
  const outOfStock = items.filter(item => item.quantity === 0).length;
  const averagePrice = items.length > 0 
    ? (items.reduce((sum, item) => sum + item.salePrice, 0) / items.length).toFixed(2)
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-8 md:px-10">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-blue-100 text-sm md:text-base">
            Here's what's happening with your inventory today
          </p>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Inventory Value" 
          value={`$${inventoryValue.toFixed(2)}`} 
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          color="emerald"
        />
        <StatCard 
          title="Potential Profit" 
          value={`$${potentialProfit.toFixed(2)}`}
          icon={<ArrowUp className="h-5 w-5 text-teal-500" />}
          color="teal"
        />
        <StatCard 
          title="Total Items" 
          value={totalItems.toString()}
          icon={<Package className="h-5 w-5 text-blue-500" />}
          color="blue"
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockItems.length.toString()}
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          color="amber"
          alert={lowStockItems.length > 0}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Inventory Value by Category</h2>
            <div className="text-gray-500">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="h-80">
            <CategoryDistributionChart />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Sales Trend</h2>
            <div className="text-gray-500">
              <LineChart size={20} />
            </div>
          </div>
          <div className="h-80">
            <InventoryValueChart />
          </div>
        </div>
      </div>
      
      {/* Low Stock and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockItems items={lowStockItems} />
        <RecentActivity />
      </div>
    </div>
  );
};

export default DashboardPage;