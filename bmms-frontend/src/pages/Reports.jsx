import React, { useEffect, useState } from 'react';
import { FiBarChart2, FiDownload, FiPieChart, FiTrendingUp } from 'react-icons/fi';

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const savedSuppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
        
        setOrders(savedOrders);
        setProducts(savedProducts);
        setSuppliers(savedSuppliers);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getDateRangeStart = () => {
    const now = new Date();
    switch (dateRange) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(0);
    }
  };

  const filterOrdersByDate = (ordersToFilter) => {
    const startDate = getDateRangeStart();
    return ordersToFilter.filter(order => new Date(order.orderDate) >= startDate);
  };

  const calculateOverviewStats = () => {
    const filteredOrders = filterOrdersByDate(orders);
    
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
    const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
    
    const lowStockProducts = products.filter(product => (product.stock || 0) <= (product.minStock || 5)).length;
    const activeSuppliers = suppliers.filter(supplier => supplier.status === 'active').length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      lowStockProducts,
      activeSuppliers
    };
  };

  const calculateProductStats = () => {
    const filteredOrders = filterOrdersByDate(orders);
    const productStats = {};

    // Initialize product stats
    products.forEach(product => {
      productStats[product.id] = {
        name: product.name,
        totalOrdered: 0,
        revenue: 0,
        currentStock: product.stock || 0
      };
    });

    // Calculate stats from orders
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        if (productStats[item.productId]) {
          productStats[item.productId].totalOrdered += item.quantity || 0;
          productStats[item.productId].revenue += (item.quantity || 0) * (item.price || 0);
        }
      });
    });

    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  const calculateSupplierStats = () => {
    const filteredOrders = filterOrdersByDate(orders);
    const supplierStats = {};

    // Initialize supplier stats
    suppliers.forEach(supplier => {
      supplierStats[supplier.id] = {
        name: supplier.name,
        totalOrders: 0,
        totalSpent: 0,
        status: supplier.status
      };
    });

    // Calculate stats from orders
    filteredOrders.forEach(order => {
      if (supplierStats[order.supplier]) {
        supplierStats[order.supplier].totalOrders += 1;
        supplierStats[order.supplier].totalSpent += order.totalAmount || 0;
      }
    });

    return Object.values(supplierStats)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleExport = () => {
    let reportData;
    let filename;

    switch (selectedReport) {
      case 'overview':
        reportData = calculateOverviewStats();
        filename = 'overview-report';
        break;
      case 'products':
        reportData = calculateProductStats();
        filename = 'product-report';
        break;
      case 'suppliers':
        reportData = calculateSupplierStats();
        filename = 'supplier-report';
        break;
      default:
        return;
    }

    const csvContent = convertToCSV(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]).map(key => key.replace(/([A-Z])/g, ' $1').trim());
    const rows = data.map(obj => Object.values(obj));
    
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
        <p className="text-gray-600 mb-4">Here's what's happening with your building materials today.</p>
        <div className="border-b border-gray-200 mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-800">Reports & Analytics</h2>
        <p className="text-gray-600">View and analyze your business data</p>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="overview">Overview Report</option>
            <option value="products">Product Analysis</option>
            <option value="suppliers">Supplier Analysis</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiDownload className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-6">
        {selectedReport === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overview Cards */}
            {Object.entries(calculateOverviewStats()).map(([key, value]) => (
              <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {key.includes('Revenue') ? formatCurrency(value) : value}
                    </h3>
                  </div>
                  {key.includes('Orders') && <FiBarChart2 className="h-8 w-8 text-blue-500" />}
                  {key.includes('Revenue') && <FiTrendingUp className="h-8 w-8 text-green-500" />}
                  {key.includes('Products') && <FiPieChart className="h-8 w-8 text-yellow-500" />}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedReport === 'products' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ordered</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {calculateProductStats().map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.totalOrdered}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.currentStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'suppliers' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {calculateSupplierStats().map((supplier, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(supplier.totalSpent)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        supplier.status === 'active' ? 'bg-green-100 text-green-800' :
                        supplier.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {supplier.status?.charAt(0).toUpperCase() + supplier.status?.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;