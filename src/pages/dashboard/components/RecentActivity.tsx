import React from 'react';
import { Clock, Package } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Mock activity data
const activities = [
  { 
    id: 'act-1', 
    type: 'add', 
    itemName: 'Smartphone', 
    quantity: 5, 
    timestamp: '2024-07-01T10:30:00Z',
    user: 'John Doe'
  },
  { 
    id: 'act-2', 
    type: 'sale', 
    itemName: 'Laptop', 
    quantity: 2, 
    timestamp: '2024-07-01T09:15:00Z',
    user: 'John Doe'
  },
  { 
    id: 'act-3', 
    type: 'update', 
    itemName: 'T-Shirt', 
    details: 'Price updated from $15.99 to $19.99', 
    timestamp: '2024-06-30T16:45:00Z',
    user: 'John Doe'
  },
  { 
    id: 'act-4', 
    type: 'remove', 
    itemName: 'Headphones (Old Model)', 
    timestamp: '2024-06-30T14:20:00Z',
    user: 'John Doe'
  },
  { 
    id: 'act-5', 
    type: 'add', 
    itemName: 'Rice (5kg)', 
    quantity: 15, 
    timestamp: '2024-06-29T11:10:00Z',
    user: 'John Doe'
  },
];

const RecentActivity: React.FC = () => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'add':
        return <span className="bg-green-100 text-green-700 p-2 rounded-full">+</span>;
      case 'sale':
        return <span className="bg-blue-100 text-blue-700 p-2 rounded-full">$</span>;
      case 'update':
        return <span className="bg-amber-100 text-amber-700 p-2 rounded-full">↻</span>;
      case 'remove':
        return <span className="bg-rose-100 text-rose-700 p-2 rounded-full">−</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 p-2 rounded-full">•</span>;
    }
  };

  const getActivityText = (activity: typeof activities[0]) => {
    switch (activity.type) {
      case 'add':
        return `Added ${activity.quantity} new ${activity.itemName} to inventory`;
      case 'sale':
        return `Sold ${activity.quantity} ${activity.itemName}`;
      case 'update':
        return `Updated ${activity.itemName}: ${activity.details}`;
      case 'remove':
        return `Removed ${activity.itemName} from inventory`;
      default:
        return `Action performed on ${activity.itemName}`;
    }
  };

  const formatActivityTime = (timestamp: string) => {
    const date = parseISO(timestamp);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                   date.getMonth() === now.getMonth() && 
                   date.getFullYear() === now.getFullYear();
    
    return isToday 
      ? `Today at ${format(date, 'h:mm a')}` 
      : format(date, 'MMM d, h:mm a');
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
          <Clock size={18} />
        </div>
      </div>
      
      {activities.length === 0 ? (
        <div className="p-6 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start managing your inventory to see activity here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <li key={activity.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {getActivityText(activity)}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <span>{formatActivityTime(activity.timestamp)}</span>
                    <span className="mx-1">•</span>
                    <span>{activity.user}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <button 
          type="button"
          className="text-sm font-medium text-blue-700 hover:text-blue-500"
        >
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;