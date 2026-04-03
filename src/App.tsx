import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/AppSidebar"; 
import Dashboard from "./pages/Dashboard"; 
import UploadPage from "./pages/UploadPage";     
import CleanPage from "./pages/CleanPage";       

function App() {
  // Global state for Dark Mode
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`${isDark ? 'dark' : ''} flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300`}>
      {/* We pass the state to the Sidebar so the Settings button can control it */}
      <Sidebar isDark={isDark} setIsDark={setIsDark} />
      
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/clean" element={<CleanPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;