import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  Clock,
  Video,
  FileText,
  ChevronRight,
  Award,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Kiểm tra đăng nhập (Bảo vệ trang)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Xóa token và chuyển hướng
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
  // Sau này sẽ thay bằng dữ liệu lấy từ API Backend
  const nextClass = {
    title: "Tư duy Chiến lược trong Quản trị Y tế",
    time: "09:00 - 11:30",
    date: "Thứ 7, 28/10/2025",
    instructor: "TS. BS. Nguyễn Văn A",
    link: "#", // Link Zoom
  };

  const recentMaterials = [
    {
      type: "pdf",
      title: "Slide bài giảng: Tài chính bệnh viện",
      date: "20/10",
    },
    {
      type: "video",
      title: "Record: Kỹ năng Lãnh đạo (Phần 1)",
      date: "18/10",
    },
    { type: "doc", title: "Case Study: Bệnh viện Chợ Rẫy", date: "15/10" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* --- 1. SIDEBAR (THANH ĐIỀU HƯỚNG) --- */}
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-20"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        className={`fixed md:relative z-30 h-full bg-blue-900 text-white flex flex-col transition-all duration-300 ${
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        }`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center border-b border-blue-800/50">
          <div className="flex items-center gap-2 overflow-hidden px-4">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-blue-900 shrink-0">
              T
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg whitespace-nowrap">
                TBI.Institute
              </span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Tổng quan"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={<Calendar size={20} />}
            text="Lịch học"
            active={activeTab === "schedule"}
            onClick={() => setActiveTab("schedule")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={<BookOpen size={20} />}
            text="Tài liệu & Bài giảng"
            active={activeTab === "materials"}
            onClick={() => setActiveTab("materials")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={<Award size={20} />}
            text="Chứng chỉ"
            active={activeTab === "cert"}
            onClick={() => setActiveTab("cert")}
            isOpen={isSidebarOpen}
          />
          <div className="pt-4 border-t border-blue-800/50 mt-4">
            <SidebarItem
              icon={<Settings size={20} />}
              text="Cài đặt tài khoản"
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              isOpen={isSidebarOpen}
            />
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-blue-800/50 bg-blue-950/30">
          <div
            className={`flex items-center gap-3 ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center text-blue-900 font-bold shrink-0">
              HV
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <h4 className="font-bold text-sm truncate">Học Viên Mới</h4>
                <p className="text-xs text-blue-200 truncate">Học viên K1</p>
              </div>
            )}
            {isSidebarOpen && (
              <button
                onClick={handleLogout}
                className="ml-auto p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={18} className="text-red-400" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* --- 2. MAIN CONTENT (NỘI DUNG CHÍNH) --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden md:block">
              {activeTab === "overview"
                ? "Dashboard Tổng quan"
                : "Khu vực học tập"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm bài học..."
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
              />
            </div>
            <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-600">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-20">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">
                Chào mừng trở lại, Học Viên! 👋
              </h1>
              <p className="text-blue-200 max-w-2xl">
                Bạn đã hoàn thành 30% khóa học "Mini MBA Quản trị Y tế". Hãy
                tiếp tục phát huy nhé!
              </p>
              <div className="mt-6 w-full max-w-md bg-blue-950/50 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full rounded-full"
                  style={{ width: "30%" }}
                ></div>
              </div>
              <p className="text-xs text-blue-200 mt-2">Đã học 3/10 buổi</p>
            </div>
            {/* Decor circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột trái: Lớp học & Stats */}
            <div className="lg:col-span-2 space-y-8">
              {/* Thẻ Lớp học sắp tới */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Clock className="text-yellow-500" size={20} />
                    Lớp học sắp tới
                  </h3>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Sắp diễn ra
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex flex-col items-center justify-center shrink-0 text-blue-900 border border-blue-200">
                    <span className="text-xs font-bold uppercase">
                      Tháng 10
                    </span>
                    <span className="text-2xl font-bold">28</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-900 mb-1">
                      {nextClass.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {nextClass.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} /> {nextClass.instructor}
                      </span>
                    </div>
                  </div>
                  <button className="w-full md:w-auto px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Video size={18} />
                    Vào lớp ngay
                  </button>
                </div>
              </div>

              {/* Grid 4 Stats nhỏ */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={<BookOpen size={20} className="text-blue-600" />}
                  label="Bài học đã xem"
                  value="12"
                  color="bg-blue-50"
                />
                <StatCard
                  icon={<Clock size={20} className="text-yellow-600" />}
                  label="Giờ học"
                  value="24h"
                  color="bg-yellow-50"
                />
                <StatCard
                  icon={<FileText size={20} className="text-purple-600" />}
                  label="Bài tập"
                  value="2/5"
                  color="bg-purple-50"
                />
                <StatCard
                  icon={<Award size={20} className="text-green-600" />}
                  label="Điểm trung bình"
                  value="8.5"
                  color="bg-green-50"
                />
              </div>
            </div>

            {/* Cột phải: Tài liệu mới */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-800">
                  Tài liệu mới nhất
                </h3>
                <button className="text-blue-600 text-sm font-bold hover:underline">
                  Xem tất cả
                </button>
              </div>

              <div className="space-y-4">
                {recentMaterials.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        item.type === "pdf"
                          ? "bg-red-100 text-red-600"
                          : item.type === "video"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.type === "pdf" ? (
                        <FileText size={20} />
                      ) : item.type === "video" ? (
                        <Video size={20} />
                      ) : (
                        <BookOpen size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h5>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Cập nhật: {item.date}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-slate-300 group-hover:text-blue-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS (Helper) ---

function SidebarItem({ icon, text, active, onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active
          ? "bg-yellow-500 text-blue-900 font-bold shadow-lg shadow-yellow-500/20"
          : "text-blue-200 hover:bg-white/10 hover:text-white"
      }`}
    >
      <div className={`${active ? "text-blue-900" : "group-hover:text-white"}`}>
        {icon}
      </div>
      {isOpen && <span className="whitespace-nowrap">{text}</span>}
      {active && isOpen && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-900"></div>
      )}
    </button>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div
      className={`p-5 rounded-2xl ${color} border border-transparent hover:border-slate-200 transition-all`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        <span className="text-2xl font-bold text-slate-800">{value}</span>
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
    </div>
  );
}
