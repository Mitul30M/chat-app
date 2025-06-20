import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { SocketProvider } from './context/SocektContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <App />
      <Toaster closeButton />
    </SocketProvider>
    
  </StrictMode>
)
