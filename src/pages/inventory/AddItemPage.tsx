import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';
import { useNotifications } from '../../contexts/NotificationContext';
import ItemForm, { FormData } from './components/ItemForm';

const AddItemPage: React.FC = () => {
  const { addItem } = useInventory();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await addItem({
        ...formData,
        quantity: parseInt(formData.quantity.toString()),
        purchasePrice: parseFloat(formData.purchasePrice.toString()),
        salePrice: parseFloat(formData.salePrice.toString()),
        lowStockThreshold: parseInt(formData.lowStockThreshold.toString())
      });
      
      addNotification('Item added successfully', 'success');
      navigate('/inventory');
    } catch (error) {
      addNotification('Failed to add item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Add a new item to your inventory with all necessary details.
        </p>
      </div>
      
      {/* Form */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <ItemForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialData={{
              name: '',
              category: '',
              sku: '',
              purchasePrice: 0,
              salePrice: 0,
              quantity: 0,
              lowStockThreshold: 5,
              image: '',
              description: ''
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddItemPage;