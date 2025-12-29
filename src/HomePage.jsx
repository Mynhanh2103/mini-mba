import { useNavigate, Link } from "react-router-dom"; // <--- Thêm Link vào đây
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  ChevronDown,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Calendar,
  Clock,
  User,
  Zap,
  Globe,
  ExternalLink,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// --- 1. TỪ ĐIỂN UI ---
const translations = {
  vi: {
    nav_program: "Chương trình",
    nav_benefits: "Lợi ích",
    nav_roadmap: "Lộ trình",
    nav_instructors: "Giảng viên",
    nav_register: "Đăng ký ngay",
    nav_login: "Đăng nhập", // <--- Thêm mới
    cta_register: "Đăng ký ngay",
    nav_consult: "Đăng ký tư vấn",
    partner_badge: "Đối tác: TRAF Academy & EDUPROVED",
    hero_default_1: "Quản Trị",
    hero_default_2: "Chuyển Đổi Số Y Tế",
    hero_desc:
      "Dành cho Lãnh đạo Y tế. Chương trình thực chiến giải quyết Case Study thực tế.",
    btn_brochure: "Nhận Brochure",
    btn_content: "Xem Nội Dung",
    stat_sessions: "Buổi Học (4h/Buổi)",
    stat_format: "Online & Offline",
    stat_case: "Case Study Thực Tế",
    stat_advisor: "Giảng Viên & Cố Vấn",

    // Phần chứng nhận
    cert_badge: "QUYỀN LỢI TỐT NGHIỆP",
    cert_title: "Nhận chứng nhận EDUPROVED quốc tế",
    cert_desc:
      "Cam kết cấp chứng chỉ kiểm định chất lượng từ Thụy Sĩ ngay sau khi học viên hoàn thành khóa học.",

    why_choose: "TẠI SAO CHỌN MINI MBA Y TẾ?",
    benefit_def_title: "Giải quyết bài toán thực tế của bản thân & tổ chức",
    benefit_def_desc:
      "Chương trình Mini MBA Y tế được thiết kế theo mô hình Hybrid linh hoạt.",
    sec_overview: "Tổng Quan Khóa Học",
    sec_overview_sub: "4 Trụ cột kiến thức dành cho nhà quản lý y tế hiện đại.",
    sec_program: "Chương Trình Đào Tạo",
    sec_program_sub:
      "Cấu trúc bài giảng tối ưu hóa sự tương tác và tính thực tiễn.",
    sec_roadmap: "Lộ Trình Đào Tạo Hybrid",
    sec_roadmap_sub: "Lịch học chi tiết",
    sec_instructors: "Đội Ngũ Giảng Viên",
    sec_instructors_sub: "Đến từ đối tác TRAF Academy",
    form_title: "Đăng ký giữ chỗ khóa học",
    form_tuition: "Học phí: 17.000.000 VNĐ",
    form_note: "Bao gồm 10 buổi học, tài liệu và chứng nhận EDUPROVED.",
    form_name: "Họ và tên",
    form_phone: "Số điện thoại",
    form_email: "Email (Công việc)",
    form_submit: "Gửi Đăng Ký",
    proj_grad: "Project Tốt Nghiệp",
    proj_desc: "Giải quyết vấn đề thực tế của học viên.",
    loading: "Đang tải dữ liệu...",
    no_data: "Chưa có dữ liệu.",
    footer: "© 2025 TBI. Bảo lưu mọi quyền.",
  },
  en: {
    nav_program: "Program",
    nav_benefits: "Benefits",
    nav_roadmap: "Roadmap",
    nav_instructors: "Instructors",
    nav_register: "Register Now",
    nav_login: "Login", // <--- Thêm mới
    cta_register: "Register Now",
    nav_consult: "Get Consultation",
    partner_badge: "Partner: TRAF Academy & EDUPROVED",
    hero_default_1: "Healthcare",
    hero_default_2: "Digital Transformation",
    hero_desc:
      "For Healthcare Leaders. Practical program solving real-world Case Studies.",
    btn_brochure: "Get Brochure",
    btn_content: "View Content",
    stat_sessions: "Sessions (4h/Session)",
    stat_format: "Online & Offline",
    stat_case: "Real Case Studies",
    stat_advisor: "Lecturers & Advisors",

    // Phần chứng nhận
    cert_badge: "GRADUATION BENEFIT",
    cert_title: "Receive EDUPROVED Certification",
    cert_desc:
      "Guaranteed international quality certification from Switzerland upon course completion.",

    why_choose: "WHY CHOOSE MINI MBA HEALTHCARE?",
    benefit_def_title: "Solving real problems for yourself & your organization",
    benefit_def_desc:
      "The Mini MBA Healthcare program is designed with a flexible Hybrid model.",
    sec_overview: "Course Overview",
    sec_overview_sub: "4 Pillars of knowledge for modern healthcare managers.",
    sec_program: "Training Program",
    sec_program_sub:
      "Lecture structure optimized for interaction and practicality.",
    sec_roadmap: "Hybrid Training Roadmap",
    sec_roadmap_sub: "Detailed Schedule",
    sec_instructors: "Our Instructors",
    sec_instructors_sub: "From our partner TRAF Academy",
    form_title: "Register for the course",
    form_tuition: "Tuition: 17,000,000 VND",
    form_note: "Includes 10 sessions, materials, and EDUPROVED certification.",
    form_name: "Full Name",
    form_phone: "Phone Number",
    form_email: "Email (Work)",
    form_submit: "Submit Registration",
    proj_grad: "Graduation Project",
    proj_desc: "Solving real-world problems for students.",
    loading: "Loading data...",
    no_data: "No data available.",
    footer: "© 2025 TBI. All rights reserved.",
  },
};

