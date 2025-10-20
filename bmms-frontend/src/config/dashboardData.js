export const initialDashboardData = {
  totalProducts: 0,
  totalOrders: 0,
  lowStockItems: 0,
  recentOrders: [],
  inventoryValue: 0
};

export const mockDashboardData = {
  totalProducts: 150,
  totalOrders: 75,
  lowStockItems: 12,
  recentOrders: [
    { id: 1, customerName: 'John Doe', total: 1500, status: 'Completed', date: '2024-01-15' },
    { id: 2, customerName: 'Jane Smith', total: 2300, status: 'Pending', date: '2024-01-14' },
    { id: 3, customerName: 'Bob Johnson', total: 1800, status: 'Processing', date: '2024-01-13' },
    { id: 4, customerName: 'Alice Brown', total: 3200, status: 'Completed', date: '2024-01-12' },
    { id: 5, customerName: 'Charlie Wilson', total: 950, status: 'Pending', date: '2024-01-11' }
  ],
  inventoryValue: 125000
};

export const mockNotifications = [
  { id: 1, message: 'New order received', type: 'info', timestamp: '2024-01-15T10:30:00' },
  { id: 2, message: 'Low stock alert: Cement', type: 'warning', timestamp: '2024-01-15T09:15:00' },
  { id: 3, message: 'Payment received for Order #1234', type: 'success', timestamp: '2024-01-15T08:45:00' }
];

export const mockUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
};