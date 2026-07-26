import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

const DEFAULT_FILTERS = { category: '', source: '', year: '', query: '' };

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <FilterContext.Provider value={{ filters, setFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
export default FilterContext;
