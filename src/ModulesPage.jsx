import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Star,
  Search,
  CheckCircle,
  ShoppingCart,
  Clock,
  Globe, // Thêm icon Globe
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
// Import Modal đăng ký
import RegisterModal from "./components/RegisterModal";

const API_URL =
  import.meta.env.VITE_API_URL || "https://mini-mba-admin.onrender.com";

// --- 1. TỪ ĐIỂN ĐA NGÔN NGỮ ---
const translations = {
  vi: {
    badge: "Tuyển sinh liên tục",
    title: "Kho Khóa Học & Module Chuyên Sâu",
    desc: "Linh hoạt lựa chọn kiến thức bạn cần. Đăng ký học theo từng Module riêng lẻ hoặc tích lũy để nhận chứng chỉ Mini MBA.",

    search_placeholder: "Tìm kiếm module...",
    available_count: "Module có sẵn",

    card_duration: "Giờ",
    card_cert: "Có chứng chỉ",
    card_btn: "Đăng ký học lẻ",

    footer_title: "Bạn chưa tìm thấy khóa học phù hợp?",
    footer_btn: "Tư vấn lộ trình riêng",
  },
  en: {
    badge: "Enrollment Open",
    title: "Course & Intensive Module Repository",
    desc: "Flexibly choose the knowledge you need. Register for individual Modules or accumulate credits for a Mini MBA certificate.",

    search_placeholder: "Search modules...",
    available_count: "Modules available",

    card_duration: "Hours",
    card_cert: "Certified",
    card_btn: "Register Now",

    footer_title: "Haven't found the right course?",
    footer_btn: "Get Personalized Consultation",
  },
};

// --- 2. HÀM XỬ LÝ DỮ LIỆU ĐỘNG (Lấy tiếng Anh nếu có) ---
const getData = (item, field, lang) => {
  if (!item) return "";
  if (lang === "en") {
    // Nếu đang ở mode tiếng Anh, thử tìm trường có đuôi _en (ví dụ title_en)
    const enValue = item[`${field}_en`];
    if (enValue && enValue.trim() !== "") return enValue;
  }
  // Mặc định trả về tiếng Việt
  return item[field];
};

export default function ModulesPage() {
  const [lang, setLang] = useState("en"); // State ngôn ngữ
  const t = translations[lang]; // Từ điển hiện tại

  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE CHO MODAL ĐĂNG KÝ ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/modules/`)
      .then((res) => res.json())
      .then((data) => {
        // Sắp xếp theo thứ tự (order) từ bé đến lớn
        const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setModules(sorted);
      })
      .catch((err) => console.error("Lỗi tải modules:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Hàm mở Modal khi bấm nút Đăng ký
  const handleOpenRegister = (module) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  // Lọc module theo ngôn ngữ hiện tại
  const filteredModules = modules.filter((m) => {
    const title = getData(m, "title", lang).toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-900 to-slate-900 text-white pt-24 pb-16 px-6 relative overflow-hidden">
        {/* Nút đổi ngôn ngữ góc phải */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white font-bold border border-white/20 transition-all"
          >
            <Globe size={16} /> {lang === "vi" ? "EN" : "VN"}
          </button>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-4 border border-yellow-500/30">
            {t.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            {t.title}
          </h1>
          <p className="text-blue-100 text-lg max-w-3xl mx-auto font-light">
            {t.desc}
          </p>
        </div>
      </header>

      {/* TOOLBAR */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold text-slate-700">
            {filteredModules.length} {t.available_count}
          </div>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t.search_placeholder}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-full outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="text-center py-20 text-slate-500">
            Scanning data...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModules.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col group h-full relative"
              >
                {/* Header Card: Icon & Số thứ tự */}
                <div className="bg-slate-50 p-6 pb-0 flex justify-between items-start">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                    <BookOpen size={24} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">
                    {mod.order || "#"}
                  </div>
                </div>

                {/* Nội dung chính */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2 h-14">
                    {getData(mod, "title", lang)}
                  </h3>

                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-grow">
                    {getData(mod, "description", lang)}
                  </p>

                  {/* Thông tin metadata */}
                  <div className="pt-4 border-t border-slate-100 mt-auto space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {mod.duration || "4"}{" "}
                        {t.card_duration}
                      </span>
                      {mod.has_certificate && (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={14} /> {t.card_cert}
                        </span>
                      )}
                    </div>

                    {/* NÚT ĐĂNG KÝ */}
                    <button
                      onClick={() => handleOpenRegister(mod)}
                      className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white cursor-pointer active:scale-95"
                    >
                      <ShoppingCart size={18} /> {t.card_btn}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER CTA */}
      <div className="bg-slate-900 py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">{t.footer_title}</h2>
        <Link
          to="/#dang-ky"
          className="inline-block px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full transition-all"
        >
          {t.footer_btn}
        </Link>
      </div>

      {/* --- MODAL ĐĂNG KÝ (ẨN/HIỆN) --- */}
      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedModule={selectedModule}
        lang={lang} // Truyền ngôn ngữ xuống modal (nếu modal hỗ trợ)
      />
    </div>
  );
}
