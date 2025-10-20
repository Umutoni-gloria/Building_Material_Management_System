export const statusOptions = [
  'All',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

export const paymentOptions = [
  'All',
  'Paid',
  'Pending',
  'Partial',
  'Refunded'
];

export const statusClasses = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};