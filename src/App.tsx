import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient();

// MARK: App Component
// Redux store is provided to the entire app using the Provider component
const App: React.FC = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Provider>
);

export default App;