// --- 2. HÀM XỬ LÝ DỮ LIỆU ĐỘNG ---
const getData = (item, field, lang) => {
  if (!item) return "";
  if (lang === "en") {
    const enValue = item[`${field}_en`];
    if (enValue && enValue.trim() !== "") return enValue;
  }
  return item[field];
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

const getOverviewIcon = (type) => {
  const iconClass = "w-8 h-8 text-blue-600";
  switch (type) {
    case "strategy":
      return <TrendingUp className={iconClass} />;
    case "finance":
      return <BookOpen className={iconClass} />;
    case "leadership":
      return <Users className={iconClass} />;
    case "marketing":
      return <Award className={iconClass} />;
    default:
      return <Zap className={iconClass} />;
  }
};

const isDatePassed = (dateString) => {
  if (!dateString) return false;
  try {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const eventDate = new Date(parts[2], parts[1] - 1, parts[0]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate < today;
    }
  } catch (e) {
    return false;
  }
  return false;
};

// --- 3. SUB COMPONENTS ---

const OverviewCard = ({ item, index, lang }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full group"
  >
    <div className="h-48 overflow-hidden bg-gray-100 relative">
      <img
        src={
          item.cover_image
            ? getImageUrl(item.cover_image)
            : "https://placehold.co/600x400?text=Cover"
        }
        alt={getData(item, "title", lang)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
    </div>
    <div className="p-6 md:p-8 flex flex-col flex-grow relative">
      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 shrink-0">
        {getOverviewIcon(item.icon_type)}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
        {getData(item, "title", lang)}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed flex-grow">
        {getData(item, "description", lang)}
      </p>
    </div>
  </motion.div>
);

const FeatureCard = ({ item, index, lang }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group flex flex-col h-full"
  >
    <div className="h-48 overflow-hidden bg-gray-100">
      <img
        src={item.image_url || "https://placehold.co/600x400?text=Module"}
        alt={getData(item, "title", lang)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) =>
          (e.target.src = "https://placehold.co/600x400?text=No+Image")
        }
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {getOverviewIcon(item.icon_type || "default")}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">
        {getData(item, "title", lang)}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed flex-grow">
        {getData(item, "description", lang)}
      </p>
    </div>
  </motion.div>
);

const StatItem = ({ number, label }) => (
  <div className="text-center text-white p-4">
    <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
      {number}
    </div>
    <div className="text-blue-100 text-sm uppercase tracking-wider font-medium">
      {label}
    </div>
  </div>
);

const TimelineRow = ({ item, index, lang }) => {
  const isHoliday = item.item_type === "holiday" || item.item_type === "break";
  const dateDisplay = item.date_str || item.date;
  const isPassed = isDatePassed(dateDisplay);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`relative flex gap-6 pb-8 last:pb-0 ${
        isHoliday ? "opacity-70" : isPassed ? "opacity-50 grayscale" : ""
      }`}
    >
      <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-200 last:hidden"></div>
      <div
        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${
          isHoliday
            ? "bg-red-100 text-red-500"
            : isPassed
            ? "bg-slate-200 text-slate-500"
            : "bg-blue-600 text-white"
        }`}
      >
        {isHoliday ? (
          <Star size={18} />
        ) : isPassed ? (
          <CheckCircle size={18} />
        ) : (
          <Calendar size={18} />
        )}
      </div>
      <div
        className={`flex-grow border-b border-slate-100 pb-8 last:border-0 ${
          isHoliday ? "pt-2" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <span
            className={`text-sm font-bold tracking-wide px-3 py-1 rounded-full w-fit ${
              isHoliday
                ? "bg-red-100 text-red-600"
                : isPassed
                ? "bg-slate-100 text-slate-500"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {dateDisplay}
          </span>
          {!isHoliday && (
            <span className="flex items-center gap-1 text-xs text-slate-400 uppercase font-semibold">
              <Clock size={14} /> {item.duration || "09:00 - 16:30"}
            </span>
          )}
        </div>
        <h3
          className={`text-lg font-bold ${
            isHoliday
              ? "text-red-500 italic"
              : isPassed
              ? "text-slate-500 line-through"
              : "text-slate-900"
          }`}
        >
          {getData(item, "topic", lang)}
        </h3>
        {!isHoliday && item.prof_name && (
          <div className="flex items-center gap-2 mt-2 text-slate-600 text-sm">
            <User
              size={16}
              className={isPassed ? "text-slate-400" : "text-yellow-500"}
            />
            <span className="font-medium">{item.prof_name}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- 4. MAIN APP ---

export default function HomePage() {
  const [lang, setLang] = useState("vi");
  //const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = (key) => translations[lang][key] || key;
  const toggleLang = () => setLang((prev) => (prev === "vi" ? "en" : "vi"));

  const [modules, setModules] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [overviews, setOverviews] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchAPI = async (endpoint, setter) => {
          const res = await fetch(`${BASE_URL}/api/${endpoint}/`);
          if (res.ok) setter(await res.json());
        };
        await Promise.all([
          fetchAPI("modules", setModules),
          fetchAPI("schedule", setSchedule),
          fetchAPI("instructors", setInstructors),
          fetchAPI("overviews", setOverviews),
          fetchAPI("config", (data) => {
            if (data && data.length > 0) setConfig(data[0]);
          }),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = {
      full_name: e.target.fullname.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      position: "Học viên",
    };
    try {
      const res = await fetch(`${BASE_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert(
          lang === "vi" ? "Đăng ký thành công!" : "Registration successful!"
        );
        e.target.reset();
      } else {
        alert("Error.");
      }
    } catch (err) {
      alert("Server Error.");
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      setIsOpen(false);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const defaultBenefits = [
    "Học theo mô hình Hybrid – linh hoạt & hiệu quả",
    "Lý thuyết cô đọng – tập trung vào kiến thức áp dụng được ngay",
    "Case Study thực tế – học qua tình huống thật",
    "Project cuối khóa mang tính ứng dụng cao",
  ];
  const benefitsRaw = getData(config, "benefits_list", lang);
  const benefitsList = benefitsRaw ? benefitsRaw.split("\n") : defaultBenefits;

  const navItems = [
    { id: "chuong-trinh", label: t("nav_program") },
    { id: "loi-ich", label: t("nav_benefits") },
    { id: "lo-trinh", label: t("nav_roadmap") },
    { id: "giang-vien", label: t("nav_instructors") },
    { id: "/research", label: "Thư viện", type: "link" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 bg-blue-900 text-white flex items-center justify-center font-bold text-xl rounded-lg shadow-lg">
              T
            </div>
            <span
              className={`font-extrabold text-2xl tracking-tight ${
                scrolled ? "text-blue-900" : "text-white"
              }`}
            >
              TBI<span className="font-light">.Institute</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div
            className={`hidden md:flex items-center gap-8 text-sm font-medium ${
              scrolled ? "text-slate-600" : "text-white/90"
            }`}
          >
            {navItems.map((item) =>
              item.type === "link" ? (
                // Nếu là Link (như Thư viện) -> Dùng thẻ Link chuyển trang
                <Link
                  key={item.id}
                  to={item.id}
                  className="hover:text-yellow-500 transition uppercase tracking-wide"
                >
                  {item.label}
                </Link>
              ) : (
                // Nếu là Scroll (như Lợi ích, Lộ trình) -> Dùng onClick scroll
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="hover:text-yellow-500 transition uppercase tracking-wide"
                >
                  {item.label}
                </button>
              )
            )}
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 border border-current px-3 py-1 rounded-full hover:bg-white/10 transition font-bold"
            >
              <Globe size={16} /> {lang === "vi" ? "EN" : "VN"}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* [MỚI] NÚT ĐĂNG NHẬP */}
            <Link
              to="/login"
              className="px-5 py-2 bg-white hover:bg-gray-100 text-blue-900 font-bold rounded-full transition-transform active:scale-95 text-sm shadow-lg"
            >
              {t("nav_login")}
            </Link>

            {/* Nút Đăng ký ngay (Giữ nguyên) */}
            <button
              onClick={() => scrollToSection("dang-ky")}
              className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full transition-transform active:scale-95 text-sm shadow-lg shadow-yellow-500/20"
            >
              {t("cta_register")}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden gap-4 items-center">
            <button
              onClick={toggleLang}
              className={`flex items-center gap-1 font-bold ${
                scrolled ? "text-slate-900" : "text-white"
              }`}
            >
              {lang === "vi" ? "EN" : "VN"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${scrolled ? "text-slate-900" : "text-white"}`}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="flex flex-col p-6 gap-4 text-slate-700 font-medium">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    className="text-left uppercase"
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="p-4 border-t border-slate-700 flex flex-col gap-3">
                  {/* [MỚI] Link Đăng nhập Mobile */}
                  <Link
                    to="/login"
                    className="w-full py-3 text-center text-slate-300 font-bold border border-slate-600 rounded-xl hover:bg-slate-700 hover:text-white transition-all"
                  >
                    Đăng nhập hệ thống
                  </Link>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      scrollToSection("dang-ky");
                    }}
                    className="w-full py-3 bg-yellow-500 text-blue-900 font-bold rounded-xl"
                  >
                    {t("cta_register")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <header className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover"
            alt="Meeting"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/80 to-blue-900/40"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-yellow-400 text-sm font-bold mb-6 tracking-wider uppercase">
              {t("partner_badge")}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              {getData(config, "hero_title", lang) || t("hero_default_1")}{" "}
              <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                {getData(config, "hero_subtitle", lang) || t("hero_default_2")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
              {t("hero_desc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection("dang-ky")}
                className="w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full shadow-xl shadow-yellow-500/30 transition-all transform hover:-translate-y-1 text-lg flex flex-row items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {t("btn_brochure")}
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>
              <button
                onClick={() => scrollToSection("chuong-trinh")}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-bold rounded-full"
              >
                {t("btn_content")}
              </button>
            </div>
          </motion.div>
        </div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </header>

      {/* STATS */}
      <section className="py-10 bg-blue-900 relative -mt-2">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-blue-800/50">
          <StatItem
            number={config?.stat_1 || "10"}
            label={t("stat_sessions")}
          />
          <StatItem
            number={config?.stat_2 || "Hybrid"}
            label={t("stat_format")}
          />
          <StatItem number={config?.stat_3 || "100%"} label={t("stat_case")} />
          <StatItem
            number={config?.stat_4 || "TRAF"}
            label={t("stat_advisor")}
          />
        </div>
      </section>

      {/* --- [MỚI] DẢI CHỨNG NHẬN EDUPROVED (TRUST SECTION) --- */}
      <section className="bg-gradient-to-r from-yellow-50 via-white to-yellow-50 border-b border-yellow-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 text-center md:text-left">
            {/* Cụm Logo Huy chương (Đã thay icon bằng ảnh Logo và bỏ khung đỏ) */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 bg-white rounded-full shadow-lg border-2 border-yellow-400 flex items-center justify-center overflow-hidden p-3">
                <img
                  src="/logo/eduPROVED-1000.png"
                  alt="Eduproved Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.target.style.display = "none")} // Ẩn nếu lỗi ảnh
                />
              </div>
            </div>

            {/* Phần nội dung chữ */}
            <div className="flex-grow max-w-2xl">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1 flex items-center justify-center md:justify-start gap-2">
                <CheckCircle size={14} />
                {t("cert_badge")}
              </div>

              <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2">
                {t("cert_title")}
              </h3>

              <p className="text-slate-600 font-medium leading-relaxed">
                {t("cert_desc")}
              </p>
            </div>

            {/* Nút Verify */}
            <a
              href="https://www.eduproved.org/zertifizierung/#"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 group flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-bold text-sm"
            >
              Verify Certification
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="loi-ich" className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative">
            <img
              src="/images/z.jpg"
              className="relative rounded-3xl shadow-2xl z-10 w-full object-cover"
              alt="Medical Management"
            />
          </div>

          <div className="relative z-10">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm block mb-2">
              {t("why_choose")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight whitespace-pre-line">
              {getData(config, "benefit_title", lang) || t("benefit_def_title")}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              {getData(config, "benefit_desc", lang) || t("benefit_def_desc")}
            </p>
            <ul className="space-y-5">
              {benefitsList.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-slate-700 font-medium"
                >
                  <CheckCircle className="text-yellow-500 w-5 h-5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
              {t("sec_overview")}
            </h2>
            <p className="text-slate-600 text-lg">{t("sec_overview_sub")}</p>
          </div>
          {loading ? (
            <div className="text-center">{t("loading")}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {overviews.map((item, index) => (
                <OverviewCard
                  key={item.id || index}
                  item={item}
                  index={index}
                  lang={lang}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROGRAM */}
      <section id="chuong-trinh" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
              {t("sec_program")}
            </h2>
            <p className="text-slate-600">{t("sec_program_sub")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, index) => (
              <FeatureCard
                key={mod.id || index}
                item={mod}
                index={index}
                lang={lang}
              />
            ))}
            <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center text-center h-full">
              <Award className="w-12 h-12 mb-4 text-yellow-300" />
              <h3 className="text-xl font-bold mb-2">{t("proj_grad")}</h3>
              <p className="text-blue-100 text-sm">{t("proj_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="lo-trinh" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold uppercase text-sm">
              {t("sec_roadmap_sub")}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-4">
              {t("sec_roadmap")}
            </h2>
          </div>
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 shadow-inner border border-slate-100">
            <div className="pl-2 md:pl-4">
              {schedule.length > 0 ? (
                schedule.map((item, index) => (
                  <TimelineRow
                    key={item.id || index}
                    item={item}
                    index={index}
                    lang={lang}
                  />
                ))
              ) : (
                <p className="text-center">{t("no_data")}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INSTRUCTORS */}
      <section id="giang-vien" className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">
              {t("sec_instructors")}
            </h2>
            <p className="text-slate-600 mt-2">{t("sec_instructors_sub")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {instructors.map((inst, index) => (
              <div
                key={inst.id || index}
                className="bg-white p-6 rounded-2xl shadow-sm text-center border border-slate-100"
              >
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src={
                      getImageUrl(inst.image) ||
                      inst.image_url ||
                      "https://placehold.co/150x150"
                    }
                    alt={inst.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg text-slate-900">
                  {getData(inst, "title", lang)} {inst.name}
                </h3>
                <p className="text-blue-600 text-sm font-medium mt-1">
                  {getData(inst, "position", lang)}
                </p>
                <p className="text-slate-500 text-xs mt-2 line-clamp-2">
                  {getData(inst, "description", lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTER */}
      <section
        id="dang-ky"
        className="py-24 bg-gradient-to-br from-blue-900 to-slate-900 text-white"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h3 className="text-3xl font-bold mb-4 text-center">
              {t("form_title")}
            </h3>
            <div className="text-center mb-6">
              <div className="text-yellow-400 text-2xl font-bold mb-2">
                {t("form_tuition")}
              </div>
              <p className="text-blue-200">{t("form_note")}</p>
            </div>
            <form
              onSubmit={handleRegister}
              className="grid md:grid-cols-2 gap-6 mt-8"
            >
              <input
                type="text"
                name="fullname"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30"
                placeholder={t("form_name")}
              />
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30"
                placeholder={t("form_phone")}
              />
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 md:col-span-2"
                placeholder={t("form_email")}
              />
              <button
                type="submit"
                className="md:col-span-2 w-full bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition mt-2"
              >
                {t("form_submit")}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-center">
        <p>{getData(config, "footer_text", lang) || t("footer")}</p>
      </footer>
    </div>
  );
}
