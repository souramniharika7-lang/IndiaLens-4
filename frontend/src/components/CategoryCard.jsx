import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => (
  <Link to={`/categories/${category.slug}`} className="category-card">
    <span className="category-card-icon">{category.icon || '📊'}</span>
    <div className="category-card-name">{category.name}</div>
    <div className="category-card-desc">{category.description}</div>
  </Link>
);

export default CategoryCard;
