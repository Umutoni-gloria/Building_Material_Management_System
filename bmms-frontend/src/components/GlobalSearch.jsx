import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleResultClick(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // Debounced search function
  const performSearch = debounce(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchTermLower = term.toLowerCase();
      
      // Get data from localStorage
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
      
      // Search in products
      const productResults = products.filter(product => 
        product.name?.toLowerCase().includes(searchTermLower) ||
        product.category?.toLowerCase().includes(searchTermLower) ||
        product.barcode?.toLowerCase().includes(searchTermLower) ||
        product.supplier?.toLowerCase().includes(searchTermLower)
      ).map(product => ({
        type: 'product',
        id: product.id,
        title: product.name,
        subtitle: `${product.category} - ${product.stock} ${product.unit || 'units'}`,
        link: `/dashboard/products/${product.id}`
      }));

      // Search in orders
      const orderResults = orders.filter(order =>
        order.orderNumber?.toString().toLowerCase().includes(searchTermLower) ||
        order.status?.toLowerCase().includes(searchTermLower) ||
        order.supplier?.toLowerCase().includes(searchTermLower)
      ).map(order => ({
        type: 'order',
        id: order.id,
        title: `Order #${order.orderNumber || order.id}`,
        subtitle: `Status: ${order.status || 'N/A'} - ${order.supplier || 'Unknown Supplier'}`,
        link: `/dashboard/orders/edit/${order.id}`
      }));

      // Search in suppliers
      const supplierResults = suppliers.filter(supplier =>
        supplier.name?.toLowerCase().includes(searchTermLower) ||
        supplier.email?.toLowerCase().includes(searchTermLower) ||
        supplier.phone?.includes(searchTermLower) ||
        supplier.contact?.toLowerCase().includes(searchTermLower)
      ).map(supplier => ({
        type: 'supplier',
        id: supplier.id,
        title: supplier.name,
        subtitle: `${supplier.contact || 'No contact'} - ${supplier.email || 'No email'}`,
        link: `/dashboard/suppliers/edit/${supplier.id}`
      }));

      // Combine and sort results
      const combinedResults = [...productResults, ...orderResults, ...supplierResults]
        .sort((a, b) => {
          // Sort by relevance (exact matches first)
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const exactMatchA = aTitle === searchTermLower;
          const exactMatchB = bTitle === searchTermLower;
          
          if (exactMatchA && !exactMatchB) return -1;
          if (!exactMatchA && exactMatchB) return 1;
          
          // Then sort by starts with
          const startsWithA = aTitle.startsWith(searchTermLower);
          const startsWithB = bTitle.startsWith(searchTermLower);
          
          if (startsWithA && !startsWithB) return -1;
          if (!startsWithA && startsWithB) return 1;
          
          return 0;
        })
        .slice(0, 8);

      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(true);
    performSearch(value);
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchTerm('');
    setSelectedIndex(-1);
    navigate(result.link);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'product':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'order':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'supplier':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          placeholder="Search products, orders, suppliers..."
          className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (searchResults.length > 0 || isLoading || searchTerm) && (
        <div className="absolute mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <svg className="animate-spin h-5 w-5 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center ${
                    index === selectedIndex ? 'bg-gray-50' : ''
                  } ${index !== searchResults.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex-shrink-0 text-gray-400 mr-3">
                    {getResultIcon(result.type)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {result.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {result.subtitle}
                    </div>
                  </div>
                  <div className="ml-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      result.type === 'product' 
                        ? 'bg-blue-100 text-blue-800'
                        : result.type === 'order'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {result.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch; 