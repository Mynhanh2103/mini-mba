import React, { createContext, useState, useContext, useEffect } from "react";

// Tạo Context
const LanguageContext = createContext();

// Tạo Provider để bao bọc toàn bộ ứng dụng
export const LanguageProvider = ({ children }) => {
  // 1. Khởi tạo: Lấy ngôn ngữ từ localStorage, nếu không có thì mặc định là 'en'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("app_language") || "en";
  });

  // 2. Hàm đổi ngôn ngữ
  const toggleLanguage = () => {
    setLang((prevLang) => {
      const newLang = prevLang === "en" ? "vi" : "en";
      localStorage.setItem("app_language", newLang); // Lưu ngay vào bộ nhớ
      return newLang;
    });
  };

  // 3. Hàm set ngôn ngữ cụ thể (nếu cần)
  const switchLanguage = (code) => {
    setLang(code);
    localStorage.setItem("app_language", code);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook để dùng nhanh ở các trang khác
export const useLanguage = () => useContext(LanguageContext);
