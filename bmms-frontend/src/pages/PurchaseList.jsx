import React, { useEffect, useState } from 'react';
import { FiDownload, FiEdit, FiEye, FiFilter, FiPrinter, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { paymentOptions, statusOptions } from '../config/orderOptions';
import API from "./API";

const PurchaseList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  const [filters, setFilters] = useState({
    status: '',
    supplier: '',
    payment: '',
    dateRange: ''
  });
  
  const purchasesPerPage = 8;

  // Fetch purchases and suppliers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch purchases
        const purchasesResponse = await API.orders.getAll();
        const formattedPurchases = purchasesResponse.data.map(purchase => ({
          id: purchase.orderNumber,
          supplier: purchase.supplier?.name || 'Unknown Supplier',
          date: purchase.orderDate,
          items: purchase.items?.length || 0,
          amount: purchase.totalAmount || 0,
          status: purchase.status || 'Processing',
          payment: purchase.paymentStatus || 'Pending',
          deliveryDate: purchase.deliveryDate || 'N/A'
        }));
        setPurchases(formattedPurchases);

        // Fetch suppliers for filter dropdown
        const suppliersResponse = await API.suppliers.getAll();
        setSuppliers(suppliersResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch purchases');
        console.error('Error fetching purchases:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter purchases based on search term and filters
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = Object.values(purchase).some(
      value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = !filters.status || purchase.status === filters.status;
    const matchesSupplier = !filters.supplier || purchase.supplier === filters.supplier;
    const matchesPayment = !filters.payment || purchase.payment === filters.payment;
    
    return matchesSearch && matchesStatus && matchesSupplier && matchesPayment;
  });

  // Pagination logic
  const indexOfLastPurchase = currentPage * purchasesPerPage;
  const indexOfFirstPurchase = indexOfLastPurchase - purchasesPerPage;
  const currentPurchases = filteredPurchases.slice(indexOfFirstPurchase, indexOfLastPurchase);
  const totalPages = Math.ceil(filteredPurchases.length / purchasesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value === 'All' ? '' : value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      supplier: '',
      payment: '',
      dateRange: ''
    });
    setCurrentPage(1);
  };

  const handleDeletePurchase = async (purchaseId) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await API.orders.delete(purchaseId);
        setPurchases(purchases.filter(p => p.id !== purchaseId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete purchase');
        console.error('Error deleting purchase:', err);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Shipped': 'bg-blue-100 text-blue-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const getPaymentBadge = (payment) => {
    const paymentClasses = {
      'Paid': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Partial': 'bg-blue-100 text-blue-800',
      'Refunded': 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${paymentClasses[payment]}`}>
        {payment}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading purchases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Purchase Orders</h1>
        <div className="flex space-x-3">
          <Link
            to="/dashboard/purchases/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiEdit className="mr-2" />
            Create Purchase
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search purchases..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="absolute right-3 top-2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border flex items-center ${showFilters ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
          
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center">
            <FiDownload className="mr-2" />
            Export
          </button>
          
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center">
            <FiPrinter className="mr-2" />
            Print
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status || 'All'}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select
                  name="supplier"
                  value={filters.supplier || 'All'}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                <select
                  name="payment"
                  value={filters.payment || 'All'}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {paymentOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Purchases Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (RWF)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPurchases.length > 0 ? (
                currentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link to={`/dashboard/purchases/${purchase.id}`} className="hover:underline">
                        {purchase.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.supplier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(purchase.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.items}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(purchase.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentBadge(purchase.payment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link 
                          to={`/dashboard/purchases/${purchase.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/dashboard/purchases/${purchase.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <FiEdit className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => handleDeletePurchase(purchase.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No purchases found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPurchases.length > purchasesPerPage && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstPurchase + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastPurchase, filteredPurchases.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredPurchases.length}</span> purchases
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">First</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Last</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseList;