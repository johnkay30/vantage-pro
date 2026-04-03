import React from 'react';
import { useData } from '../context/DataContext';
import Dashboard from './Dashboard';
import UploadPage from './UploadPage';
import { ShieldCheck, ArrowRight, Target, Table, Zap } from 'lucide-react';

const CleanPage = () => {
  const { data, fileName, isCleaned, setIsCleaned, kpis } = useData();

  if (!data || data.length === 0) return <UploadPage />;

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* PERSISTENT DATA LAB */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/30">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={16} className="text-indigo-600"/>
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Analyst Mode Enabled</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Data <span className="text-indigo-600">Lab</span></h1>
              <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-1 italic">Scanning: {fileName}</p>
            </div>
            {!isCleaned && (
              <button onClick={() => setIsCleaned(true)} className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95">
                Generate Command Dashboard <ArrowRight size={16}/>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* KPI SUGGESTIONS COLUMN */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6"><Target size={14} className="text-indigo-500"/> Intelligence Discovery</h3>
              {kpis.slice(0, 5).map((k: any, i: number) => (
                <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center group hover:bg-indigo-50 transition-colors">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">{k.label}</p>
                    <p className="text-xl font-black text-slate-800">{k.value}</p>
                  </div>
                  <Zap size={14} className="text-slate-200 group-hover:text-indigo-300" />
                </div>
              ))}
            </div>

            {/* RAW DATA PREVIEW TABLE */}
            <div className="lg:col-span-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6"><Table size={14} className="text-indigo-500"/> Live Data Stream</h3>
              <div className="overflow-x-auto rounded-[2rem] border border-slate-100 max-h-[350px] shadow-inner bg-white">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-slate-50 shadow-sm z-10">
                    <tr>{Object.keys(data[0]).map(k => (
                      <th key={k} className="p-5 text-[9px] font-black uppercase text-slate-400 border-b tracking-widest">{k}</th>
                    ))}</tr>
                  </thead>
                  <tbody>{data.slice(0, 15).map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-indigo-50/20 transition-colors">
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="p-5 text-xs font-bold text-slate-600">{String(v)}</td>
                      ))}
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD SECTION - APPEARS BELOW THE LAB */}
        {isCleaned && <Dashboard />}
      </div>
    </div>
  );
};

export default CleanPage;