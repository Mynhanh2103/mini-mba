import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- IMPORT CÁC TRANG (PAGES) ---
import HomePage from "./HomePage"; // Trang chủ Công ty (Đa ngôn ngữ)
import ConsultingPage from "./ConsultingPage"; // Trang Tư vấn (Đa ngôn ngữ)
import ResearchPage from "./ResearchPage"; // Trang Nghiên cứu (Đa ngôn ngữ)
import ResearchDetail from "./ResearchDetail"; // Trang chi tiết bài viết
import TrainingPage from "./TrainingPage"; // Trang Danh mục Đào tạo (Menu chung)
import MiniMBALanding from "./MiniMBALanding"; // Landing Page khóa Mini MBA
import ModulesPage from "./ModulesPage"; // Trang Siêu thị Module (Bán lẻ)
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";

// Component cuộn lên đầu trang mỗi khi chuyển trang
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Tự động cuộn lên đầu khi chuyển trang */}
      <Routes>
        {/* 1. TRANG CHỦ CÔNG TY */}
        <Route path="/" element={<HomePage />} />
        {/* 2. NHÓM TƯ VẤN */}
        <Route path="/consulting" element={<ConsultingPage />} />
        {/* 3. NHÓM NGHIÊN CỨU */}
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/research/:slug" element={<ResearchDetail />} />
        {/* 4. NHÓM ĐÀO TẠO */}
        <Route path="/training" element={<TrainingPage />} />{" "}
        {/* Menu tổng hợp */}
        <Route path="/training/mini-mba" element={<MiniMBALanding />} />
        {/* Khóa Mini MBA */}
        <Route path="/training/modules" element={<ModulesPage />} />{" "}
        {/* Đăng ký Module lẻ */}
        {/* 5. HỆ THỐNG USER & ADMIN */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* 404 NOT FOUND */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen bg-slate-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
                <p className="text-slate-600 mb-6">
                  Không tìm thấy trang bạn yêu cầu
                </p>
                <a
                  href="/"
                  className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition"
                >
                  Về trang chủ
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
