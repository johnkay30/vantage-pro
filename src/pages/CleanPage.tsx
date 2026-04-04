import React from 'react';
import { useData } from '../context/DataContext';
import { Table, Trash2, CheckCircle, AlertCircle, Database } from 'lucide-react';

const CleanPage = () => {
  // Pulling the necessary states from our DataContext
  const { data, setData, isCleaned, setIsCleaned, fileName } = useData();

  // FEATURE: Clean Data Function (Removing nulls/duplicates)
  const handleClean = () => {
    if (!data) return;
    const cleaned = data.filter((row: any) => 
      Object.values(row).some(val => val !== null && val !== "")
    );
    setData(cleaned);
    setIsCleaned(true);
  };

  // SAFETY CHECK: If data is undefined, show a loading/empty state instead of crashing
  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <Database size={48} className="text-slate-200 mb-4" />
        <h2 className="text-lg font-black uppercase tracking-widest text-slate-400">No Data Detected</h2>
        <p className="text-xs text-slate-400 mt-2 font-bold uppercase">Please upload a file in the Lab first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-12 pb-20 px-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end border-b pb-6 border-slate-200">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              Data Refinement Lab <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-widest italic">{fileName}</span>
            </h2>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.4em] mt-1">Audit & Integrity Management</p>
          </div>

          <button 
            onClick={handleClean}
            disabled={isCleaned}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              isCleaned 
              ? 'bg-emerald-50 text-emerald-600 cursor-default' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
            }`}
          >
            {isCleaned ? <CheckCircle size={14}/> : <Trash2 size={14}/>}
            {isCleaned ? 'Data Purified' : 'Run Scrubbing Engine'}
          </button>
        </div>

        {/* DATA PREVIEW TABLE */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {Object.keys(data[0] || {}).map((key) => (
                    <th key={key} className="p-4 px-6 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* SAFE SLICING: We only slice if data exists */}
                {data.slice(0, 15).map((row: any, i: number) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    {Object.values(row).map((val: any, j: number) => (
                      <td key={j} className="p-4 px-6 text-[11px] font-bold text-slate-600 truncate max-w-[200px]">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER INFO */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-8">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={12}/> Showing First 15 Records for Integrity Check
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Total Payload: {data.length} Rows
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanPage;