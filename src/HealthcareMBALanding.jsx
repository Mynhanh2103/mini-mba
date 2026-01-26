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
  Stethoscope,
  FileText,
  Activity,
  HeartPulse,
  ClipboardList,
  Target,
  Microscope,
  Clock,
  Menu,
  X,
  Globe,
  CalendarDays,
  MapPin,
  Lightbulb,
  Megaphone,
  CircleDollarSign,
  LayoutDashboard,
  BrainCircuit,
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
    nav_instructors: "Giảng viên",
    nav_register: "Đăng ký ngay",
    hero_badge: "MINI MBA THỰC CHIẾN CHO BÁC SĨ",
    hero_title: "Quản Trị Bệnh Viện & Phòng Khám Hiện Đại",
    hero_desc:
      "Chương trình 24 giờ chuyển đổi tư duy từ Bác sĩ lâm sàng sang Nhà quản trị chuyên nghiệp. Thực hành trên chính vấn đề của bệnh viện bạn.",
    hero_cta: "Tư vấn lộ trình",
    hero_brochure: "Tải Syllabus",
    stat_hours: "24 Giờ Đào tạo",
    stat_modules: "06 Chuyên đề",
    stat_practice: "70% Thực hành",
    sec_program_title: "Cấu Trúc Chương Trình",
    sec_program_sub:
      "Lộ trình bài bản trang bị bộ công cụ quản trị áp dụng ngay.",
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
    trusted_by: "Đối tác & Bệnh viện đồng hành",
    loading: "Đang tải dữ liệu...",
  },
  en: {
    nav_program: "Curriculum",
    nav_method: "Methodology",
    nav_audience: "Audience",
    nav_instructors: "Experts",
    nav_register: "Register Now",
    hero_badge: "PRACTICAL MINI MBA FOR DOCTORS",
    hero_title: "Modern Hospital & Clinic Management",
    hero_desc:
      "24-hour program transforming mindset from Clinician to Professional Manager. Practice on your own hospital's problems.",
    hero_cta: "Get Consultation",
    hero_brochure: "Download Syllabus",
    stat_hours: "24 Hours",
    stat_modules: "06 Modules",
    stat_practice: "70% Practice",
    sec_program_title: "Program Structure",
    sec_program_sub:
      "A systematic roadmap equipping ready-to-use management tools.",
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
    trusted_by: "Trusted Partners & Hospitals",
    loading: "Loading data...",
  },
};

