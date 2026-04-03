import React, { createContext, useContext, useState, useCallback } from 'react';

const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [activeFilters, setActiveFilters] = useState<any>({});

  const updateData = useCallback((newData: any[]) => {
    console.log("🚀 DATA RECEIVED BY ENGINE:", newData.length, "rows");
    if (!newData || newData.length === 0) return;

    const columns = Object.keys(newData[0]);
    const numericColumn = columns.find(col => !isNaN(Number(newData[0][col]))) || columns[1];
    
    // Clear everything for the new file
    setActiveFilters({});
    setRawData(newData);
    setFilteredData(newData);
    
    // Build new filters
    const options: any = {};
    columns.forEach(col => {
      const uniqueValues = Array.from(new Set(newData.map(item => String(item[col]))));
      if (uniqueValues.length < 50) options[col] = uniqueValues;
    });
    
    setFilterOptions(options);
    setConfig({ xKey: columns[0], yKey: numericColumn });
  }, []);

  const handleSetFilters = (updater: any) => {
    const newFilters = typeof updater === 'function' ? updater(activeFilters) : updater;
    setActiveFilters(newFilters);

    let updated = [...rawData];
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] !== 'All') {
        updated = updated.filter(item => String(item[key]) === String(newFilters[key]));
      }
    });
    setFilteredData(updated);
  };

  return (
    <DataContext.Provider value={{
      filteredData, config, filterOptions, activeFilters,
      setActiveFilters: handleSetFilters, updateData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);