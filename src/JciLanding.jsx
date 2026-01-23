import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  ChevronDown,
  Star,
  ArrowRight,
  ShieldCheck,
  FileText,
  Activity,
  AlertTriangle,
  ClipboardList,
  Target,
  Microscope,
  Clock,
  Menu,
  X,
  Globe, // Icon cho nút ngôn ngữ
  CalendarDays,
  MapPin,
} from "lucide-react";
import axios from "axios";
import { useLanguage } from "./LanguageContext";
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// --- TỪ ĐIỂN UI ---
const translations = {
  vi: {
    nav_program: "Nội dung",
    nav_method: "Phương pháp",
    nav_audience: "Đối tượng",
    nav_instructors: "Chuyên gia",
    nav_register: "Đăng ký ngay",
    hero_badge: "TIÊU CHUẨN VÀNG TRONG QUẢN TRỊ BỆNH VIỆN",
    hero_title: "Quản Trị Chất Lượng & An Toàn Người Bệnh Theo JCI",
    hero_desc:
      "Chương trình đào tạo chuyên sâu 30 giờ, trang bị năng lực xây dựng hệ thống quản lý chất lượng đạt chuẩn quốc tế JCI phiên bản 2025.",
    hero_cta: "Tư vấn lộ trình",
    hero_brochure: "Tải Syllabus",
    stat_hours: "30 Giờ Đào tạo",
    stat_modules: "07 Chuyên đề", // Đã sửa thành 07
    stat_practice: "80% Thực hành",
    sec_program_title: "Cấu Trúc Chương Trình",
    sec_program_sub:
      "Lộ trình bài bản từ tư duy nền tảng đến kỹ năng thực thi.",
    sec_method_title: "Phương Pháp Đào Tạo",
    sec_audience_title: "Đối Tượng Tham Gia",
    sec_schedule_title: "Lịch Khai Giảng Sắp Tới",
    schedule_online: "Học Trực Tuyến (Zoom)",
    schedule_offline: "Học Trực Tiếp",
    btn_register_slot: "Đăng ký giữ chỗ",
    form_title: "Đăng Ký Tư Vấn Chuyên Sâu",
    form_desc:
      "Để lại thông tin, Ban tổ chức sẽ liên hệ tư vấn lộ trình phù hợp.",
    form_btn: "Gửi đăng ký",
    footer_rights: "Bản quyền thuộc về Smart Health Solutions.",
    trusted_by: "Được tin tưởng bởi các hệ thống y tế hàng đầu",
  },
  en: {
    nav_program: "Curriculum",
    nav_method: "Methodology",
    nav_audience: "Audience",
    nav_instructors: "Experts",
    nav_register: "Register Now",
    hero_badge: "THE GOLD STANDARD IN HOSPITAL MANAGEMENT",
    hero_title: "JCI Accreditation & Patient Safety Management",
    hero_desc:
      "Intensive 30-hour training program equipping you with the capability to build a quality management system according to JCI Standards (2025 Edition).",
    hero_cta: "Get Consultation",
    hero_brochure: "Download Syllabus",
    stat_hours: "30 Training Hours",
    stat_modules: "07 Modules", // Updated to 07
    stat_practice: "80% Practice",
    sec_program_title: "Program Structure",
    sec_program_sub:
      "A systematic roadmap from foundational mindset to execution skills.",
    sec_method_title: "Methodology",
    sec_audience_title: "Who Should Attend?",
    sec_schedule_title: "Upcoming Schedule",
    schedule_online: "Live Online (Zoom)",
    schedule_offline: "Offline Class",
    btn_register_slot: "Book Your Slot",
    form_title: "Register for Consultation",
    form_desc:
      "Leave your details, and we will contact you to discuss a roadmap.",
    form_btn: "Submit Registration",
    footer_rights: "© 2025 Smart Health Solutions. All rights reserved.",
    trusted_by: "Trusted by leading healthcare systems",
  },
};

