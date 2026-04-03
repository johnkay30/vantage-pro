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
  Loader2, Database, Zap, Map as MapIcon, Share2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Dashboard = () => {
  const context = useData();
  
  // Guard against undefined context
  if (!context) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <p className="text-slate-400 font-bold animate-pulse">CONNECTING TO DATA ENGINE...</p>
      </div>
    );
  }

  const { 
    filteredData = [], 
    config, 
    filterOptions = {}, 
    activeFilters = {}, 
    setActiveFilters 
  } = context;

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

  // Logic to handle "Data Processing" visuals
  useEffect(() => {
    setIsProcessing(true);
    const timer = setTimeout(() => setIsProcessing(false), 600);
    return () => clearTimeout(timer);
  }, [filteredData]);

  const chartData = useMemo(() => {
    if (!config?.xKey || !config?.yKey || filteredData.length === 0) return [];
    return formatForCharts(filteredData, config.xKey, config.yKey);
  }, [filteredData, config]);

  const totalValue = useMemo(() => {
    if (!config?.yKey) return 0;
    return filteredData.reduce((acc, curr) => acc + (Number(curr[config.yKey]) || 0), 0);
  }, [filteredData, config]);

  const COLORS = [theme.accent, '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0'];

  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { backgroundColor: theme.globalBg, scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`VantagePro_Report.pdf`);
  };

  const CardWrapper = ({ title, children }: any) => (
    <div className="p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm" style={{ backgroundColor: theme.cardBg }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
        <Zap size={12} className="text-slate-300" />
      </div>
      <div className="h-[300px] w-full">{children}</div>
    </div>
  );

  // --- LOADING SCREEN (Shown when no file is uploaded yet) ---
  if (!config || filteredData.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center space-y-6" style={{ backgroundColor: theme.globalBg }}>
        <div className="p-10 rounded-[3rem] bg-white shadow-2xl flex flex-col items-center border border-slate-100">
            <div className="p-5 rounded-full bg-blue-50 mb-4">
                <Database className="text-blue-500 animate-bounce" size={48} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest text-slate-700">Awaiting Dataset</h2>
            <p className="text-slate-400 text-xs mt-2">Upload a CSV/JSON file to activate Vantage Pro.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="p-10 min-h-screen space-y-10 transition-all duration-500" style={{ backgroundColor: theme.globalBg, color: theme.textMain }}>
      
      {/* BRAND HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8 border-slate-200/50">
        <div>
          <div className="flex items-center gap-3 font-black text-3xl tracking-tighter uppercase" style={{ color: theme.accent }}>
            <Activity size={32} strokeWidth={3} /> VANTAGE PRO
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Institutional Report</span>
            <span className="h-4 w-[1px] bg-slate-200"></span>
            <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {isProcessing ? 'CALCULATING...' : 'LIVE DATA STREAM'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mr-2">
            <Palette size={14} className="text-slate-400 mx-2" />
            {palettes.map((p) => (
              <button key={p.name} onClick={() => setTheme({...theme, globalBg: p.global, cardBg: p.card, accent: p.accent, textMain: p.global === "#0F172A" ? "#F8FAFC" : "#0F172A"})} className="w-5 h-5 rounded-full border border-white transition-all hover:scale-125 ring-1 ring-slate-100 shadow-sm" style={{ backgroundColor: p.accent }} />
            ))}
          </div>
          <button onClick={() => window.print()} className="bg-white border border-slate-200 text-slate-700 p-3 px-5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 shadow-sm"><Printer size={16} /> PRINT</button>
          <button onClick={exportToPDF} className="p-3 px-6 rounded-xl font-bold text-xs flex items-center gap-2 text-white shadow-lg transition-all" style={{ backgroundColor: theme.accent }}><FileText size={16} /> EXPORT PDF</button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Aggregate Valuation", val: `$${(totalValue/1000).toFixed(1)}k`, icon: <DollarSign/> },
          { label: "Data Sample Size", val: filteredData.length.toLocaleString(), icon: <Activity/> },
          { label: "Engine Status", val: "Optimal", icon: <Zap/> },
          { label: "Market Reach", val: "Global", icon: <Globe/> }
        ].map((kpi, i) => (
          <div key={i} className="p-6 rounded-3xl border border-slate-200/50 shadow-sm flex items-center gap-4 transition-all hover:scale-105" style={{ backgroundColor: theme.cardBg }}>
            <div className="p-3 rounded-xl" style={{ backgroundColor: theme.globalBg, color: theme.accent }}>{kpi.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{kpi.label}</p>
              <h3 className="text-xl font-bold">{kpi.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* OMNI-CHART MATRIX */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${isProcessing ? 'opacity-30' : 'opacity-100'}`}>
        
        <CardWrapper title="Clustered Column (2-D)">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px'}} />
              <Bar dataKey="value" fill={theme.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardWrapper>

        <CardWrapper title="Concentration (Doughnut)">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={chartData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardWrapper>

        <CardWrapper title="Distribution Funnel">
          <ResponsiveContainer>
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={chartData} isAnimationActive>
                <LabelList position="right" fill={theme.textMain} stroke="none" dataKey="name" style={{ fontSize: '10px' }} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </CardWrapper>

        <CardWrapper title="Volatility (Scatter)">
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeOpacity={0.1} />
              <XAxis dataKey="name" fontSize={10} />
              <YAxis hide />
              <ZAxis type="number" range={[100, 500]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Data" data={chartData} fill={theme.accent} />
            </ScatterChart>
          </ResponsiveContainer>
        </CardWrapper>

        <CardWrapper title="Macro Area Trend">
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs><linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={theme.accent} stopOpacity={0.3}/><stop offset="95%" stopColor={theme.accent} stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="name" fontSize={10} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke={theme.accent} strokeWidth={3} fill="url(#colorV)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardWrapper>

        <CardWrapper title="Geospatial Mapping">
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <MapIcon size={64} className="text-slate-200 animate-pulse" />
              <p className="text-[10px] font-bold text-slate-400 px-10 uppercase tracking-widest">Awaiting Geo-Location Injection</p>
          </div>
        </CardWrapper>
      </div>

      {/* INTELLIGENCE FOOTER */}
      <div className="p-10 rounded-[3rem] border border-slate-200/50 flex flex-col md:flex-row items-center gap-10" style={{ backgroundColor: theme.cardBg }}>
        <div className="p-6 rounded-full bg-blue-50">
            <BrainCircuit size={48} className="text-blue-500" />
        </div>
        <div className="flex-1">
            <h2 className="text-2xl font-black tracking-tight mb-2 uppercase">Neural Strategy Insight</h2>
            <p className="text-slate-500 text-sm leading-relaxed">System analysis confirms high performance in the primary sectors. Funnel throughput remains at 82%. We recommend prioritizing the macro area trend for next quarter projections.</p>
        </div>
        <button className="p-4 px-10 rounded-2xl text-white font-bold text-sm shadow-xl hover:scale-105 transition-all" style={{ backgroundColor: theme.accent }}>ACTIVATE DEPLOYMENT</button>
      </div>

      <footer className="text-center py-12 border-t border-slate-200/30">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Vantage Pro Intelligence • Proprietary Build v4.5</p>
      </footer>
    </div>
  );
};

export default Dashboard;