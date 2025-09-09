# Advanced React + Firebase E-Commerce Web App

This project is a fully-featured e-commerce web application built with **React** and **TypeScript**, leveraging **Redux Toolkit** for state management, **React Query** for efficient data fetching, and **Firebase** for authentication and persistent, secure data storage. It demonstrates advanced front-end and cloud integration patterns.

## 🚀 Technologies Used

- **React** – Fast, component-based UI
- **TypeScript** – Type-safe codebase
- **Redux Toolkit** – Centralized state management for the shopping cart
- **React Query** – Asynchronous data fetching, caching, and error handling
- **Bootstrap** – Responsive and clean layout
- **Firebase Authentication** – Secure user registration and login
- **Cloud Firestore** – Persistent, scalable database for products, users, and orders

## 🛒 Features

- **Product Catalog**
  - Displays all products with title, price, category, description, and image
  - Handles image errors gracefully with placeholder images
  - Pagination for browsing large product lists
- **Category Navigation**
  - Dynamic category dropdown from Firestore products
  - Instantly filters products by selected category
- **Shopping Cart**
  - Add products to cart directly from the catalog
  - View and manage cart items (update quantity, remove items)
  - Live cart item count in the navbar
  - Cart persists across sessions using `sessionStorage`
  - Dynamic calculation of total items and total price
- **Checkout Flow**
  - Checkout creates an order in Firestore for the signed-in user
  - Visual feedback on successful checkout
- **Order History**
  - View all orders placed by the logged-in user (private)
- **User Profile**
  - Edit profile info and delete account (with Firestore doc removal)
- **Product Management (CRUD)**
  - Add, edit, delete products (protected route)
- **Authentication**
  - Register, login, logout
  - Protected routes for cart, profile, orders, product manager
- **Robust Error Handling**
  - Loading and error states for all Firestore/API calls
  - Fallback images for broken product image URLs

## 🔒 Security

- **Firestore Security Rules**:
  - Only authenticated users can read/write their own profile and orders
  - Product collection is readable by anyone, editable by any signed-in user

## 📦 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/resenaros/advanced-ecommerce-app.git
   cd advanced-ecommerce-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Authentication and Firestore
   - Add your Firebase config to `.env` as shown in `src/firebaseConfig.ts`
   - Set Firestore rules as shown above

4. **Run the development server**

   ```bash
   npm run dev
   ```

## 📁 Project Structure

- `src/store.ts` – Redux store setup
- `src/features/cart/cartSlice.ts` – Redux Toolkit cart slice
- `src/components/ProductCard.tsx` – Product display card
- `src/components/CartItem.tsx` – Individual cart item component
- `src/components/Navbar.tsx` – Navigation bar
- `src/components/ProductManager.tsx` – Product CRUD panel
- `src/pages/Home.tsx` – Landing page
- `src/pages/Products.tsx` – Product catalog page
- `src/pages/Cart.tsx` – Shopping cart page
- `src/pages/OrderHistory.tsx` – User order history
- `src/pages/Profile.tsx` – User profile
- `src/App.tsx` – App entry point and routing
- `src/main.tsx` – Main entry file

## 📚 Advanced Concepts Demonstrated

- **Centralized Cart State:** All cart actions handled via Redux Toolkit for predictable, scalable state changes.
- **Session Persistence:** Cart state stored in `sessionStorage` and restored on app load.
- **Efficient Data Fetching:** React Query caches product/category results, handles refetching and errors.
- **Secure Cloud Integration:** Firestore rules enforce privacy and user data security.
- **Responsive UI:** Bootstrap-based layout adjusts to any device size.
- **Graceful Degradation:** Broken product images are replaced with placeholders for a consistent look.

## 🔑 Firestore Security Rules

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    match /orders/{orderId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