// --- DATA MẶC ĐỊNH (CẬP NHẬT ĐẦY ĐỦ 7 MODULE THEO TÀI LIỆU) ---
const defaultModules = [
  {
    title: "1. Tổng quan về JCI & Tư duy Quản trị",
    title_en: "1. JCI Overview & Management Mindset",
    description:
      "<ul><li>Lịch sử và triết lý JCI toàn cầu.</li><li>Cấu trúc bộ tiêu chuẩn JCI phiên bản mới nhất (2025).</li><li>Mô hình khảo sát: Truy vết (Tracer), Phỏng vấn hệ thống.</li></ul>",
    description_en:
      "<ul><li>History and philosophy of JCI globally.</li><li>Structure of JCI Standards (2025 Edition).</li><li>Survey methodology: Tracer, System Interview.</li></ul>",
  },
  {
    title: "2. Mục tiêu An toàn Người bệnh (IPSG)",
    title_en: "2. International Patient Safety Goals (IPSG)",
    description:
      "Phân tích sâu 6 mục tiêu cốt lõi: <li>1. Định danh</li><li>2. Giao tiếp</li><li>3. An toàn thuốc</li><li>4. Phẫu thuật an toàn</li><li>5. Nhiễm khuẩn</li><li>6. Té ngã</li>",
    description_en:
      "Deep dive into 6 core goals: <li>1. Identify</li><li>2. Communication</li><li>3. Medications</li><li>4. Surgery</li><li>5. Infections</li><li>6. Falls</li>",
  },
  {
    title: "3. Tiêu chuẩn Chăm sóc & Điều trị (ACC, COP)",
    title_en: "3. Patient Care & Treatment (ACC, COP)",
    description:
      "<ul><li><b>ACC:</b> Tiếp cận và quy trình khám bệnh.</li><li><b>COP:</b> Chăm sóc người bệnh toàn diện.</li><li><b>MMU:</b> Quản lý và sử dụng thuốc an toàn.</li></ul>",
    description_en:
      "<ul><li><b>ACC:</b> Access to Care.</li><li><b>COP:</b> Care of Patients.</li><li><b>MMU:</b> Medication Management and Use.</li></ul>",
  },
  {
    title: "4. Quản trị Bệnh viện & Lãnh đạo (GLD, SQE)",
    title_en: "4. Leadership & Governance (GLD, SQE)",
    description:
      "<ul><li><b>GLD:</b> Vai trò của Ban Giám đốc trong xây dựng văn hóa chất lượng.</li><li><b>SQE:</b> Quản lý hồ sơ nhân sự, đánh giá năng lực và đào tạo liên tục.</li></ul>",
    description_en:
      "<ul><li><b>GLD:</b> Governance, Leadership, Direction.</li><li><b>SQE:</b> Staff Qualifications and Education.</li></ul>",
  },
  {
    title: "5. Quản lý Chất lượng & Cải tiến (QPS)",
    title_en: "5. Quality Improvement & Patient Safety (QPS)",
    description:
      "Xây dựng bộ chỉ số KPI. Phân tích nguyên nhân gốc rễ (RCA) và FMEA. Mô hình PDCA trong cải tiến liên tục.",
    description_en:
      "Building KPI sets. Root Cause Analysis (RCA) & FMEA. PDCA model in continuous improvement.",
  },
  {
    title: "6. Quản lý Cơ sở vật chất & An toàn (FMS)",
    title_en: "6. Facility Management & Safety (FMS)",
    description:
      "Quản lý an toàn môi trường, phòng chống cháy nổ, an toàn thiết bị y tế và ứng phó thảm họa/tình huống khẩn cấp.",
    description_en:
      "Management of safety, fire safety, medical equipment, and emergency/disaster preparedness.",
  },
  {
    title: "7. Đánh giá Nội bộ & Mock Survey",
    title_en: "7. Internal Audit & Mock Survey",
    description:
      "Kỹ năng đánh giá nội bộ. Tổ chức Mock Survey (Khảo sát thử) để phát hiện lỗ hổng. Kỹ năng trả lời phỏng vấn chuyên gia.",
    description_en:
      "Internal Audit skills. Organizing Mock Surveys to identify gaps. Interview skills with JCI surveyors.",
  },
];

const methodologyData = [
  {
    icon: Target,
    title_vi: "Tracer Methodology",
    title_en: "Tracer Methodology",
    desc_vi: "Phương pháp truy vết thực tế.",
    desc_en: "Real-time patient tracer.",
  },
  {
    icon: Users,
    title_vi: "Role-Play",
    title_en: "Role-Play Interview",
    desc_vi: "Đóng vai phỏng vấn chuyên gia.",
    desc_en: "Mock interviews with experts.",
  },
  {
    icon: Microscope,
    title_vi: "Case Study",
    title_en: "Clinical Case Studies",
    desc_vi: "Phân tích sự cố điển hình.",
    desc_en: "Analyzing incident cases.",
  },
  {
    icon: ClipboardList,
    title_vi: "Mock Survey",
    title_en: "Mock Survey",
    desc_vi: "Mô phỏng kỳ khảo sát.",
    desc_en: "Simulating survey process.",
  },
];

