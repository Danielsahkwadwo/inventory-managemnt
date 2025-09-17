import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';
import { useNotifications } from '../../contexts/NotificationContext';
import ItemForm, { FormData } from './components/ItemForm';

const EditItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getItem, updateItem } = useInventory();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemData, setItemData] = useState<FormData | null>(null);

  useEffect(() => {
    if (id) {
      const item = getItem(id);
      if (item) {
        setItemData({
          name: item.name,
          category: item.category,
          sku: item.sku,
          purchasePrice: item.purchasePrice,
          salePrice: item.salePrice,
          quantity: item.quantity,
          image: item.image || '',
          lowStockThreshold: item.lowStockThreshold,
          description: item.description || ''
        });
      } else {
        addNotification('Item not found', 'error');
        navigate('/inventory');
      }
      setIsLoading(false);
    }
  }, [id, getItem, navigate, addNotification]);

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await updateItem(id, {
        ...formData,
        quantity: parseInt(formData.quantity.toString()),
        purchasePrice: parseFloat(formData.purchasePrice.toString()),
        salePrice: parseFloat(formData.salePrice.toString()),
        lowStockThreshold: parseInt(formData.lowStockThreshold.toString())
      });
      
      addNotification('Item updated successfully', 'success');
      navigate(`/inventory/${id}`);
    } catch (error) {
      addNotification('Failed to update item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate(`/inventory/${id}`)}
            className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Item</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Update the details of your inventory item.
        </p>
      </div>
      
      {/* Form */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {itemData && (
            <ItemForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              initialData={itemData}
              isEditMode={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditItemPage;