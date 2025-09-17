import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Save, X } from 'lucide-react';
import { useInventory } from '../../../contexts/InventoryContext';

export interface FormData {
  name: string;
  category: string;
  sku: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  image?: string;
  lowStockThreshold: number;
  description?: string;
}

interface ItemFormProps {
  onSubmit: (data: FormData) => void;
  initialData: FormData;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({ 
  onSubmit,
  initialData,
  isSubmitting,
  isEditMode = false
}) => {
  const { categories } = useInventory();
  const [formData, setFormData] = useState<FormData>(initialData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const calculateProfit = () => {
    if (typeof formData.salePrice !== 'number' || typeof formData.purchasePrice !== 'number') {
      return 0;
    }
    return formData.salePrice - formData.purchasePrice;
  };
  
  const calculateProfitMargin = () => {
    if (typeof formData.salePrice !== 'number' || typeof formData.purchasePrice !== 'number' || formData.purchasePrice === 0) {
      return 0;
    }
    return ((formData.salePrice - formData.purchasePrice) / formData.purchasePrice) * 100;
  };

  // Calculate profit and margin
  const profit = calculateProfit();
  const profitMargin = calculateProfitMargin();

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Basic Info Section */}
        <div className="sm:col-span-6">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add the essential details about your item.
          </p>
        </div>

        {/* Item Name */}
        <div className="sm:col-span-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Item Name*
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* SKU */}
        <div className="sm:col-span-2">
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
            SKU*
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="sku"
              id="sku"
              required
              value={formData.sku}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="PROD-001"
            />
          </div>
        </div>

        {/* Category */}
        <div className="sm:col-span-3">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category*
          </label>
          <div className="mt-1">
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div className="sm:col-span-3">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="image"
              id="image"
              value={formData.image || ''}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="sm:col-span-6 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pricing & Inventory</h3>
          <p className="mt-1 text-sm text-gray-500">
            Specify the cost, selling price, and stock quantity.
          </p>
        </div>

        {/* Purchase Price */}
        <div className="sm:col-span-2">
          <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
            Purchase Price*
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="purchasePrice"
              id="purchasePrice"
              required
              min="0"
              step="0.01"
              value={formData.purchasePrice}
              onChange={handleChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Sale Price */}
        <div className="sm:col-span-2">
          <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
            Sale Price*
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="salePrice"
              id="salePrice"
              required
              min="0"
              step="0.01"
              value={formData.salePrice}
              onChange={handleChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Profit Calculator */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Profit
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <div className="border border-gray-300 rounded-md py-2 px-3 bg-gray-50 text-gray-500 flex-1">
              ${profit.toFixed(2)}
            </div>
            <div className="border border-gray-300 rounded-md py-2 px-3 bg-gray-50 text-gray-500 w-24">
              {profitMargin.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="sm:col-span-2">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity*
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="quantity"
              id="quantity"
              required
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="0"
            />
          </div>
        </div>

        {/* Low Stock Threshold */}
        <div className="sm:col-span-2">
          <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
            Low Stock Threshold*
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="lowStockThreshold"
              id="lowStockThreshold"
              required
              min="0"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="5"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            You'll be notified when stock falls below this level.
          </p>
        </div>

        {/* Description */}
        <div className="sm:col-span-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Describe your item..."
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-5 mt-6 border-t border-gray-200">
        <div className="flex justify-end space-x-3">
          <Link
            to="/inventory"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="h-5 w-5 mr-2 -ml-1" />
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2 -ml-1" />
                {isEditMode ? 'Update Item' : 'Save Item'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ItemForm;