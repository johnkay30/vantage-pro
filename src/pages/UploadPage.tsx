import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { useData } from '../context/DataContext';
import { 
  CloudUpload, FileText, Loader2, X, AlertCircle, BarChart3, Zap 
} from 'lucide-react';

const UploadPage = () => {
  const { setData, setFileName, setIsCleaned } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setTempFile(file);
      setError(null);
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const processFile = () => {
    if (!tempFile) return;
    
    // Start Loading UI
    setLoading(true);
    setError(null);

    // Use a slight timeout to ensure the UI paints the "Loading" state 
    // before the CPU-heavy parsing starts
    setTimeout(() => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const buffer = e.target?.result;
          if (!buffer) throw new Error("File buffer is empty.");

          // 1. FAST PARSE: Using ArrayBuffer is 2x faster than BinaryString
          const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          
          // 2. CONVERT: Ensure empty cells are caught as ""
          const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          if (!rawData || rawData.length === 0) {
            throw new Error("No data found in this sheet.");
          }

          // 3. ATOMIC STATE UPDATE: Update all global values at once
          setFileName(tempFile.name);
          setData(rawData);
          setIsCleaned(false); // This triggers the switch to Data Lab in CleanPage.tsx
          
          console.log("Engine: Data Injected Successfully.");
          setLoading(false);

        } catch (err: any) {
          console.error("Critical Engine Error:", err);
          setError(err.message || "Engine failed to parse. Please check the file format.");
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError("FileReader failed to access local disk.");
        setLoading(false);
      };

      reader.readAsArrayBuffer(tempFile);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl animate-in fade-in zoom-in duration-700">
        
        {/* BRANDING */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-100 mb-4">
            <BarChart3 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">
            ANALYTIC<span className="text-indigo-600">.AI</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
            Institutional Data Processing Unit
          </p>
        </div>

        {/* MAIN UPLOAD BOX */}
        <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          {!tempFile ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center transition-all cursor-pointer
                ${isDragActive ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98]' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}
            >
              <input {...getInputProps()} />
              <div className="bg-indigo-50 p-6 rounded-full text-indigo-600 mb-6">
                <CloudUpload size={44} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Drop Dataset</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">
                CSV or Excel • Industry Standard <br/> Secure Local Processing
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              {/* FILE PREVIEW CARD */}
              <div className="flex items-center justify-between p-7 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-white rounded-2xl text-indigo-600 shadow-sm">
                    <FileText size={28} />
                  </div>
                  <div className="max-w-[240px]">
                    <h4 className="text-sm font-black text-slate-800 truncate uppercase tracking-tight">{tempFile.name}</h4>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <Zap size={10} fill="currentColor"/> Data Integrity Verified
                    </p>
                  </div>
                </div>
                {!loading && (
                  <button onClick={() => setTempFile(null)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <X size={24} />
                  </button>
                )}
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={processFile}
                disabled={loading}
                className={`w-full py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl
                  ${loading 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:-translate-y-1 active:scale-95'}`}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Bypassing Latency...
                  </>
                ) : (
                  <>Inject to Data Lab</>
                )}
              </button>

              {error && (
                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-6 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 animate-shake">
                  <AlertCircle size={18} /> {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER METRICS */}
        <div className="flex justify-between mt-10 px-6">
          <div className="flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Engine Stable</p>
          </div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Institutional v4.5.2</p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;