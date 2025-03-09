# Dynamic Price Comparison System

## Overview
The **Dynamic Price Comparison System** is a web-based application that allows users to compare product prices across multiple online stores in real-time. It helps users find the best deals, tracks price changes, and provides insights into historical price trends.

## Features

### Core Features
- **Store Product Prices**: Store product details like name, brand, category, and prices from multiple online stores.
- **Price Comparison**: Compare prices from multiple stores and display the lowest price.
- **Real-Time Price Tracking**: Continuously monitor and update price changes.
- **Product Availability**: Check and display product availability for each store.
- **Price History**: Visualize price trends over time.
- **Store Filters**: Filter stores based on ratings, delivery times, and other parameters.

### Backend Focus
- **MySQL Database**:
  - Store data on products, stores, prices, and availability.
  - Use complex SQL queries for price comparisons and historical tracking.
- **Stored Procedures & Triggers**:
  - Implement stored procedures for adding and updating prices.
  - Use triggers for automatic price tracking and historical updates.

### Bonus Features
- **Price Prediction**: Predict future price trends using historical data.
- **Notifications**: Send alerts when prices drop below a certain threshold.

## Technology Stack
- **Frontend**: React.js
- **Backend**: Express.js, Node.js
- **Database**: MySQL (using stored procedures and triggers)
- **Authentication**: JWT (JSON Web Tokens)
- **Libraries & Tools**: Zod, Mongoose, and other relevant frameworks

## Database Schema

### **Tables**
- **Products Table**: Stores product details (name, brand, category, description, etc.).
- **Stores Table**: Stores information about online stores (name, URL, ratings, delivery times, etc.).
- **Prices Table**: Tracks product prices for each store and maintains historical price changes.
- **Availability Table**: Stores product availability status across different stores.
- **Price_History Table**: Records past price changes over time for trend analysis.
- **Users Table**: Manages user authentication and preferences.
- **Tracked_Products Table**: Stores products that users want to track for price drops.
- **Notifications Table**: Stores notifications sent to users for price drops.


