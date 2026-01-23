import React from 'react'
// 1. SỬA DÒNG NÀY: Import { createRoot } thay vì ReactDOM mặc định
import { createRoot } from 'react-dom/client' 

import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './LanguageContext.jsx' // Đảm bảo đường dẫn đúng

const container = document.getElementById('root');

// 2. SỬA DÒNG NÀY: Gọi hàm createRoot trực tiếp
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)