import React, { useMemo, useState, useRef, useEffect, memo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area,
  LabelList, ScatterChart, Scatter, ZAxis, ComposedChart,
  FunnelChart, Funnel
} from 'recharts';
import { useData } from '../context/DataContext';
import { formatForCharts } from '../lib/utils';
import { 
  Edit3, FileText, Printer, Filter, DollarSign, TrendingUp, 
  Users, RefreshCcw, Target, BrainCircuit, Activity, Palette, Globe,
  Loader2, Database, Zap, Map as MapIcon, Share2, Upload
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Papa from 'papaparse'; // CRITICAL: Run 'npm install papaparse' in your terminal

// --- SUB-COMPONENT: THE UPLOAD ZONE ---
const FileUploader = ({ onUpload }: { onUpload: (data: any[]) => void }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          onUpload(results.data);
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          onUpload(Array.isArray(json) ? json : [json]);
        } catch (err) {
          alert("Invalid JSON format. Please use a valid array of objects.");
        }
      };
      reader.readAsText(file);
    }
    e.target.value = ""; // Reset input so you can re-upload
  };

  return (
    <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white hover:border-blue-400 hover:bg-blue-50/30 transition-all group cursor-pointer relative">
      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".csv,.json" onChange={handleFile} />
      <div className="p-6 rounded-full bg-blue-50 group-hover:scale-110 transition-transform">
        <Upload className="text-blue-500" size={40} />
      </div>
      <h2 className="mt-6 font-black text-lg uppercase tracking-tighter text-slate-800">Inject Mission Data</h2>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Click or Drag CSV / JSON</p>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const CleanPage = () => {
  const { 
    filteredData = [], 
    config, 
    filterOptions = {}, 
    activeFilters = {}, 
    setActiveFilters, 
    updateData 
  } = useData() || {};

  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState({ 
    globalBg: "#F8FAFC", cardBg: "#ffffff", accent: "#3B82F6", textMain: "#0F172A" 
  });

  const palettes = [
    { name: "Slate", global: "#F8FAFC", card: "#ffffff", accent: "#3B82F6" },
    { name: "Midnight", global: "#0F172A", card: "#1E293B", accent: "#38BDF8" },
    { name: "Emerald", global: "#F0FDF4", card: "#ffffff", accent: "#10B981" },
    { name: "Royal", global: "#F5F3FF", card: "#ffffff", accent: "#7C3AED" },
    { name: "Crimson", global: "#FFF1F2", card: "#ffffff", accent: "#E11D48" },
    { name: "Gold", global: "#FAF7F0", card: "#ffffff", accent: "#B89150" }
  ];

  const chartData = useMemo(() => {
    if (!config?.xKey || !config?.yKey || filteredData.length === 0) return [];
    return formatForCharts(filteredData, config.xKey, config.yKey);
  }, [filteredData, config]);

  const totalValue = useMemo(() => {
    if (!config?.yKey) return 0;
    return filteredData.reduce((acc, curr) => acc + (Number(curr[config.yKey]) || 0), 0);
  }, [filteredData, config]);

  const COLORS = [theme.accent, '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0'];

  // --- LOADING STATE ---
  if (!config || filteredData.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F1F5F9] p-6">
        <div className="w-full max-w-xl">
           <div className="text-center mb-12">
             <div className="flex items-center justify-center gap-2 mb-2">
                <Activity size={32} className="text-blue-600" strokeWidth={3} />
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Vantage Pro</h1>
             </div>
             <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em]">Intelligence Engine v4.5</p>
           </div>
           <FileUploader onUpload={updateData} />
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div ref={dashboardRef} className="p-10 min-h-screen space-y-10 transition-all duration-500" style={{ backgroundColor: theme.globalBg, color: theme.textMain }}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8 border-slate-200/50">
        <div>
          <div className="flex items-center gap-3 font-black text-3xl tracking-tighter uppercase" style={{ color: theme.accent }}>
            <Activity size={32} strokeWidth={3} /> VANTAGE PRO
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Institutional Dashboard</span>
            <span className="h-4 w-[1px] bg-slate-200"></span>
            <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              <Database size={10}/> Data Engine Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            {palettes.map((p) => (
              <button key={p.name} onClick={() => setTheme({...theme, globalBg: p.global, cardBg: p.card, accent: p.accent, textMain: p.global === "#0F172A" ? "#F8FAFC" : "#0F172A"})} className="w-5 h-5 rounded-full border border-white transition-all hover:scale-125" style={{ backgroundColor: p.accent }} />
            ))}
          </div>
          <button onClick={() => window.location.reload()} className="bg-white border border-slate-200 text-slate-700 p-3 px-5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all"><RefreshCcw size={16} /> NEW FILE</button>
          <button onClick={() => window.print()} className="p-3 px-6 rounded-xl font-bold text-xs flex items-center gap-2 text-white shadow-lg transition-all" style={{ backgroundColor: theme.accent }}><FileText size={16} /> GENERATE REPORT</button>
        </div>
      </div>

      {/* KPI SUITE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Aggregate Valuation", val: `$${(totalValue/1000).toFixed(1)}k`, icon: <DollarSign/> },
          { label: "Data Sample Size", val: filteredData.length.toLocaleString(), icon: <Activity/> },
          { label: "System Status", val: "Optimal", icon: <Zap/> },
          { label: "Global Reach", val: "94.8%", icon: <Globe/> }
        ].map((kpi, i) => (
          <div key={i} className="p-6 rounded-3xl border border-slate-200/50 shadow-sm flex items-center gap-4 transition-all hover:scale-105" style={{ backgroundColor: theme.cardBg }}>
            <div className="p-3 rounded-xl" style={{ backgroundColor: theme.globalBg, color: theme.accent }}>{kpi.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">{kpi.label}</p>
              <h3 className="text-xl font-bold tracking-tight">{kpi.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* CHART GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm" style={{ backgroundColor: theme.cardBg }}>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Clustered Column</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px'}} />
                <Bar dataKey="value" fill={theme.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm" style={{ backgroundColor: theme.cardBg }}>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Asset Doughnut</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm" style={{ backgroundColor: theme.cardBg }}>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Conversion Funnel</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <FunnelChart>
                <Tooltip />
                <Funnel dataKey="value" data={chartData} isAnimationActive>
                  <LabelList position="right" fill={theme.textMain} stroke="none" dataKey="name" style={{ fontSize: '10px' }} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <footer className="text-center py-12 border-t border-slate-200/30">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Vantage Pro Intelligence Engine • Corporate Proprietary</p>
      </footer>
    </div>
  );
};

export default CleanPage;