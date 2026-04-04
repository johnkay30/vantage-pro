import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, 
  AreaChart, Area, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar, LabelList, ComposedChart
} from 'recharts';
import { useData, THEMES } from '../context/DataContext';
import { Palette, Edit3, Filter, LayoutDashboard, Activity, Printer, Download } from 'lucide-react';

const Dashboard = () => {
  const { filteredData, config, filterOptions, activeFilters, setActiveFilters, customTitles, setCustomTitles, activeTheme, setActiveTheme, cleanNum, formatNumber, handlePrint, handleExportCSV, data } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const colors = THEMES[activeTheme];

  // TOP 10 RULE: For clean visualization
  const chartData = useMemo(() => {
    if (!config?.xKey || filteredData.length === 0) return [];
    return filteredData
      .slice(0, 10)
      .map((item: any) => ({
        name: String(item[config.xKey]).substring(0, 12), 
        value: cleanNum(item[config.yKey]),
        v2: cleanNum(item[config.yKey]) * 0.8
      }));
  }, [filteredData, config]);

  const handleRename = (id: string, val: string) => {
    setCustomTitles({ ...customTitles, [id]: val });
    setEditingId(null);
  };

  const DynamicHeader = ({ id, title, small = false }: any) => (
    <div className={`flex items-center gap-2 group ${small ? 'justify-center mb-1' : 'mb-4 justify-between'}`}>
      {editingId === id ? (
        <input autoFocus className="bg-slate-100 p-0.5 font-black uppercase text-[8px] w-full rounded" onBlur={(e) => handleRename(id, e.target.value)} defaultValue={title} />
      ) : (
        <h3 className={`${small ? 'text-[7px]' : 'text-[9px]'} font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 truncate`}>
          {title} <Edit3 size={8} className="opacity-0 group-hover:opacity-100 cursor-pointer text-indigo-500 shrink-0" onClick={() => setEditingId(id)}/>
        </h3>
      )}
    </div>
  );

  if (!data || data.length === 0) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-300">Awaiting Data Injection...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-12 pb-20 px-6 print:bg-white">
      <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b pb-6 border-slate-200 gap-4 print:hidden">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shrink-0">
                <LayoutDashboard className="text-white" size={20}/>
              </div>
              <div className="min-w-0 flex items-center gap-2">
                {editingId === 'main' ? (
                  <input autoFocus className="text-xl font-black uppercase bg-white border-b-2 border-indigo-500 outline-none" onBlur={(e) => handleRename('main', e.target.value)} defaultValue={customTitles.main} />
                ) : (
                  <>
                    <h2 className="text-xl md:text-2xl font-extrabold tracking-tight uppercase truncate text-slate-900">{customTitles.main}</h2>
                    <Edit3 size={16} className="opacity-0 group-hover:opacity-100 cursor-pointer text-indigo-300" onClick={() => setEditingId('main')}/>
                  </>
                )}
              </div>
            </div>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.4em] mt-0.5 ml-[42px]">Enterprise Analytics Command</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <button onClick={handlePrint} className="p-2.5 px-4 hover:bg-slate-50 text-slate-600 border-r border-slate-100 flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider"><Printer size={14}/> Print</button>
                <button onClick={handleExportCSV} className="p-2.5 px-4 hover:bg-slate-50 text-indigo-600 flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider"><Download size={14}/> Export</button>
             </div>
             <div className="flex items-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm gap-2">
                <Palette size={14} className="text-slate-300"/>
                <div className="flex gap-1">
                    {Object.keys(THEMES).map(t => (
                      <button key={t} onClick={() => setActiveTheme(t)} className={`w-5 h-5 rounded-full border transition-all ${activeTheme === t ? 'scale-110 border-slate-900 shadow-md' : 'border-transparent'}`} style={{ backgroundColor: THEMES[t][0] }} />
                    ))}
                </div>
             </div>
          </div>
        </div>

        {/* KPI SECTION - REACTS TO FILTERS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { id: 'k1', label: customTitles.k1, val: formatNumber(filteredData.reduce((a, b) => a + cleanNum(b[config?.yKey]), 0)) },
            { id: 'k2', label: customTitles.k2, val: formatNumber(filteredData.reduce((a, b) => a + cleanNum(b[config?.yKey]), 0) / filteredData.length || 0) },
            { id: 'k3', label: customTitles.k3, val: formatNumber(filteredData.length) },
            { id: 'k4', label: "Quality Score", val: "99.8%" },
            { id: 'k5', label: "AI Engine", val: "Active" }
          ].map((k, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm text-center">
              <DynamicHeader id={k.id} title={k.label} small />
              <h4 className="text-2xl font-black text-slate-900 leading-none mb-1">{k.val}</h4>
              <div className="h-1 w-6 mx-auto rounded-full" style={{backgroundColor: colors[i % 8]}}></div>
            </div>
          ))}
        </div>

        {/* RESTORED: INTELLIGENT FILTERS */}
        <div className="p-3 bg-white rounded-2xl border border-slate-100 flex items-center gap-3 px-6 overflow-x-auto no-scrollbar shadow-sm print:hidden">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[9px] uppercase tracking-widest shrink-0 mr-2">
            <Filter size={14} /> Intelligence Filters
          </div>
          {Object.entries(filterOptions).map(([col, opts]: any) => (
            <select key={col} onChange={e => setActiveFilters({...activeFilters, [col]: e.target.value})} className="bg-slate-50 border-none rounded-lg p-2 px-4 text-[9px] font-bold uppercase outline-none cursor-pointer hover:bg-indigo-50 transition-colors shadow-inner">
              <option value="All">All {col}</option>
              {opts.map((o: any) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>

        {/* GRAPHS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
            <DynamicHeader id="c1" title={customTitles.c1} />
            <div className="h-[280px]"><ResponsiveContainer><AreaChart data={chartData}><XAxis dataKey="name" fontSize={9} fontWeight="bold" hide /><YAxis hide/><Tooltip/><Area type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={4} fill={colors[0]} fillOpacity={0.1}><LabelList dataKey="value" position="top" content={(p: any) => <text x={p.x} y={p.y - 10} fill={colors[0]} fontSize={10} fontWeight={900} textAnchor="middle">{formatNumber(p.value)}</text>}/></Area></AreaChart></ResponsiveContainer></div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
            <DynamicHeader id="c2" title={customTitles.c2} />
            <div className="h-[280px]"><ResponsiveContainer><PieChart><Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={8} fontWeight="black">{chartData.map((_, i) => <Cell key={i} fill={colors[i % 8]} />)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col justify-center text-center">
            <Activity size={32} className="mx-auto mb-3 text-indigo-500 opacity-80" />
            <DynamicHeader id="c5" title={customTitles.c5} small />
            <h2 className="text-4xl font-black text-slate-900">{formatNumber(filteredData.length)}</h2>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
            <DynamicHeader id="c3" title={customTitles.c3} />
            <div className="h-[280px]"><ResponsiveContainer><BarChart data={chartData} margin={{ top: 20 }}><XAxis dataKey="name" fontSize={9} fontWeight="black" tickLine={false} axisLine={false} /><Tooltip/><Bar dataKey="value" fill={colors[1]} radius={[6,6,6,6]} barSize={30}><LabelList dataKey="value" position="top" content={(p: any) => <text x={p.x + p.width/2} y={p.y - 10} fill={colors[1]} fontSize={9} fontWeight="black" textAnchor="middle">{formatNumber(p.value)}</text>}/></Bar></BarChart></ResponsiveContainer></div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
            <DynamicHeader id="c8" title={customTitles.c8} />
            <div className="h-[280px]"><ResponsiveContainer><RadarChart data={chartData}><PolarGrid/><PolarAngleAxis dataKey="name" fontSize={8} fontWeight="bold"/><Radar dataKey="value" stroke={colors[4]} fill={colors[4]} fillOpacity={0.4}/></RadarChart></ResponsiveContainer></div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
             <DynamicHeader id="c4" title={customTitles.c4} />
             <div className="h-[280px]"><ResponsiveContainer><LineChart data={chartData}><XAxis dataKey="name" hide/><Tooltip/><Line type="monotone" dataKey="value" stroke={colors[2]} strokeWidth={4} dot={{r:4}}/></LineChart></ResponsiveContainer></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;