import React from "react";
import "./CategoryFilter.css";

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="CategoryFilter">
      {categories.map((category) => (
        <button
          key={category}
          className={activeCategory === category ? "active" : ""}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
