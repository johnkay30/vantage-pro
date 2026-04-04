import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const DataContext = createContext<any>(null);

export const THEMES: any = {
  "Corporate": ['#1E40AF', '#3B82F6', '#93C5FD', '#60A5FA', '#2563EB', '#1D4ED8', '#1E3A8A', '#DBEAFE'],
  "Emerald": ['#065F46', '#10B981', '#34D399', '#6EE7B7', '#059669', '#047857', '#064E3B', '#D1FAE5'],
  "Midnight": ['#0F172A', '#F59E0B', '#64748B', '#B45309', '#334155', '#D97706', '#1E293B', '#FEF3C7'],
  "Modern": ['#1E293B', '#475569', '#94A3B8', '#CBD5E1', '#0F172A', '#334155', '#E2E8F0', '#F1F5F9'],
  "Crimson": ['#991B1B', '#EF4444', '#F87171', '#FCA5A5', '#DC2626', '#B91C1C', '#7F1D1D', '#FEE2E2'],
  "Cyber": ['#4F46E5', '#06B6D4', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#6366F1']
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [activeTheme, setActiveTheme] = useState("Corporate");
  const [customTitles, setCustomTitles] = useState<any>({});
  const [isCleaned, setIsCleaned] = useState(false);

  const formatNumber = (num: number) => {
    if (num === null || isNaN(num)) return "0";
    const abs = Math.abs(num);
    if (abs >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + ' B';
    if (abs >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + ' M';
    if (abs >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + ' K';
    return num.toLocaleString();
  };

  const cleanNum = (val: any) => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[$,%]/g, '')) || 0;
  };

  const config = useMemo(() => {
    if (data.length === 0) return null;
    const keys = Object.keys(data[0]);
    const yKey = keys.find(k => !isNaN(cleanNum(data[0][k]))) || keys[1];
    const xKey = keys.find(k => {
      const s = k.toLowerCase();
      return s.includes('name') || s.includes('date') || s.includes('dept') || s.includes('role') || s.includes('id');
    }) || keys[0];
    return { xKey, yKey, allKeys: keys };
  }, [data]);

  // EXPORT TOOLS
  const handlePrint = () => window.print();
  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Export_${fileName || 'Data'}.csv`; a.click();
  };

  // TITLING ENGINE
  useEffect(() => {
    if (config && data.length > 0) {
      const y = config.yKey.replace(/_/g, ' ');
      const x = config.xKey.replace(/_/g, ' ');
      setCustomTitles({
        main: `${fileName.split('.')[0] || 'DATA'} EXECUTIVE SUMMARY`,
        c1: `${y} Velocity by ${x}`,
        c2: `${y} Segmentation`,
        c3: `Top 10 ${y} Performance`,
        c4: `Growth Trajectory`,
        c5: `Total Active Records`,
        c8: `Metric Radar`,
        k1: `Total ${y}`,
        k2: `Average ${y}`,
        k3: `Volume`,
        k4: `Accuracy`,
        k5: `AI Status`
      });
    }
  }, [config, data, fileName]);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(activeFilters).every(([col, val]) => {
        if (!val || val === 'All') return true;
        return String(row[col]) === String(val);
      });
    });
  }, [data, activeFilters]);

  const filterOptions = useMemo(() => {
    if (data.length === 0) return {};
    const options: any = {};
    const catCols = Object.keys(data[0]).filter(k => typeof data[0][k] === 'string').slice(0, 6);
    catCols.forEach(col => {
      options[col] = Array.from(new Set(data.map(item => String(item[col] || "")))).slice(0, 15);
    });
    return options;
  }, [data]);

  return (
    <DataContext.Provider value={{ 
      data, setData, filteredData, config, fileName, setFileName,
      filterOptions, activeFilters, setActiveFilters, cleanNum, formatNumber,
      customTitles, setCustomTitles, activeTheme, setActiveTheme,
      isCleaned, setIsCleaned, handlePrint, handleExportCSV 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);