// --- DATA MẶC ĐỊNH ---
const defaultModules = [
  {
    title: "Buổi 1: Vai trò lãnh đạo & Tư duy quản trị",
    title_en: "Session 1: Leadership Role & Management Mindset",
    description:
      "<ul><li>Chuyển dịch tư duy: Từ Bác sĩ giỏi chuyên môn sang CEO bệnh viện.</li><li>Các phương pháp lãnh đạo và Tư duy hệ thống.</li><li><b>Thực hành:</b> Bài tập 'chuyển vai' quản lý.</li><li><b>Công cụ:</b> Khung năng lực lãnh đạo y tế.</li></ul>",
    description_en:
      "<ul><li>Mindset shift: From Expert Doctor to Hospital CEO.</li><li>Leadership methods and Systems Thinking.</li><li><b>Practice:</b> Role-switching exercises.</li><li><b>Tool:</b> Healthcare Leadership Competency Framework.</li></ul>",
    icon: Users,
  },
  {
    title: "Buổi 2: Chiến lược & Quản trị chất lượng",
    title_en: "Session 2: Strategy & Quality Management",
    description:
      "<ul><li>Khái niệm quản trị chiến lược trong y tế.</li><li>Chất lượng dịch vụ khám chữa bệnh thực chiến.</li><li><b>Thực hành:</b> Xây dựng Canvas chiến lược bệnh viện.</li><li><b>Công cụ:</b> SWOT thực chiến, Balanced Scorecard cho y tế.</li></ul>",
    description_en:
      "<ul><li>Strategic management concepts in healthcare.</li><li>Practical healthcare service quality.</li><li><b>Practice:</b> Building Hospital Strategy Canvas.</li><li><b>Tool:</b> Practical SWOT, Healthcare Balanced Scorecard.</li></ul>",
    icon: Target,
  },
  {
    title: "Buổi 3: Tài chính & Vận hành bệnh viện",
    title_en: "Session 3: Finance & Hospital Operations",
    description:
      "<ul><li>Các chỉ số đo lường tài chính bệnh viện (P&L, Cashflow).</li><li>Quản trị vận hành: Giường bệnh, thời gian chờ, chi phí.</li><li><b>Thực hành:</b> Phân tích báo cáo tài chính giả định/thực tế.</li><li><b>Công cụ:</b> Dashboard vận hành hiệu quả.</li></ul>",
    description_en:
      "<ul><li>Hospital financial metrics (P&L, Cashflow).</li><li>Operations management: Beds, waiting time, costs.</li><li><b>Practice:</b> Analyzing financial reports.</li><li><b>Tool:</b> Operational Efficiency Dashboard.</li></ul>",
    icon: CircleDollarSign,
  },
  {
    title: "Buổi 4: Nhân sự & Văn hóa tổ chức",
    title_en: "Session 4: HR & Organizational Culture",
    description:
      "<ul><li>Quản lý nhân sự và xây dựng văn hóa bệnh viện.</li><li>Giữ chân nhân tài và bác sĩ giỏi.</li><li><b>Thực hành:</b> Role-play xử lý xung đột Bác sĩ – Điều dưỡng – Quản lý.</li><li><b>Công cụ:</b> Khung quản trị nhân sự y tế.</li></ul>",
    description_en:
      "<ul><li>HR management and hospital culture building.</li><li>Retaining talent and top doctors.</li><li><b>Practice:</b> Role-play conflict resolution (Doctor-Nurse-Manager).</li><li><b>Tool:</b> Healthcare HR Framework.</li></ul>",
    icon: HeartPulse,
  },
  {
    title: "Buổi 5: Marketing & Thương hiệu bệnh viện",
    title_en: "Session 5: Marketing & Hospital Branding",
    description:
      "<ul><li>Nguyên lý: Lấy người bệnh làm trung tâm (Patient-centric).</li><li>Xây dựng thương hiệu bệnh viện tại Việt Nam.</li><li><b>Thực hành:</b> Thiết kế hành trình trải nghiệm người bệnh.</li><li><b>Công cụ:</b> Service Blueprint cho dịch vụ y tế.</li></ul>",
    description_en:
      "<ul><li>Principle: Patient-centric approach.</li><li>Building hospital brands in Vietnam.</li><li><b>Practice:</b> Designing Patient Experience Journey.</li><li><b>Tool:</b> Service Blueprint for healthcare.</li></ul>",
    icon: Megaphone,
  },
  {
    title: "Buổi 6: Đổi mới & Quản trị sự thay đổi",
    title_en: "Session 6: Innovation & Change Management",
    description:
      "<ul><li>Chuyển đổi số trong bệnh viện: Telemedicine, AI.</li><li>Quản trị sự thay đổi khi áp dụng công nghệ mới.</li><li><b>Thực hành:</b> Workshop 'Bệnh viện thông minh'.</li><li><b>Công cụ:</b> Change Management Toolkit.</li></ul>",
    description_en:
      "<ul><li>Digital transformation: Telemedicine, AI.</li><li>Managing change when adopting new tech.</li><li><b>Practice:</b> 'Smart Hospital' Workshop.</li><li><b>Tool:</b> Change Management Toolkit.</li></ul>",
    icon: Lightbulb,
  },
];

const methodologyData = [
  {
    icon: LayoutDashboard,
    title_vi: "Case Study Việt Nam",
    title_en: "Vietnam Case Studies",
    desc_vi: "Phân tích tình huống thực tế từ các bệnh viện trong nước.",
    desc_en: "Analyzing real situations from local hospitals.",
  },
  {
    icon: Users,
    title_vi: "Role-Play",
    title_en: "Role-Play",
    desc_vi: "Đóng vai xử lý xung đột và ra quyết định quản lý.",
    desc_en: "Role-playing conflict resolution and decision making.",
  },
  {
    icon: BrainCircuit,
    title_vi: "Action Learning",
    title_en: "Action Learning",
    desc_vi: "Mang vấn đề của chính bệnh viện vào lớp để giải quyết.",
    desc_en: "Bring your own hospital's problems to solve.",
  },
  {
    icon: ClipboardList,
    title_vi: "Toolkit Áp dụng ngay",
    title_en: "Ready-to-use Toolkit",
    desc_vi: "Cung cấp biểu mẫu, quy trình, dashboard mẫu.",
    desc_en: "Providing templates, processes, and sample dashboards.",
  },
];

const audienceData = [
  {
    title_vi: "Bác sĩ Quản lý",
    title_en: "Managerial Doctors",
    desc_vi: "Giám đốc, Trưởng khoa muốn nâng cao năng lực quản trị.",
    desc_en: "Directors, Heads of Dept aiming for management skills.",
  },
  {
    title_vi: "Chủ Phòng khám",
    title_en: "Clinic Owners",
    desc_vi: "Người sáng lập, điều hành phòng khám tư nhân.",
    desc_en: "Founders and operators of private clinics.",
  },
  {
    title_vi: "Nhà Quản trị Y tế",
    title_en: "Healthcare Managers",
    desc_vi: "CEO, COO không chuyên môn y muốn hiểu sâu về ngành.",
    desc_en: "CEOs, COOs wanting deep industry understanding.",
  },
];

