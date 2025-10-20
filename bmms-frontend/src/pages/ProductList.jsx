import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import { addNotification } from '../config/mockData';

// Mock Data
const mockProducts = [
  {
    id: 1,
    name: "Portland Cement",
    category: "Cement",
    stock: 150,
    price: 12500,
    supplier: "ABC Suppliers",
    barcode: "PRD001",
    unit: "bags"
  },
  {
    id: 2,
    name: "Steel Rebar 12mm",
    category: "Steel",
    stock: 8,
    price: 45000,
    supplier: "Steel Masters Ltd",
    barcode: "PRD002",
    unit: "pieces"
  },
  {
    id: 3,
    name: "Concrete Blocks",
    category: "Blocks",
    stock: 500,
    price: 2500,
    supplier: "Block Industries",
    barcode: "PRD003",
    unit: "pieces"
  },
  {
    id: 4,
    name: "Paint - White",
    category: "Paint",
    stock: 45,
    price: 35000,
    supplier: "Color World",
    barcode: "PRD004",
    unit: "gallons"
  },
  {
    id: 5,
    name: "Roofing Tiles",
    category: "Roofing",
    stock: 1000,
    price: 3500,
    supplier: "Roof Masters",
    barcode: "PRD005",
    unit: "pieces"
  }
];

const mockCategories = [
  { id: 1, name: "Cement" },
  { id: 2, name: "Steel" },
  { id: 3, name: "Blocks" },
  { id: 4, name: "Paint" },
  { id: 5, name: "Roofing" }
];

const mockSuppliers = [
  { id: 1, name: "ABC Suppliers" },
  { id: 2, name: "Steel Masters Ltd" },
  { id: 3, name: "Block Industries" },
  { id: 4, name: "Color World" },
  { id: 5, name: "Roof Masters" }
];

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const navigate = useNavigate();
  const productsPerPage = 3;

  // Check for low stock items and create notifications
  const checkLowStock = (products) => {
    products.forEach(product => {
      const minStockLevel = product.minStockLevel || 10;
      if (product.stock <= minStockLevel) {
        addNotification({
          type: 'alert',
          message: `Low stock alert: ${product.name} (${product.stock} ${product.unit} remaining)`,
        });
      }
    });
  };

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        setProducts(savedProducts);
        checkLowStock(savedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadProducts();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Get unique categories and suppliers from products
  const categories = [...new Set(products.map(product => product.category))];
  const suppliers = [...new Set(products.map(product => product.supplier))];

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSupplier = !selectedSupplier || product.supplier === selectedSupplier;

    return matchesSearch && matchesCategory && matchesSupplier;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle product deletion
  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSupplier('');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Link
          to="/dashboard/add-product"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedSupplier}
              onChange={(e) => {
                setSelectedSupplier(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Suppliers</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (RWF)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.barcode && (
                            <div className="text-xs text-gray-500">Barcode: {product.barcode}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock < (product.minStockLevel || 10) ? 'bg-red-100 text-red-800' : 
                        product.stock < (product.minStockLevel || 10) * 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.supplier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/dashboard/products/${product.id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm || selectedCategory || selectedSupplier 
                      ? 'No matching products found' 
                      : 'No products available. Add your first product!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredProducts.length}
          itemsPerPage={productsPerPage}
          onPageChange={paginate}
        />
      </div>
    </div>
  );
};

export default ProductList;