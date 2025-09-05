# Advanced React E-Commerce Web App

This project is a fully-featured e-commerce web application built with **React** and **TypeScript**, leveraging **Redux Toolkit** for state management and **React Query** for efficient data fetching. It connects to the [FakeStoreAPI](https://fakestoreapi.com/) to simulate real-world product and category data, demonstrating advanced front-end development patterns.

## 🚀 Technologies Used

- **React** - Fast, component-based UI
- **TypeScript** - Type safety throughout the codebase
- **Redux Toolkit** - Centralized state management for the shopping cart
- **React Query** - Asynchronous data fetching, caching, and error handling
- **Bootstrap** - Responsive and clean layout
- **FakeStoreAPI** - Mock product and category data

## 🛒 Features

- **Product Catalog**
  - Displays all products with title, price, category, description, rating, and image.
  - Handles image errors gracefully with placeholder images.
  - Pagination for browsing large product lists.
- **Category Navigation**
  - Dynamic category dropdown fetched from the API.
  - Instantly filters products by selected category.
- **Shopping Cart**
  - Add products to cart directly from the catalog.
  - View and manage cart items (update quantity, remove items).
  - Live cart item count in the navbar.
  - Cart persists across sessions using `sessionStorage`.
  - Dynamic calculation of total items and total price.
- **Checkout Simulation**
  - Simulate checkout by clearing cart and session.
  - Visual feedback on successful checkout.
- **Robust Error Handling**
  - Loading and error states for all API calls.
  - Fallback images for broken product image URLs.

## 📦 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/resenaros/advanced-ecommerce-app.git
   cd advanced-ecommerce-app
   ```

2. **Install dependencies**

   ```bash
   npm install
 
3. **Run the development server**

   ```bash
   npm run dev


## 📁 Project Structure

- `src/store.ts` - Redux store setup
- `src/features/cart/cartslice.ts` - Redux Toolkit cart slice
- `src/api/products.ts` - React Query hooks for products and categories
- `src/components/ProductCard.tsx` - Product display card
- `src/components/CartItem.tsx` - Individual cart item component
- `src/components/CategorySelect.tsx` - Category dropdown
- `src/components/Navbar.tsx` - Navigation bar
- `src/pages/Home.tsx` - Product catalog page
- `src/pages/Cart.tsx` - Shopping cart page
- `src/App.tsx` - App entry point and routing
- `src/main.tsx` - Main entry file

## 📚 Advanced Concepts Demonstrated

- **Centralized Cart State:** All cart actions are handled via Redux Toolkit for predictable, scalable state changes.
- **Session Persistence:** Cart state is stored in `sessionStorage` and restored on app load.
- **Efficient Data Fetching:** React Query caches product/category results, handles refetching and errors.
- **Responsive UI:** Bootstrap-based layout adjusts to any device size.
- **Graceful Degradation:** Broken product images are replaced with placeholders, ensuring a consistent look.

