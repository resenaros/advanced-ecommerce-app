// src/components/CategorySelect.tsx
import React from "react";
import { useCategories } from "../api/products";

interface CategorySelectProps {
  selected: string;
  onChange: (category: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  selected,
  onChange,
}) => {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <select value={selected} onChange={(e) => onChange(e.target.value)}>
      <option value="">All</option>
      {isLoading ? (
        <option disabled>Loading...</option>
      ) : (
        categories.map((cat: string) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))
      )}
    </select>
  );
};

export default CategorySelect;
