import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './context/DataContext' // The missing piece
import { Toaster } from "@/components/ui/toaster"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider> 
        <App />
        <Toaster />
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
)