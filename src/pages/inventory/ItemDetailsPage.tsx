import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Package, 
  DollarSign, 
  Tag, 
  Truck,
  ShoppingCart
} from 'lucide-react';
import { useInventory, InventoryItem } from '../../contexts/InventoryContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { format, parseISO } from 'date-fns';

const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItem, deleteItem } = useInventory();
  const { addNotification } = useNotifications();
  
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundItem = getItem(id);
      if (foundItem) {
        setItem(foundItem);
      } else {
        addNotification('Item not found', 'error');
        navigate('/inventory');
      }
      setIsLoading(false);
    }
  }, [id, getItem, navigate, addNotification]);
  
  const handleDelete = async () => {
    if (id) {
      try {
        await deleteItem(id);
        addNotification('Item deleted successfully', 'success');
        navigate('/inventory');
      } catch (error) {
        addNotification('Failed to delete item', 'error');
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'PPP');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Item not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The item you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Link
            to="/inventory"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800"
          >
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate profit and margin
  const profit = item.salePrice - item.purchasePrice;
  const profitMargin = (profit / item.purchasePrice) * 100;
  
  const isLowStock = item.quantity <= item.lowStockThreshold;
  const isOutOfStock = item.quantity === 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Item Details</h1>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-end space-x-3">
        <Link
          to={`/inventory/edit/${item.id}`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Edit className="mr-2 h-5 w-5 text-gray-500" />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          <Trash2 className="mr-2 h-5 w-5" />
          Delete
        </button>
      </div>
      
      {/* Item details card */}
      <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {item.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              SKU: {item.sku}
            </p>
          </div>
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {item.category}
          </span>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 bg-gray-50 border-b border-gray-200">
            {/* Stock Status */}
            <div className={`px-4 py-5 sm:px-6 border-b md:border-b-0 md:border-r border-gray-200
              ${isOutOfStock ? 'bg-red-50' : isLowStock ? 'bg-amber-50' : 'bg-green-50'}`}>
              <div className="flex items-center">
                {isOutOfStock ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : isLowStock ? (
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                ) : (
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                )}
                <span className="ml-2 text-sm font-medium text-gray-900">Stock Status</span>
              </div>
              <div className="mt-1">
                <p className={`text-2xl font-bold 
                  ${isOutOfStock ? 'text-red-800' : isLowStock ? 'text-amber-800' : 'text-green-800'}`}>
                  {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                </p>
                <p className="text-sm text-gray-600">
                  {item.quantity} units available
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Low stock threshold: {item.lowStockThreshold}
                </p>
              </div>
            </div>
            
            {/* Purchase Price */}
            <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="ml-2 text-sm font-medium text-gray-900">Purchase Price</span>
              </div>
              <div className="mt-1">
                <p className="text-2xl font-bold text-blue-800">${item.purchasePrice.toFixed(2)}</p>
                <p className="text-sm text-gray-600">
                  Total cost: ${(item.purchasePrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            
            {/* Sale Price */}
            <div className="px-4 py-5 sm:px-6 bg-teal-50">
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-teal-600" />
                <span className="ml-2 text-sm font-medium text-gray-900">Sale Price</span>
              </div>
              <div className="mt-1">
                <p className="text-2xl font-bold text-teal-800">${item.salePrice.toFixed(2)}</p>
                <p className="text-sm text-gray-600">
                  Profit margin: {profitMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Item Image */}
            <div className="md:col-span-1">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-auto rounded-lg object-cover shadow-sm"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Item Details */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900">Description</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {item.description || 'No description provided.'}
                </p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Added On</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(item.dateAdded)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(item.lastUpdated)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">{item.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">SKU</dt>
                    <dd className="mt-1 text-sm text-gray-900">{item.sku}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">Financial Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Cost</p>
                      <p className="text-lg font-medium text-gray-900">
                        ${(item.purchasePrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Potential Revenue</p>
                      <p className="text-lg font-medium text-gray-900">
                        ${(item.salePrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Profit per Unit</p>
                      <p className="text-lg font-medium text-teal-700">
                        ${profit.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Potential Profit</p>
                      <p className="text-lg font-medium text-teal-700">
                        ${(profit * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 z-10">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete {item.name}</h3>
              <p className="text-sm text-gray-500 text-center">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailsPage;