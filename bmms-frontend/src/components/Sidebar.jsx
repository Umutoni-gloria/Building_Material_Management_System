// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaPlus, FaShoppingCart, FaChartBar } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">BMMS</h2>
      <nav className="sidebar-nav">
        <Link to="/dashboard/products" className="sidebar-link">
          <FaBoxOpen className="sidebar-icon" /> Product List
        </Link>
        <Link to="/dashboard/add-product" className="sidebar-link">
          <FaPlus className="sidebar-icon" /> Add Product
        </Link>
        <Link to="/dashboard/purchases" className="sidebar-link">
          <FaShoppingCart className="sidebar-icon" /> Purchase List
        </Link>
        <Link to="/dashboard/reports" className="sidebar-link">
          <FaChartBar className="sidebar-icon" /> Reports
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
