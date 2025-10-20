Building Materials Management System (BMMS)
<div align="center">
https://Dashboard.png

A comprehensive web application for managing building materials inventory, orders, and suppliers with enhanced security features.

https://img.shields.io/badge/React-18.2+-61DAFB?logo=react&logoColor=white
https://img.shields.io/badge/Spring%2520Boot-3.2+-6DB33F?logo=springboot&logoColor=white
https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql&logoColor=white
https://img.shields.io/badge/Tailwind%2520CSS-3.3+-06B6D4?logo=tailwindcss&logoColor=white

</div>
📋 Table of Contents
Overview

Features

Technology Stack

Screenshots

Installation

API Endpoints

Database Schema

Contributing

🎯 Overview
The Building Materials Management System (BMMS) is a secure and efficient web application designed specifically for construction material businesses. It streamlines inventory management, order processing, and supplier relationships while ensuring data security through modern authentication mechanisms.

✨ Features
🔐 Security & Authentication
JWT-based Authentication with secure token management

Two-Factor Authentication (2FA) via email verification

Role-Based Access Control (Admin & User roles)

Secure Password Reset functionality

Encrypted credential storage

📊 Core Management Modules
Dashboard - Real-time business insights and metrics

Product Management - Complete inventory control

Order Processing - End-to-end order lifecycle management

Supplier Management - Vendor relationship tracking

Inventory Tracking - Stock level monitoring with alerts

Reporting System - Comprehensive business analytics

🎨 User Experience
Modern Responsive UI built with Tailwind CSS

Global Search across all entities

Data Pagination for large datasets

Real-time Notifications

Interactive Data Visualizations

🛠 Technology Stack
Frontend
React 18 - UI library

Tailwind CSS - Styling framework

React Router - Navigation

Axios - HTTP client

React Toastify - Notifications

Backend
Spring Boot 3.2 - Application framework

Spring Security - Authentication & Authorization

JWT - Token-based authentication

PostgreSQL - Database

Maven - Build tool

Java 21 - Runtime environment

Security
JWT Token Authentication

Two-Factor Authentication

BCrypt Password Encryption

Role-based Access Control

Secure API Endpoints

📸 Screenshots
Authentication Flow
<div align="center">
Login Screen	Two-Factor Authentication	Password Reset
https://login.png	https://2FA.png	https://Rest%2520password.png
</div>
Application Interface
<div align="center">
Dashboard	Products Management	Orders Management
https://Dashboard.png	https://product.png	https://order.png
User Registration	Set New Password
https://SignUp.png	https://set%2520new%2520password.png
</div>
🚀 Installation
Prerequisites
Node.js (v18 or higher)

Java JDK 21

PostgreSQL 16+

Maven 3.6+

Frontend Setup
bash
# Clone the repository
git clone <repository-url>
cd BMMS-FRONTEND

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
Backend Setup
bash
cd BMMS-BACKEND

# Configure application.properties
# Update database connection details in src/main/resources/application.properties

# Build the application
mvn clean install

# Run the application
mvn spring-boot:run
Database Configuration
Create a PostgreSQL database named bmms_db

Update the connection details in application.properties:

properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bmms_db
spring.datasource.username=your_username
spring.datasource.password=your_password
📡 API Endpoints
Authentication
POST /api/auth/login - User login

POST /api/auth/register - User registration

POST /api/auth/verify-2fa - Two-factor authentication

POST /api/auth/forgot-password - Password reset request

POST /api/auth/reset-password - Password reset

Products
GET /api/products - Get all products

POST /api/products - Create new product

PUT /api/products/{id} - Update product

DELETE /api/products/{id} - Delete product

Orders
GET /api/orders - Get all orders

POST /api/orders - Create new order

GET /api/orders/{id} - Get order details

PUT /api/orders/{id} - Update order status

Suppliers
GET /api/suppliers - Get all suppliers

POST /api/suppliers - Create new supplier

PUT /api/suppliers/{id} - Update supplier

🗃 Database Schema
The system manages the following core entities:

Users - User authentication and profiles

Products - Inventory items with categories

Suppliers - Vendor information

Orders - Purchase orders

Order Details - Order line items

Stock - Inventory levels

Customers - Client information

Categories - Product classification

🤝 Contributing
We welcome contributions to the Building Materials Management System! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📞 Support
For support and questions:

Create an issue in the repository

Contact the development team

Check the project documentation

<div align="center">
Built with ❤️ using Spring Boot, React, and PostgreSQL

© 2024 Building Materials Management System. All rights reserved.

</div>
