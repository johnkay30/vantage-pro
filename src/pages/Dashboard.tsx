import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, 
  AreaChart, Area, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar, LabelList, ComposedChart
} from 'recharts';
import { useData, THEMES } from '../context/DataContext';
import { Palette, Edit3, Filter, LayoutDashboard, Activity, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { data, filteredData, config, filterOptions, activeFilters, setActiveFilters, customTitles, setCustomTitles, kpis, activeTheme, setActiveTheme, cleanNum, formatNumber } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);

  const colors = THEMES[activeTheme];

  const chartData = useMemo(() => {
    if (!config?.xKey || filteredData.length === 0) return [];
    return filteredData.slice(0, 12).map((item: any) => ({
      name: String(item[config.xKey]).substring(0, 10), 
      value: cleanNum(item[config.yKey]),
      v2: cleanNum(item[config.yKey]) * 0.7
    }));
  }, [filteredData, config]);

  const handleRename = (id: string, val: string) => {
    setCustomTitles({ ...customTitles, [id]: val });
    setEditingId(null);
  };

  const DynamicHeader = ({ id, title, small = false }: any) => (
    <div className={`flex items-center gap-2 group ${small ? 'justify-center mb-1' : 'mb-3 justify-between'}`}>
      {editingId === id ? (
        <input autoFocus className="bg-slate-100 p-0.5 font-black uppercase text-[8px] w-full rounded outline-indigo-500" onBlur={(e) => handleRename(id, e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename(id, e.currentTarget.value)} defaultValue={title} />
      ) : (
        <h3 className={`${small ? 'text-[7px]' : 'text-[9px]'} font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 truncate`}>
          {title} <Edit3 size={8} className="opacity-0 group-hover:opacity-100 cursor-pointer text-indigo-500 shrink-0" onClick={() => setEditingId(id)}/>
        </h3>
      )}
    </div>
  );

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-300 bg-[#F8FAFC]">
        <AlertCircle size={48} className="mb-4 opacity-20" />
        <h2 className="text-xl font-black uppercase tracking-[0.3em]">Awaiting Data</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-12 pb-20 px-4">
      <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
        
        {/* HEADER SECTION - REFINED H2/H3 SIZE + RENAME ICON */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b pb-6 border-slate-200 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 group">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shrink-0">
                <LayoutDashboard className="text-white" size={20}/>
              </div>
              <div className="min-w-0 flex items-center gap-2">
                {editingId === 'main' ? (
                  <input autoFocus className="text-xl font-black uppercase bg-white border-b-2 border-indigo-500 outline-none" onBlur={(e) => handleRename('main', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename('main', e.currentTarget.value)} defaultValue={customTitles.main} />
                ) : (
                  <>
                    <h2 className="text-xl md:text-2xl font-extrabold tracking-tight uppercase truncate text-slate-900">
                      {customTitles.main}
                    </h2>
                    <button onClick={() => setEditingId('main')} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                      <Edit3 size={16} className="text-slate-300 hover:text-indigo-500 transition-colors" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.4em] mt-0.5 ml-[42px]">Global Intelligence Hub</p>
          </div>

          <div className="flex items-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm gap-2 shrink-0">
              <Palette size={14} className="text-slate-300"/>
              <div className="flex gap-1">
                {Object.keys(THEMES).map(t => (
                  <button key={t} onClick={() => setActiveTheme(t)} className={`w-5 h-5 rounded-full border transition-all ${activeTheme === t ? 'scale-110 border-slate-900 shadow-md' : 'border-transparent'}`} style={{ backgroundColor: THEMES[t][0] }} />
                ))}
              </div>
          </div>
        </div>

        {/* KPI CARDS - TIGHT SPACING */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {kpis.map((k: any, i: number) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm text-center hover:shadow-md transition-all">
              <DynamicHeader id={k.id} title={k.label} small />
              <h4 className="text-2xl font-black text-slate-900 leading-none mb-1">{k.value}</h4>
              <div className="h-1 w-6 mx-auto rounded-full" style={{backgroundColor: colors[i % 8]}}></div>
            </div>
          ))}
        </div>

        {/* COMPACT FILTERS */}
        <div className="p-3 bg-white rounded-2xl border border-slate-100 flex items-center gap-3 px-6 overflow-x-auto no-scrollbar shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-[9px] uppercase tracking-widest shrink-0 mr-2">
            <Filter size={14} /> Filters
          </div>
          {Object.entries(filterOptions).map(([col, opts]: any) => (
            <select key={col} onChange={e => setActiveFilters({...activeFilters, [col]: e.target.value})} className="bg-slate-50 border-none rounded-lg p-2 px-4 text-[9px] font-bold uppercase outline-none cursor-pointer hover:bg-indigo-50 transition-colors shadow-inner">
              <option value="All">All {col}</option>
              {opts.map((o: any) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>

        {/* CHART GRID - TIGHT GAP-4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
            <DynamicHeader id="c1" title={customTitles.c1} />
            <div className="h-[280px]"><ResponsiveContainer><AreaChart data={chartData}><XAxis dataKey="name" hide /><YAxis hide/><Tooltip/><Area type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={4} fill={colors[0]} fillOpacity={0.1}><LabelList dataKey="value" position="top" content={(p: any) => <text x={p.x} y={p.y - 10} fill={colors[0]} fontSize={10} fontWeight={900} textAnchor="middle">{formatNumber(p.value)}</text>}/></Area></AreaChart></ResponsiveContainer></div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
            <DynamicHeader id="c2" title={customTitles.c2} />
            <div className="h-[280px]"><ResponsiveContainer><PieChart><Pie data={chartData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">{chartData.map((_, i) => <Cell key={i} fill={colors[i % 8]} />)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col justify-center text-center">
            <Activity size={32} className="mx-auto mb-3 text-indigo-500 opacity-80" />
            <DynamicHeader id="c5" title={customTitles.c5} small />
            <h2 className="text-4xl font-black text-slate-900">{formatNumber(filteredData.length)}</h2>
            <p className="text-[9px] font-black text-slate-400 uppercase mt-2 tracking-widest italic">Live Points</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
            <DynamicHeader id="c3" title={customTitles.c3} />
            <div className="h-[280px]"><ResponsiveContainer><BarChart data={chartData}><Bar dataKey="value" fill={colors[1]} radius={[6,6,6,6]} barSize={18}><LabelList dataKey="value" position="top" content={(p: any) => <text x={p.x + p.width/2} y={p.y - 10} fill={colors[1]} fontSize={9} fontWeight="black" textAnchor="middle">{formatNumber(p.value)}</text>}/></Bar></BarChart></ResponsiveContainer></div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
            <DynamicHeader id="c4" title={customTitles.c4} />
            <div className="h-[280px]"><ResponsiveContainer><ComposedChart data={chartData}><XAxis dataKey="name" hide/><Tooltip/><Bar dataKey="value" fill={colors[2]} barSize={15} radius={[8,8,0,0]}/><Line type="monotone" dataKey="v2" stroke={colors[3]} strokeWidth={3} dot={{r: 4, fill: colors[3]}}/></ComposedChart></ResponsiveContainer></div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
            <DynamicHeader id="c8" title={customTitles.c8} />
            <div className="h-[280px]"><ResponsiveContainer><RadarChart data={chartData}><PolarGrid/><PolarAngleAxis dataKey="name" fontSize={9}/><Radar dataKey="value" stroke={colors[4]} fill={colors[4]} fillOpacity={0.4}/></RadarChart></ResponsiveContainer></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;