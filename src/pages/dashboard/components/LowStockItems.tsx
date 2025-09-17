import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { InventoryItem } from '../../../contexts/InventoryContext';

interface LowStockItemsProps {
  items: InventoryItem[];
}

const LowStockItems: React.FC<LowStockItemsProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Low Stock Items</h2>
        <div className="bg-amber-100 text-amber-700 p-2 rounded-full">
          <AlertTriangle size={18} />
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className="p-6 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No low stock items</h3>
          <p className="mt-1 text-sm text-gray-500">
            All your inventory items are above their threshold levels.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
              <Link to={`/inventory/${item.id}`} className="flex items-center justify-between">
                <div className="flex items-center">
                  {item.image ? (
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
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      item.quantity === 0 ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {item.quantity} in stock
                    </p>
                    <p className="text-xs text-gray-500">
                      Threshold: {item.lowStockThreshold}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <Link 
          to="/inventory" 
          className="text-sm font-medium text-blue-700 hover:text-blue-500"
        >
          View all inventory
        </Link>
      </div>
    </div>
  );
};

// Add Package icon within component scope for simpler imports
const Package = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);

export default LowStockItems;