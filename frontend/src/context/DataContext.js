import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [indicators, setIndicators] = useState([]);
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [indRes, countryRes, catRes] = await Promise.all([
          axiosInstance.get('/indicators'),
          axiosInstance.get('/countries'),
          axiosInstance.get('/categories')
        ]);
        setIndicators(indRes.data.data || []);
        setCountries(countryRes.data.data || []);
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error('DataContext fetch error:', err.message);
      } finally {
        setDataLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <DataContext.Provider value={{ indicators, countries, categories, dataLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
export default DataContext;
