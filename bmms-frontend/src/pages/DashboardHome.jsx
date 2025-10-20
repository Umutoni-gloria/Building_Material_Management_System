import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashboardHome = () => {
  const { dashboardData, user } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get real data from localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');

        // Calculate real stats with proper price handling
        const totalProducts = products.length;
        
        // Debug log for product prices and stock
        console.log('Products data:', products.map(p => ({
          name: p.name,
          price: p.price,
          stock: p.stock,
          total: p.price * p.stock
        })));

        const inventoryValue = products.reduce((sum, product) => {
          // Convert price string to number and handle any currency symbols
          const priceStr = String(product.price || '0').replace(/[^0-9.-]+/g, '');
          const price = parseFloat(priceStr) || 0;
          const stock = parseInt(product.stock) || 0;
          
          // Debug log for each calculation
          console.log(`Product: ${product.name}, Price: ${price}, Stock: ${stock}, Subtotal: ${price * stock}`);
          
          // If price seems too high (over 1000), assume it needs to be adjusted
          const adjustedPrice = price > 1000 ? price / 100 : price;
          const subtotal = adjustedPrice * stock;
          
          return sum + subtotal;
        }, 0);

        // Debug log final value
        console.log('Final inventory value:', inventoryValue);

        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const lowStockItems = products.filter(product => (product.stock || 0) <= (product.minStock || 5)).length;
        
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        
        const currentMonthOrders = orders.filter(order => new Date(order.orderDate) >= lastMonthDate);
        const lastMonthOrders = orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= new Date(lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)) &&
                 orderDate < lastMonthDate;
        });

        const currentMonthValue = currentMonthOrders.reduce((sum, order) => {
          const amount = parseFloat(order.totalAmount) || 0;
          return sum + amount;
        }, 0);
        const lastMonthValue = lastMonthOrders.reduce((sum, order) => {
          const amount = parseFloat(order.totalAmount) || 0;
          return sum + amount;
        }, 0);
        const valueChange = lastMonthValue ? ((currentMonthValue - lastMonthValue) / lastMonthValue * 100).toFixed(1) : '+0';
        
        const calculatedStats = [
          { 
            name: 'Total Products', 
            value: totalProducts.toLocaleString(),
            change: `${products.length > 0 ? '+' : ''}${products.length}`, 
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' 
          },
          { 
            name: 'Inventory Value', 
            value: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(inventoryValue),
            change: `${valueChange}%`,
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
          },
          { 
            name: 'Pending Orders', 
            value: pendingOrders.toString(),
            change: `${pendingOrders > 0 ? '+' : ''}${pendingOrders}`,
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' 
          },
          { 
            name: 'Low Stock Items', 
            value: lowStockItems.toString(),
            change: `${lowStockItems > 0 ? '+' : ''}${lowStockItems}`,
            icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' 
          },
        ];

        // Get recent activities from orders
        const recentActivities = orders
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .slice(0, 5)
          .map(order => ({
            id: order.id,
            user: order.supplier ? suppliers.find(s => s.id === parseInt(order.supplier))?.name || 'Unknown Supplier' : 'System User',
            action: `${order.status} order for`,
            item: `$${order.totalAmount?.toLocaleString() || '0'}`,
            time: formatTimeAgo(new Date(order.orderDate))
          }));

        // Get real stock alerts
        const stockAlertsList = products
          .filter(product => (product.stock || 0) <= (product.minStock || 5))
          .map(product => ({
            id: product.id,
            product: product.name,
            currentStock: product.stock || 0,
            threshold: product.minStock || 5,
            status: product.stock <= (product.minStock * 0.5) ? 'Critical' : 'Low'
          }))
          .sort((a, b) => a.currentStock - b.currentStock);

        setStats(calculatedStats);
        setActivities(recentActivities);
        setStockAlerts(stockAlertsList);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleQuickAction = (action) => {
    try {
      switch(action) {
        case 'add':
          navigate('/dashboard/products/new');
          break;
        case 'order':
          navigate('/dashboard/orders/new');
          break;
        case 'report':
          navigate('/dashboard/reports');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate to the selected action');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your building materials today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`mt-1 text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {activity.user.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user} <span className="text-gray-500 font-normal">{activity.action}</span> {activity.item}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activities found</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => handleQuickAction('add')}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <span>Add New Product</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button 
              onClick={() => handleQuickAction('order')}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <span>Create Purchase Order</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button 
              onClick={() => handleQuickAction('report')}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <span>Generate Report</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Alerts</h3>
          <div className="overflow-x-auto">
            {stockAlerts.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/dashboard/products/${alert.id}`)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.currentStock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.threshold}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          alert.status === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No stock alerts found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;