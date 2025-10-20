import React, { useEffect, useState } from 'react';
import { FiDownload, FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import { addNotification } from '../config/mockData';
import { statusClasses } from '../config/orderOptions';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Load orders and suppliers from localStorage and check for new orders
  useEffect(() => {
    const loadData = () => {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const savedSuppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
        
        // Check for new orders (orders from the last 24 hours)
        const recentOrders = savedOrders.filter(order => {
          const orderDate = new Date(order.orderDate);
          const now = new Date();
          const timeDiff = now - orderDate;
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          return hoursDiff <= 24;
        });

        // Create notifications for recent orders
        recentOrders.forEach(order => {
          const supplier = savedSuppliers.find(s => s.id === parseInt(order.supplier));
          addNotification({
            type: 'info',
            message: `New order #${order.orderNumber} received from ${supplier ? supplier.name : 'Unknown Supplier'}`,
          });
        });

        setOrders(savedOrders);
        setSuppliers(savedSuppliers);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load orders');
        setOrders([]);
        setSuppliers([]);
      }
    };

    loadData();
  }, []);

  const getSupplierName = (supplierId) => {
    if (!supplierId) return 'Unknown Supplier';
    const supplier = suppliers.find(s => s.id === parseInt(supplierId));
    return supplier ? supplier.name : 'Unknown Supplier';
  };

  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    const orderNumber = order.orderNumber || '';
    const supplierName = getSupplierName(order.supplier);
    
    const matchesSearch = 
      orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleSelectOrder = (id) => {
    setSelectedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(orderId => orderId !== id) 
        : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        // Get the order to be deleted
        const orderToDelete = orders.find(order => order.id === id);
        
        if (!orderToDelete) {
          throw new Error('Order not found');
        }
        
        // Update product stock
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const updatedProducts = products.map(product => {
          const orderItem = orderToDelete.items?.find(item => item.productId === product.id);
          if (orderItem) {
            return {
              ...product,
              stock: (product.stock || 0) + (orderItem.quantity || 0)
            };
          }
          return product;
        });
        
        // Save updated products
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        
        // Remove order
        const updatedOrders = orders.filter(order => order.id !== id);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
        
        toast.success('Order deleted successfully');
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/orders/edit/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-600">Manage your purchase orders</p>
        </div>
        <Link
          to="/dashboard/orders/new"
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FiPlus className="mr-2" />
          Create New Order
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg border ${activeFilter === 'all' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-2 rounded-lg border ${activeFilter === 'pending' ? 'border-yellow-500 bg-yellow-50 text-yellow-600' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 rounded-lg border ${activeFilter === 'completed' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Completed
            </button>
          </div>
          
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center">
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600"
                    onChange={() => {/* Add select all functionality */}}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded text-blue-600"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelectOrder(order.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber || 'N/A'}</div>
                    <div className="text-sm text-gray-500">
                      Ordered: {formatDate(order.orderDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Expected: {formatDate(order.expectedDeliveryDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getSupplierName(order.supplier)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.items?.length || 0} items</div>
                    <div className="text-sm text-gray-500">
                      {order.items?.map(item => item.productName || 'Unknown Product').join(', ') || 'No items'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[order.status] || statusClasses.pending}`}>
                      {(order.status?.charAt(0).toUpperCase() + order.status?.slice(1)) || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[order.paymentStatus] || statusClasses.pending}`}>
                      {(order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)) || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEdit(order.id)}
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(order.id)}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Orders; 