export default function HealthcareMBALanding() {
  const { lang, toggleLanguage } = useLanguage();
  const t = (key) => translations[lang][key] || translations["en"][key] || key;
  const toggleLang = () => setLang((prev) => (prev === "en" ? "vi" : "en"));

  // State Data
  const [config, setConfig] = useState(null);
  const [modules, setModules] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FETCH API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sử dụng catch để tránh lỗi crash nếu API 404 hoặc server chưa chạy
        // QUAN TRỌNG: Đường dẫn API đã được sửa để khớp với urls.py (bỏ dấu gạch ngang)
        const [resConfig, resModules, resInst, resSched] = await Promise.all([
          axios
            .get(`${API_BASE}/api/healthcaremba-config/`)
            .catch(() => ({ data: [] })),
          axios
            .get(`${API_BASE}/api/healthcare-modules/`)
            .catch(() => ({ data: [] })),
          axios
            .get(`${API_BASE}/api/healthcare-instructors/`)
            .catch(() => ({ data: [] })),
          axios
            .get(`${API_BASE}/api/healthcare-schedule/`)
            .catch(() => ({ data: [] })),
        ]);

        // Kiểm tra an toàn trước khi set state
        if (
          resConfig.data &&
          Array.isArray(resConfig.data) &&
          resConfig.data.length > 0
        ) {
          setConfig(resConfig.data[0]);
        }

        const sortedModules = (resModules.data || []).sort(
          (a, b) => (a.order || 0) - (b.order || 0),
        );
        setModules(sortedModules);

        setInstructors(resInst.data || []);
        setSchedules(resSched.data || []);
      } catch (err) {
        console.warn("Using default data due to API error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Ưu tiên dữ liệu API, nếu không có thì dùng Default
  const displayModules = modules.length > 0 ? modules : defaultModules;

  // Xử lý icon an toàn
  const getModuleIcon = (module) => {
    if (!module) return BookOpen;
    // Nếu là defaultModules, module.icon là một Component
    if (typeof module.icon === "function" || typeof module.icon === "object") {
      return module.icon;
    }
    // Nếu từ API (thường không trả về icon), dùng BookOpen mặc định
    return BookOpen;
  };

  const heroImage =
    config?.hero_image ||
    "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop";

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">
        {t("loading")}
      </div>
    );

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Stethoscope className="w-8 h-8 text-blue-600 fill-blue-100" />
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              SHS<span className="text-blue-600">.Institute</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 font-medium text-sm text-slate-600 ml-auto mr-6">
            {[
              { id: "program", label: t("nav_program") },
              { id: "instructors", label: t("nav_instructors") },
              { id: "schedule", label: t("sec_schedule_title") },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="hover:text-blue-600 transition-colors uppercase tracking-wide text-xs font-bold"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("register")}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-xs uppercase tracking-wider"
            >
              {t("nav_register")}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage} // Gọi hàm toggle từ Context
              className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-black font-bold border border-gray/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              <Globe size={18} /> {lang === "vi" ? "EN" : "VN"}
            </button>
            <button
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

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
                <button
                  onClick={() => scrollTo("register")}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl mt-2"
                >
                  {t("nav_register")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 -z-20" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-blue-200">
              <Star className="w-3 h-3 fill-blue-600 text-blue-600" />{" "}
              {t("hero_badge")}
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6">
              {/* Check an toàn cho config */}
              {lang === "en"
                ? config?.hero_title_en || t("hero_title")
                : config?.hero_title || t("hero_title")}
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              {lang === "en"
                ? config?.hero_slogan_en || t("hero_desc")
                : config?.hero_slogan || t("hero_desc")}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("register")}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-xl shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                {t("hero_cta")} <ArrowRight className="w-5 h-5" />
              </button>
              <a
                // 1. Logic đường dẫn: Đảm bảo link luôn đúng (có http)
                href="/Thiet ke mini MBA ver 2 - Course outlines.pdf"
                // 2. Thuộc tính kích hoạt tải file
                download="MBA_Healthcare_Syllabus.pdf" // Tên file khi tải về máy
                target="_blank"
                rel="noopener noreferrer"
                // 3. Giao diện: Copy y nguyên từ mẫu bạn gửi (Nút vàng, chữ xanh, bóng đổ)
                className="w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full shadow-xl shadow-yellow-500/30 transition-all transform hover:-translate-y-1 text-lg flex flex-row items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {/* 4. Nội dung & Icon */}
                {t("hero_brochure")}
                <ArrowRight className="w-5 h-5 shrink-0" />
              </a>
            </div>
            <div className="mt-12">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                {/* Bạn nhớ thêm key "trusted_by": "Được tin tưởng bởi" vào biến translations nhé */}
                {t("trusted_by") || "Được tin tưởng bởi"}
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

                {/* Logo Nguyễn Tri Phương */}
                <img
                  src="/logo/bvntp_j1au0x.png" // Thay bằng đường dẫn file thật của bạn
                  alt="Nguyen Tri Phuong"
                  className="h-12 w-auto object-contain hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/120x50?text=NTP+Hospital";
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
                alt="Healthcare Management"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-400 rounded-full blur-2xl opacity-50 -z-10" />
          </motion.div>
        </div>
      </header>

      {/* STATS */}
      <section className="bg-slate-900 py-12 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          <StatItem number="24h" label={t("stat_hours")} />
          <StatItem number="06" label={t("stat_modules")} />
          <StatItem number="70%" label={t("stat_practice")} />
          <StatItem number="Mini MBA" label="Certificate" />
        </div>
      </section>

      {/* PROGRAM STRUCTURE */}
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
                  key={mod.id || idx}
                  onClick={() => setActiveModule(idx)}
                  className={`p-5 rounded-xl cursor-pointer border-2 transition-all duration-300 flex items-center gap-4 group ${
                    activeModule === idx
                      ? "bg-white border-blue-400 shadow-xl scale-102"
                      : "bg-white border-transparent hover:border-slate-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      activeModule === idx
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"
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
                      activeModule === idx ? "-rotate-90 text-blue-600" : ""
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {displayModules.length > 0 && displayModules[activeModule] && (
                  <motion.div
                    key={displayModules[activeModule].id || activeModule}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-2xl h-full relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                        {/* SỬA LỖI ICON: Render an toàn */}
                        {(() => {
                          const IconComp = getModuleIcon(
                            displayModules[activeModule],
                          );
                          return <IconComp size={28} />;
                        })()}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {lang === "en"
                          ? displayModules[activeModule].title_en ||
                            displayModules[activeModule].title
                          : displayModules[activeModule].title}
                      </h3>
                      <div className="w-16 h-1 bg-blue-600 rounded-full mb-6"></div>

                      <div
                        className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html:
                            lang === "en"
                              ? displayModules[activeModule].description_en ||
                                displayModules[activeModule].description ||
                                ""
                              : displayModules[activeModule].description || "",
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY & AUDIENCE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-600" />{" "}
                {t("sec_method_title")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {methodologyData.map((m, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
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

      {/* SCHEDULE */}
      <section id="schedule" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                {t("sec_schedule_title")}
              </h2>
              <p className="text-slate-400">
                Join the upcoming cohort to upgrade your hospital management
                skills.
              </p>
            </div>
            <button
              onClick={() => scrollTo("register")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
            >
              {t("nav_register")}
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {schedules.length > 0 ? (
              schedules.map((s, i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors p-3 rounded-xl text-center min-w-[70px]">
                      <span className="block text-xs font-bold uppercase tracking-wider">
                        {lang === "en" ? "DATE" : "NGÀY"}
                      </span>
                      <span className="block text-2xl font-extrabold">
                        {s.date ? s.date.split("-")[2] : "01"}
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
                      <Clock className="w-4 h-4 text-blue-500" />
                      {s.time_start?.slice(0, 5)} - {s.time_end?.slice(0, 5)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {s.is_online
                        ? t("schedule_online")
                        : t("schedule_offline")}
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
              <div className="col-span-3 text-center py-12 border border-dashed border-slate-700 rounded-2xl">
                <CalendarDays className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  No upcoming classes scheduled yet.
                </p>
              </div>
            )}
          </div>

          {/* INSTRUCTORS */}
          <div id="instructors" className="border-t border-slate-800 pt-16">
            <h3 className="text-2xl font-bold mb-8 text-blue-400">
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
                    <p className="text-xs text-blue-400 uppercase font-bold tracking-wider">
                      {lang === "en" ? inst.title_en : inst.title}
                    </p>
                  </div>
                </div>
              ))}
              {instructors.length === 0 && (
                <div className="col-span-4 text-center text-slate-500">
                  Instructor list updating...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* REGISTER FORM */}
      <section
        id="register"
        className="py-24 bg-gradient-to-br from-blue-50 to-white"
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
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="Your Full Name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="email@hospital.com"
                />
              </div>
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all text-lg">
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
      {/* Đảm bảo number và label luôn là string hoặc component hợp lệ */}
      <div className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-1">
        {number}
      </div>
      <div className="text-slate-300 text-xs md:text-sm font-bold uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
