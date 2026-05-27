import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/index.js'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" toastOptions={{
          className: 'glass-card border-glow',
          style: {
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,245,255,0.2)'
          }
        }} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