const audienceData = [
  {
    title_vi: "Ban Lãnh đạo",
    title_en: "Hospital Leadership",
    desc_vi: "Giám đốc, Trưởng khoa.",
    desc_en: "Directors, Heads of Dept.",
  },
  {
    title_vi: "QLCL & An toàn",
    title_en: "QA/QC Team",
    desc_vi: "Nhân viên chuyên trách.",
    desc_en: "Quality Specialists.",
  },
  {
    title_vi: "Bác sĩ/Điều dưỡng",
    title_en: "Doctors & Nurses",
    desc_vi: "Vận hành lâm sàng.",
    desc_en: "Clinical leaders.",
  },
];

export default function JciLanding() {
  // --- 1. LANGUAGE STATE (Mặc định EN) ---
  const {lang, toggleLanguage} = useLanguage();
  const t = (key) => translations[lang][key] || translations["en"][key];

  // State Data
  const [config, setConfig] = useState(null);
  const [modules, setModules] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resConfig, resModules, resInst, resSched] = await Promise.all([
          axios.get(`${API_BASE}/api/jci-config/`),
          axios.get(`${API_BASE}/api/jci-modules/`),
          axios.get(`${API_BASE}/api/jci-instructors/`),
          axios.get(`${API_BASE}/api/jci-schedule/`),
        ]);
        if (resConfig.data?.[0]) setConfig(resConfig.data[0]);
        setModules(resModules.data || []);
        setInstructors(resInst.data || []);
        setSchedules(resSched.data || []);
      } catch (err) {
        console.warn("Using default data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Ưu tiên dữ liệu API, nếu không có thì dùng defaultModules (7 module)
  const displayModules = modules.length > 0 ? modules : defaultModules;

  const heroImage =
    config?.hero_image ||
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop";

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-amber-100 selection:text-amber-900">
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <ShieldCheck className="w-8 h-8 text-blue-600 fill-blue-100" />
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              SHS<span className="text-blue-600">.Institute</span>
            </span>
          </Link>

          {/* 2. DESKTOP MENU (Links + Register Button) - Ẩn trên Mobile (lg:hidden) */}
          <div className="hidden lg:flex items-center gap-8 font-medium text-sm text-slate-600 ml-auto mr-6">
            {[
              { id: "program", label: t("nav_program") },
              { id: "instructors", label: t("nav_instructors") },
              { id: "schedule", label: t("sec_schedule_title") },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="hover:text-amber-600 transition-colors uppercase tracking-wide text-xs font-bold"
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => scrollTo("register")}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 text-xs uppercase tracking-wider"
            >
              {t("nav_register")}
            </button>
          </div>

          {/* 3. RIGHT ACTIONS (Ngôn ngữ + Hamburger) - Luôn hiển thị */}
          <div className="flex items-center gap-3">
            {/* NÚT CHUYỂN NGÔN NGỮ (Luôn hiện ở mọi màn hình) */}
            <button
              onClick={toggleLanguage} // Gọi hàm toggle từ Context
              className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-black font-bold border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              <Globe size={18} /> {lang === "vi" ? "EN" : "VN"}
            </button>

            {/* Nút Mobile Toggle (Chỉ hiện trên Mobile) */}
            <button
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="lg:hidden bg-white border-b overflow-hidden shadow-xl"
            >
              <div className="px-6 py-6 flex flex-col gap-4 text-center">
                <button
                  onClick={() => scrollTo("program")}
                  className="font-bold text-slate-700 py-2 border-b border-slate-50"
                >
                  {t("nav_program")}
                </button>
                <button
                  onClick={() => scrollTo("schedule")}
                  className="font-bold text-slate-700 py-2 border-b border-slate-50"
                >
                  {t("sec_schedule_title")}
                </button>

                {/* Nút Đăng ký trong Mobile Menu */}
                <button
                  onClick={() => scrollTo("register")}
                  className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl mt-2"
                >
                  {t("nav_register")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-amber-50/50 -z-20" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-amber-200">
              <Star className="w-3 h-3 fill-amber-600 text-amber-600" />{" "}
              {t("hero_badge")}
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6">
              {lang === "en" ? config?.hero_title_en : config?.hero_title}
              {!config && t("hero_title")}
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              {lang === "en" ? config?.hero_slogan_en : config?.hero_slogan}
              {!config && t("hero_desc")}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("register")}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                {t("hero_cta")} <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white border border-slate-200 hover:border-amber-300 text-slate-700 font-bold rounded-full transition-all flex items-center gap-2 shadow-sm">
                <FileText className="w-5 h-5 text-slate-400" />{" "}
                {t("hero_brochure")}
              </button>
            </div>

            {/* --- REPLACED GRAY BOXES WITH TRUST INDICATORS --- */}
            <div className="mt-12">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                {t("trusted_by")}
              </p>
              <div className="flex flex-wrap items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Logo Phương Châu */}
                <img
                  src="/logo/logopcg_jrjp4d.png" // Thay bằng đường dẫn file thật của bạn
                  alt="Phuong Chau"
                  className="h-10 w-auto object-contain hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/120x50?text=Phuong+Chau";
                  }}
                />
                {/* Logo Gia Định */}
                <img
                  src="/logo/Logo-Benh-Vien-Nhan-Dan-Gia-Dinh_kvpwzo.webp" // Thay bằng đường dẫn file thật của bạn
                  alt="Gia Dinh"
                  className="h-12 w-auto object-contain hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/120x50?text=Gia+Dinh";
                  }}
                />

                {/* Logo Ung Bướu (Oncology) */}
                <img
                  src="/logo/images_qdg3n6.png" // Thay bằng đường dẫn file thật của bạn
                  alt="Ho Chi Minh Oncology Hospital"
                  className="h-14 w-auto object-contain hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/150x50?text=Oncology+HCMC";
                  }}
                />
                {/* Logo JCI */}
                <img
                  src="/logo/image.webp" // Thay bằng đường dẫn file thật của bạn
                  alt="JCI"
                  className="h-12 w-auto object-contain hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/120x50?text=NTP+Hospital";
                  }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white">
              <img
                src={heroImage}
                alt="JCI Training"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {t("stat_practice")}
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      JCI Awareness & Internal Auditor
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-amber-400 rounded-full blur-2xl opacity-50 -z-10" />
          </motion.div>
        </div>
      </header>

      {/* --- KEY STATS --- */}
      <section className="bg-slate-900 py-12 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          <StatItem number="30h" label={t("stat_hours")} />
          <StatItem number="07" label={t("stat_modules")} />
          <StatItem number="80%" label={t("stat_practice")} />
          <StatItem number="2025" label="JCI Edition" />
        </div>
      </section>

      {/* --- PROGRAM STRUCTURE --- */}
      <section id="program" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              {t("sec_program_title")}
            </h2>
            <p className="text-slate-600">{t("sec_program_sub")}</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col gap-3">
              {displayModules.map((mod, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveModule(idx)}
                  className={`p-5 rounded-xl cursor-pointer border-2 transition-all duration-300 flex items-center gap-4 group ${
                    activeModule === idx
                      ? "bg-white border-amber-400 shadow-xl scale-102"
                      : "bg-white border-transparent hover:border-slate-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      activeModule === idx
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <h3
                    className={`font-bold text-base ${
                      activeModule === idx
                        ? "text-slate-900"
                        : "text-slate-500 group-hover:text-slate-800"
                    }`}
                  >
                    {lang === "en" ? mod.title_en || mod.title : mod.title}
                  </h3>
                  <ChevronDown
                    className={`ml-auto w-5 h-5 text-slate-300 transition-transform ${
                      activeModule === idx ? "-rotate-90 text-amber-500" : ""
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-2xl h-full relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {lang === "en"
                        ? displayModules[activeModule]?.title_en
                        : displayModules[activeModule]?.title}
                    </h3>
                    <div className="w-16 h-1 bg-amber-500 rounded-full mb-6"></div>
                    <div
                      className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          lang === "en"
                            ? displayModules[activeModule]?.description_en ||
                              displayModules[activeModule]?.description
                            : displayModules[activeModule]?.description,
                      }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* --- METHODOLOGY & AUDIENCE --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <Target className="w-8 h-8 text-amber-500" />{" "}
                {t("sec_method_title")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {methodologyData.map((m, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all"
                  >
                    <m.icon className="w-8 h-8 text-slate-700 mb-4" />
                    <h4 className="font-bold text-slate-900 mb-1">
                      {lang === "en" ? m.title_en : m.title_vi}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {lang === "en" ? m.desc_en : m.desc_vi}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />{" "}
                {t("sec_audience_title")}
              </h2>
              <div className="space-y-4">
                {audienceData.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-bold">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">
                        {lang === "en" ? a.title_en : a.title_vi}
                      </h4>
                      <p className="text-slate-500">
                        {lang === "en" ? a.desc_en : a.desc_vi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INSTRUCTORS & SCHEDULE (ĐÃ REDESIGN) --- */}
      <section id="schedule" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* TITLE */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                {t("sec_schedule_title")}
              </h2>
              <p className="text-slate-400">
                Join the upcoming cohort to start your quality journey.
              </p>
            </div>
            <button
              onClick={() => scrollTo("register")}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-colors"
            >
              {t("nav_register")}
            </button>
          </div>

          {/* SCHEDULE CARDS (Premium Grid) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {schedules.length > 0 ? (
              schedules.map((s, i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-700 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors p-3 rounded-xl text-center min-w-[70px]">
                      <span className="block text-xs font-bold uppercase tracking-wider">
                        {lang === "en" ? "DATE" : "NGÀY"}
                      </span>
                      <span className="block text-2xl font-extrabold">
                        {s.date.split("-")[2]}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        s.is_online
                          ? "bg-green-900 text-green-300"
                          : "bg-blue-900 text-blue-300"
                      }`}
                    >
                      {s.is_online ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-2 min-h-[56px] line-clamp-2">
                    {lang === "en" ? s.topic_en || s.topic : s.topic}
                  </h4>

                  <div className="space-y-2 mb-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      {s.time_start.slice(0, 5)} - {s.time_end.slice(0, 5)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      {s.is_online
                        ? t("schedule_online")
                        : t("schedule_offline")}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-500" />
                      {s.instructor_name || "TBA"}
                    </div>
                  </div>

                  <button
                    onClick={() => scrollTo("register")}
                    className="w-full py-3 rounded-lg border border-slate-600 hover:bg-white hover:text-slate-900 hover:border-white transition-all font-bold text-sm uppercase tracking-wider"
                  >
                    {t("btn_register_slot")}
                  </button>
                </div>
              ))
            ) : (
              // Empty State
              <div className="col-span-3 text-center py-12 border border-dashed border-slate-700 rounded-2xl">
                <CalendarDays className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  No upcoming classes scheduled yet.
                </p>
              </div>
            )}
          </div>

          {/* INSTRUCTORS SECTION (Simplified inside Schedule) */}
          <div id="instructors" className="border-t border-slate-800 pt-16">
            <h3 className="text-2xl font-bold mb-8 text-amber-400">
              {t("nav_instructors")}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {instructors.map((inst, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700"
                >
                  <img
                    src={
                      inst.avatar ||
                      `https://ui-avatars.com/api/?name=${inst.name}&background=random`
                    }
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-600"
                  />
                  <div>
                    <h4 className="font-bold text-white">{inst.name}</h4>
                    <p className="text-xs text-amber-500 uppercase font-bold tracking-wider">
                      {lang === "en" ? inst.title_en : inst.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- REGISTER FORM --- */}
      <section
        id="register"
        className="py-24 bg-gradient-to-br from-amber-50 to-white"
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t("form_title")}
              </h2>
              <p className="text-slate-400 text-sm">{t("form_desc")}</p>
            </div>
            <form className="p-8 md:p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-500 outline-none"
                    placeholder="Your Full Name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-500 outline-none"
                    placeholder="+84 ..."
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-500 outline-none"
                  placeholder="email@hospital.com"
                />
              </div>
              <button className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all text-lg">
                {t("form_btn")}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-500 text-sm">
        <p>{t("footer_rights")}</p>
      </footer>
    </div>
  );
}

function StatItem({ number, label }) {
  return (
    <div className="text-center p-4 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">
      <div className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-1">
        {number}
      </div>
      <div className="text-slate-300 text-xs md:text-sm font-bold uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
