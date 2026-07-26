import React from 'react';
import { useFilter } from '../context/FilterContext';
import { useData } from '../context/DataContext';

const FilterPanel = () => {
  const { filters, setFilter, clearFilters } = useFilter();
  const { categories } = useData();
  const years = [2023, 2022, 2021, 2020, 2019];

  return (
    <div className="filters-bar">
      <select value={filters.category} onChange={e => setFilter('category', e.target.value)} aria-label="Filter by category">
        <option value="">All Categories</option>
        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <select value={filters.year} onChange={e => setFilter('year', e.target.value)} aria-label="Filter by year">
        <option value="">All Years</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      <input
        type="text"
        value={filters.query}
        onChange={e => setFilter('query', e.target.value)}
        placeholder="Search indicators..."
        style={{ maxWidth: 220 }}
        aria-label="Search indicators"
      />
      {(filters.category || filters.year || filters.query) && (
        <button className="btn btn-outline btn-sm" onClick={clearFilters}>✕ Clear Filters</button>
      )}
    </div>
  );
};

export default FilterPanel;
