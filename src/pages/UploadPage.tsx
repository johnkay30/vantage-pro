import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx'; 
import { useData } from '../context/DataContext'; 
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge"; // <-- This was the missing line!

const UploadPage = () => {
  const { setData, setFileName } = useData();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // HANDLE EXCEL FILES (.xlsx, .xls)
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        setData(json);
        navigate('/clean');
      };
      reader.readAsBinaryString(file);
    } 
    // HANDLE CSV FILES
    else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setData(results.data);
          navigate('/clean');
        },
      });
    }
  }, [setData, setFileName, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    } 
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Import <span className="text-indigo-600">Datasets</span>
        </h1>
        <p className="text-slate-500 mt-2 font-medium italic">
          Drop CSV or Excel files to begin AI scrubbing
        </p>
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-[2rem] p-24 text-center transition-all cursor-pointer group
          ${isDragActive ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' : 'border-slate-200 hover:border-indigo-300 bg-white shadow-2xl shadow-slate-200/50'}`}
      >
        <input {...getInputProps()} />
        <div className="relative w-24 h-24 mx-auto mb-8">
          <Upload className="w-full h-full text-indigo-500 group-hover:-translate-y-2 transition-transform duration-500 ease-out" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-xl p-2 shadow-lg shadow-emerald-200">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <p className="text-2xl font-bold text-slate-800">
          {isDragActive ? "Drop it now!" : "Drag & drop files here"}
        </p>
        <p className="text-slate-400 mt-2 text-sm">or click to browse your computer</p>
        
        <div className="flex justify-center gap-3 mt-8">
           <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-mono px-3">.CSV</Badge>
           <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-mono px-3">.XLSX</Badge>
           <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-mono px-3">.XLS</Badge>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-400 font-medium">
          Privacy Secured: Files are processed locally and never stored on our servers.
        </p>
      </div>
    </div>
  );
};

export default UploadPage;