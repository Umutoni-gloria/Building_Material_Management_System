// Mock user data
export const mockUser = {
  id: null,
  name: "",
  email: "",
  role: "",
  avatar: null,
  lastLogin: new Date().toISOString()
};

// Function to get user data from localStorage
export const getUserData = () => {
  try {
    return JSON.parse(localStorage.getItem('userData')) || mockUser;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return mockUser;
  }
};

// Mock notifications
export const mockNotifications = [
  {
    id: 1,
    type: "alert",
    message: "Low stock alert: Portland Cement",
    timestamp: "2024-03-20T09:00:00Z",
    read: false
  },
  {
    id: 2,
    type: "info",
    message: "New order #ORD-2024-001 received",
    timestamp: "2024-03-20T08:45:00Z",
    read: false
  },
  {
    id: 3,
    type: "success",
    message: "Payment received for Invoice #INV-2024-015",
    timestamp: "2024-03-20T08:30:00Z",
    read: false
  }
];

// Mock dashboard statistics
export const mockDashboardStats = {
  totalProducts: 156,
  lowStockItems: 12,
  pendingOrders: 8,
  monthlyRevenue: 45780.50,
  recentTransactions: [
    {
      id: "TRX-001",
      date: "2024-03-20",
      amount: 1250.00,
      type: "purchase",
      status: "completed"
    },
    {
      id: "TRX-002",
      date: "2024-03-19",
      amount: 3400.75,
      type: "sale",
      status: "pending"
    }
  ],
  stockAlerts: [
    {
      productId: "PRD-001",
      name: "Portland Cement",
      currentStock: 50,
      minRequired: 100
    },
    {
      productId: "PRD-002",
      name: "Steel Rebar",
      currentStock: 75,
      minRequired: 150
    }
  ]
};

// Mock products data
export const mockProducts = [
  {
    id: "PRD-001",
    name: "Portland Cement",
    category: "Cement",
    price: 12.99,
    stock: 50,
    supplier: "ABC Suppliers",
    lastUpdated: "2024-03-20T08:00:00Z"
  },
  {
    id: "PRD-002",
    name: "Steel Rebar",
    category: "Steel",
    price: 45.50,
    stock: 75,
    supplier: "Steel Corp Inc",
    lastUpdated: "2024-03-19T15:30:00Z"
  },
  {
    id: "PRD-003",
    name: "Concrete Blocks",
    category: "Blocks",
    price: 3.25,
    stock: 500,
    supplier: "Block Masters Ltd",
    lastUpdated: "2024-03-18T11:20:00Z"
  }
];

// Mock suppliers data
export const mockSuppliers = [
  {
    id: "SUP-001",
    name: "ABC Suppliers",
    contact: "John Smith",
    email: "john@abcsuppliers.com",
    phone: "+1-234-567-8900",
    address: "123 Supply Street, Business District",
    activeOrders: 2
  },
  {
    id: "SUP-002",
    name: "Steel Corp Inc",
    contact: "Sarah Johnson",
    email: "sarah@steelcorp.com",
    phone: "+1-234-567-8901",
    address: "456 Metal Road, Industrial Zone",
    activeOrders: 1
  }
];

// Mock orders data
export const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-03-20T09:00:00Z",
    customer: "XYZ Construction",
    items: [
      { productId: "PRD-001", quantity: 100, price: 12.99 },
      { productId: "PRD-002", quantity: 50, price: 45.50 }
    ],
    total: 3549.00,
    status: "pending"
  },
  {
    id: "ORD-2024-002",
    date: "2024-03-19T14:30:00Z",
    customer: "BuildRight Contractors",
    items: [
      { productId: "PRD-003", quantity: 200, price: 3.25 }
    ],
    total: 650.00,
    status: "completed"
  }
];

// Helper function to simulate API delay
export const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Sample orders data
const sampleOrders = [
  {
    id: 1001,
    date: '2024-02-15',
    status: 'Pending',
    customer: 'John Doe',
    total: 25000,
    items: [
      { productId: 1, quantity: 10, price: 1500 },
      { productId: 2, quantity: 5, price: 2000 }
    ]
  },
  {
    id: 1002,
    date: '2024-02-14',
    status: 'Processing',
    customer: 'Jane Smith',
    total: 35000,
    items: [
      { productId: 3, quantity: 20, price: 1750 }
    ]
  },
  {
    id: 1003,
    date: '2024-02-13',
    status: 'Completed',
    customer: 'Bob Wilson',
    total: 15000,
    items: [
      { productId: 4, quantity: 3, price: 5000 }
    ]
  }
];

// Initialize orders in localStorage if not present
if (!localStorage.getItem('orders')) {
  localStorage.setItem('orders', JSON.stringify(sampleOrders));
}

// Function to get notifications from localStorage
const getStoredNotifications = () => {
  try {
    return JSON.parse(localStorage.getItem('notifications') || '[]');
  } catch (error) {
    console.error('Error parsing notifications:', error);
    return [];
  }
};

// Function to store notifications
const storeNotifications = (notifications) => {
  localStorage.setItem('notifications', JSON.stringify(notifications));
};

// Function to add a new notification
export const addNotification = (notification) => {
  const notifications = getStoredNotifications();
  const newNotification = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
    ...notification
  };
  notifications.unshift(newNotification);
  storeNotifications(notifications);
  return newNotification;
};

// Mock API service
export const mockApiService = {
  getDashboardStats: () => simulateApiCall(mockDashboardStats),
  getProducts: () => simulateApiCall(mockProducts),
  getSuppliers: () => simulateApiCall(mockSuppliers),
  getOrders: () => simulateApiCall(mockOrders),
  getNotifications: () => {
    return Promise.resolve(getStoredNotifications());
  },
  getUserProfile: async () => {
    return getUserData();
  },
  
  // Simulate updating notification status
  markNotificationAsRead: (id) => {
    const notifications = getStoredNotifications();
    const updatedNotifications = notifications.filter(n => n.id !== id);
    storeNotifications(updatedNotifications);
    return Promise.resolve({ success: true });
  },

  // Simulate creating a new order
  createOrder: (orderData) => 
    simulateApiCall({ 
      success: true, 
      message: "Order created successfully",
      orderId: `ORD-2024-${Math.floor(Math.random() * 1000)}`
    }),

  // Simulate updating product stock
  updateProductStock: (productId, quantity) =>
    simulateApiCall({
      success: true,
      message: "Stock updated successfully",
      newStock: quantity
    })
};

// Initialize notifications if not present
if (!localStorage.getItem('notifications')) {
  storeNotifications([]);
} 