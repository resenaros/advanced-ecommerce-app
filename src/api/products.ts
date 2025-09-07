// src/api/products.ts
import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

//  Define the structure of a product
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Fetch products with optional category filter
export function useProducts(
  category?: string
): UseQueryResult<Product[], Error> {
  return useQuery<Product[], Error>({
    queryKey: ["products", category],
    queryFn: async () => {
      const url = category
        ? `https://fakestoreapi.com/products/category/${encodeURIComponent(
            category
          )}`
        : "https://fakestoreapi.com/products";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });
}

// Fetch product categories
export function useCategories() {
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(
        "https://fakestoreapi.com/products/categories"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
  });
}
