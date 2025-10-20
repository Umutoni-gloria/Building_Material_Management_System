import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddOrder = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    { productId: '', quantity: 1, price: 0 }
  ]);
  
  const [formData, setFormData] = useState({
    orderNumber: `ORD${Date.now()}`,
    supplier: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    status: 'pending',
    paymentStatus: 'pending',
    notes: ''
  });

  // Load suppliers and products from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedSuppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
        const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        setSuppliers(savedSuppliers);
        setProducts(savedProducts);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load suppliers and products');
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    
    // Update price if product is selected
    if (field === 'productId') {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        updatedProducts[index].price = product.price;
      }
    }
    
    setSelectedProducts(updatedProducts);
  };

  const addProductRow = () => {
    setSelectedProducts([...selectedProducts, { productId: '', quantity: 1, price: 0 }]);
  };

  const removeProductRow = (index) => {
    if (selectedProducts.length > 1) {
      const updatedProducts = selectedProducts.filter((_, i) => i !== index);
      setSelectedProducts(updatedProducts);
    }
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      const product = products.find(p => p.id === parseInt(item.productId));
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.supplier || !formData.orderDate || !formData.expectedDeliveryDate) {
        throw new Error('Please fill in all required fields');
      }

      if (!selectedProducts[0].productId) {
        throw new Error('Please select at least one product');
      }

      // Create new order object
      const newOrder = {
        id: Date.now(),
        ...formData,
        items: selectedProducts.map(item => {
          const product = products.find(p => p.id === parseInt(item.productId));
          return {
            productId: parseInt(item.productId),
            productName: product?.name || '',
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            total: item.quantity * item.price
          };
        }),
        totalAmount: calculateTotal(),
        createdAt: new Date().toISOString()
      };

      // Get existing orders from localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Add new order to the list
      const updatedOrders = [newOrder, ...existingOrders];
      
      // Save to localStorage
      localStorage.setItem('orders', JSON.stringify(updatedOrders));

      // Update product stock
      const updatedProducts = products.map(product => {
        const orderItem = selectedProducts.find(item => parseInt(item.productId) === product.id);
        if (orderItem) {
          return {
            ...product,
            stock: product.stock - parseInt(orderItem.quantity)
          };
        }
        return product;
      });

      localStorage.setItem('products', JSON.stringify(updatedProducts));

      toast.success('Order created successfully!');
      navigate('/dashboard/orders');
    } catch (error) {
      toast.error(error.message || 'Failed to create order');
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Order</h1>
        <p className="text-gray-600">Create a new purchase order for building materials</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Number
            </label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier <span className="text-red-500">*</span>
            </label>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Delivery Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="expectedDeliveryDate"
              value={formData.expectedDeliveryDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {selectedProducts.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <select
                    value={item.productId}
                    onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price} ({product.stock} in stock)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                    min="1"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Qty"
                  />
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Price"
                    readOnly
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeProductRow(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addProductRow}
            className="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            Add Product
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any additional notes..."
          ></textarea>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-lg font-semibold">
            Total Amount: ${calculateTotal().toFixed(2)}
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/orders')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddOrder; 