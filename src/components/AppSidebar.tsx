import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  UploadCloud, 
  Wand2, 
  Home, 
  Settings, 
  Database,
  ChevronRight,
  Moon,
  Sun,
  ShieldCheck,
  Info,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define the props interface for clarity
interface SidebarProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export function Sidebar({ isDark, setIsDark }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Local state to control the popover visibility
  const [showSettings, setShowSettings] = useState(false);

 const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: UploadCloud, label: "Upload", path: "/upload" },
  { icon: Wand2, label: "Data Lab", path: "/clean" }, // Changed 'Clean Engine' to 'Data Lab'
];

  return (
    <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen flex flex-col sticky top-0 z-30 transition-colors duration-300">
      <div className="p-6">
        {/* Brand Logo - ANALYTICS.AI */}
        <div className="flex items-center gap-3 px-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <Database className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white">
            ANALYTICS<span className="text-indigo-600">.AI</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 animate-in slide-in-from-left-1" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Settings Popover Section */}
      <div className="mt-auto p-6 border-t border-slate-50 dark:border-slate-800 relative">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-bold text-sm",
            showSettings 
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg" 
              : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
          )}
        >
          <Settings className={cn("w-5 h-5", showSettings ? "animate-spin-slow" : "")} />
          <span>Settings</span>
        </button>

        {/* --- SETTINGS POPOVER MENU --- */}
        {showSettings && (
          <div className="absolute bottom-20 left-4 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-5">
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-700 pb-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration</h4>
                <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">v1.0.4</span>
              </div>

              {/* Dark Mode Toggle - Functional */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isDark ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Dark Mode</span>
                </div>
                <button 
                  onClick={() => setIsDark(!isDark)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-colors relative flex items-center px-1",
                    isDark ? "bg-indigo-600" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 bg-white rounded-full transition-transform shadow-sm",
                    isDark ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>

              {/* Theme Color Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Interface Theme</span>
                </div>
                <div className="flex gap-2">
                  {["#6366f1", "#10b981", "#f43f5e", "#f59e0b"].map((c) => (
                    <div key={c} className="w-4 h-4 rounded-full border border-slate-100 dark:border-slate-600" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              {/* Static Links */}
              <div className="pt-3 border-t border-slate-50 dark:border-slate-700 space-y-3">
                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 w-full text-left transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                  User Policy
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 w-full text-left transition-colors">
                  <Info className="w-4 h-4" />
                  System Version 1.0
                </button>
              </div>

              <p className="text-[10px] text-slate-400 italic text-center pt-2">
                &copy; 2026 Analytic.ai Insights BI
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}