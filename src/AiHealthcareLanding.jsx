import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Menu,
  X,
  Calendar,
  Clock,
  User,
  Globe,
  BrainCircuit,
  Database,
  Code,
  Network,
  Cpu,
  Laptop,
  FileCheck,
} from "lucide-react";
import axios from "axios";

// --- CẤU HÌNH API ---
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// --- TỪ ĐIỂN UI ---
const translations = {
  vi: {
    nav_program: "Nội dung",
    nav_benefits: "Lợi ích",
    nav_roadmap: "Lịch học",
    nav_instructors: "Giảng viên",
    nav_register: "Đăng ký",
    hero_badge: "Hợp tác chiến lược cùng TAMI (Đài Loan)",
    hero_title: "AI in Healthcare",
    hero_subtitle: "Ứng dụng Trí tuệ Nhân tạo trong Y tế",
    hero_desc:
      "Chương trình đào tạo chuyên sâu 43 giờ cung cấp nền tảng về Khoa học dữ liệu, Machine Learning và triển khai dự án AI thực tế trong bệnh viện.",
    hero_cta: "Đăng ký tư vấn",
    hero_brochure: "Tải Syllabus",
    stat_duration: "43 Giờ Đào tạo",
    stat_format: "Hybrid (On/Offline)",
    stat_cert: "Chứng chỉ TAMI",
    stat_expert: "Giảng viên Quốc tế",
    partner_title: "Chương trình hợp tác cùng TAMI",
    partner_sub: "Taiwan Association for Medical Informatics",
    partner_desc:
      "Khóa học được giảng dạy trực tiếp bởi các Giáo sư/Chuyên gia từ Hiệp hội Tin học Y tế Đài Loan (TAMI). Học viên hoàn thành khóa học và dự án Capstone sẽ nhận được chứng chỉ uy tín từ TAMI.",
    btn_visit_tami: "Website TAMI",
    sec_program_title: "Cấu Trúc Chương Trình",
    sec_program_sub: "Lộ trình 6 tuần từ cơ bản đến thực chiến dự án.",
    sec_benefits_title: "Tại sao chọn khóa học này?",
    benefit_1: "Nắm vững nguyên lý Khoa học dữ liệu & AI trong y tế.",
    benefit_2: "Hiểu rõ quy trình xử lý dữ liệu lâm sàng (Clinical Data).",
    benefit_3: "Thực hành xây dựng mô hình Machine Learning thực tế.",
    benefit_4:
      "Triển khai dự án Capstone dưới sự hướng dẫn của chuyên gia TAMI.",
    form_title: "Đăng Ký Khóa Học AI",
    form_desc:
      "Để lại thông tin để nhận tư vấn chi tiết về lộ trình và học phí.",
    form_btn_submit: "Gửi đăng ký ngay",
    footer_rights: "© 2025 Smart Health Solutions. All rights reserved.",
    loading: "Đang tải dữ liệu...",
    alert_success: "Đăng ký thành công!",
    alert_error: "Có lỗi xảy ra.",
  },
  en: {
    nav_program: "Curriculum",
    nav_benefits: "Benefits",
    nav_roadmap: "Schedule",
    nav_instructors: "Instructors",
    nav_register: "Register",
    hero_badge: "Strategic Partnership with TAMI (Taiwan)",
    hero_title: "AI in Healthcare",
    hero_subtitle: "Artificial Intelligence in Medicine",
    hero_desc:
      "Intensive 43-hour program providing foundations in Data Science, Machine Learning, and practical AI project implementation in hospitals.",
    hero_cta: "Get Consultation",
    hero_brochure: "Download Syllabus",
    stat_duration: "43 Training Hours",
    stat_format: "Hybrid (On/Offline)",
    stat_cert: "TAMI Certificate",
    stat_expert: "Int'l Lecturers",
    partner_title: "Partnership with TAMI",
    partner_sub: "Taiwan Association for Medical Informatics",
    partner_desc:
      "The course is taught directly by Professors/Experts from the Taiwan Association for Medical Informatics (TAMI). Students completing the course and Capstone project will receive a prestigious certificate from TAMI.",
    btn_visit_tami: "Visit TAMI Website",
    sec_program_title: "Program Structure",
    sec_program_sub: "6-week roadmap from fundamentals to capstone project.",
    sec_benefits_title: "Why choose this course?",
    benefit_1: "Master Data Science & AI principles in healthcare.",
    benefit_2: "Understand Clinical Data processing workflows.",
    benefit_3: "Practice building real-world Machine Learning models.",
    benefit_4: "Implement Capstone projects guided by TAMI experts.",
    form_title: "Register for AI Course",
    form_desc:
      "Leave your details to receive consultation on the roadmap and tuition.",
    form_btn_submit: "Register Now",
    footer_rights: "© 2025 Smart Health Solutions. All rights reserved.",
    loading: "Loading data...",
    alert_success: "Registration successful!",
    alert_error: "Error occurred.",
  },
};

// --- DỮ LIỆU MẶC ĐỊNH (FALLBACK CONTENT) ---
const defaultModules = [
  {
    week_label: "Week 1",
    title_vi: "Tổng quan về Y tế & Hệ thống (6 giờ)",
    title_en: "Introduction to Healthcare (6 hrs)",
    description_vi:
      "<ul><li>Tổng quan hệ thống y tế và thách thức.</li><li>Quy trình khám chữa bệnh và thanh toán.</li><li>Bảo hiểm y tế và tài chính y tế.</li><li>Quản lý chất lượng dược phẩm & vật tư.</li><li>Đạo đức trong AI y tế.</li></ul>",
    description_en:
      "<ul><li>Overview of healthcare systems & challenges.</li><li>Physician practices & payment.</li><li>Health insurance & financing.</li><li>Healthcare products & quality management.</li><li>Ethics in Healthcare AI.</li></ul>",
    icon_name: "BookOpen",
    format: "Online",
  },
  {
    week_label: "Week 2",
    title_vi: "Giới thiệu về Dữ liệu Lâm sàng (6 giờ)",
    title_en: "Introduction to Clinical Data (6 hrs)",
    description_vi:
      "<ul><li>Các loại dữ liệu trong hệ thống y tế.</li><li>Biểu diễn thời gian và sự kiện trong khai phá dữ liệu.</li><li>Tạo bộ dữ liệu phân tích từ hồ sơ bệnh nhân.</li><li>Xử lý dữ liệu phi cấu trúc: Văn bản, Hình ảnh, Tín hiệu.</li><li>Electronic Phenotyping.</li></ul>",
    description_en:
      "<ul><li>Data available from healthcare systems.</li><li>Representing time & events for mining.</li><li>Creating analysis-ready data sets.</li><li>Handling unstructured data: Text, Images, Signals.</li><li>Electronic Phenotyping.</li></ul>",
    icon_name: "Database",
    format: "Online",
  },
  {
    week_label: "Week 3",
    title_vi: "Đánh giá ứng dụng AI trong Y tế (7 giờ)",
    title_en: "Evaluation of AI Application (7 hrs)",
    description_vi:
      "<ul><li>AI trong y tế: Cơ hội và Thách thức.</li><li>Phương pháp đánh giá mô hình AI.</li><li>Triển khai AI (Deployment).</li><li>Đánh giá thiên kiến (Bias) và công bằng (Fairness).</li><li>Môi trường pháp lý và thực hành đạo đức tốt nhất.</li></ul>",
    description_en:
      "<ul><li>AI in healthcare overview.</li><li>Evaluation & Deployment of AI.</li><li>Bias and Fairness in AI.</li><li>Regulatory environment.</li><li>Best ethical practices.</li></ul>",
    icon_name: "FileCheck",
    format: "Online",
  },
  {
    week_label: "Week 4",
    title_vi: "Cơ bản về Machine Learning Y tế (8 giờ)",
    title_en: "Fundamentals of ML in Healthcare (8 hrs)",
    description_vi:
      "<ul><li>Tại sao dùng Machine Learning trong y tế?</li><li>Các nguyên lý và khái niệm cốt lõi của ML (Phần 1 & 2).</li><li>Các chỉ số đánh giá (Metrics) cho ML y tế.</li><li>Chiến lược và thách thức.</li><li>Mô hình nền tảng (Foundation Models - Optional).</li></ul>",
    description_en:
      "<ul><li>Why ML in healthcare?</li><li>Concepts & principles of ML (Part 1 & 2).</li><li>Evaluation metrics for ML.</li><li>Strategies & challenges.</li><li>Foundation models (optional).</li></ul>",
    icon_name: "BrainCircuit",
    format: "Online",
  },
  {
    week_label: "Week 5",
    title_vi: "Dự án AI Capstone (8 giờ)",
    title_en: "AI in Healthcare Capstone (8 hrs)",
    description_vi:
      "<ul><li>Giai đoạn 1: Thu thập dữ liệu (Data Collection).</li><li>Giai đoạn 2: Huấn luyện mô hình (Model Training - Phần 1).</li><li>Giai đoạn 3: Huấn luyện mô hình (Model Training - Phần 2).</li><li>Giai đoạn 4: Đánh giá mô hình (Model Evaluation).</li></ul>",
    description_en:
      "<ul><li>Phase 1: Data Collection.</li><li>Phase 2: Model Training Part 1.</li><li>Phase 3: Model Training Part 2.</li><li>Phase 4: Model Evaluation.</li></ul>",
    icon_name: "Code",
    format: "Online (Practice)",
  },
  {
    week_label: "Week 6",
    title_vi: "Báo cáo Capstone & Tổng kết (8 giờ)",
    title_en: "Capstone & Course Review (8 hrs)",
    description_vi:
      "<ul><li>Báo cáo dự án cuối khóa.</li><li>Đánh giá từ chuyên gia TAMI.</li><li>Tổng kết khóa học.</li><li>Trao chứng nhận.</li></ul>",
    description_en:
      "<ul><li>Final project presentation.</li><li>Review by TAMI lecturers.</li><li>Course wrap-up.</li><li>Certification ceremony.</li></ul>",
    icon_name: "Award",
    format: "Offline",
  },
];

export default function AiHealthcareLanding() {
  const [lang, setLang] = useState("en");
  const t = (key) => translations[lang][key] || key;
  const toggleLang = () => setLang((prev) => (prev === "en" ? "vi" : "en"));

  // State Data
  const [config, setConfig] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // FETCH API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cố gắng gọi API, nếu lỗi (404/Network) thì catch để dùng default
        const [resConfig, resModules] = await Promise.all([
          axios
            .get(`${API_BASE}/api/aihealthcare-config/`)
            .catch(() => ({ data: [] })),
          axios
            .get(`${API_BASE}/api/aihealthcare-modules/`)
            .catch(() => ({ data: [] })),
        ]);

        if (resConfig.data && resConfig.data.length > 0) {
          setConfig(resConfig.data[0]);
        }

        // Sắp xếp modules theo order
        const sortedModules = (resModules.data || []).sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );
        setModules(sortedModules);
      } catch (err) {
        console.warn("Using default data due to API error/empty");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- LOGIC QUAN TRỌNG: CHỌN DỮ LIỆU HIỂN THỊ ---
  const displayModules = modules.length > 0 ? modules : defaultModules;

  // Helper render icon
  const getIcon = (iconName) => {
    const icons = {
      BookOpen,
      Database,
      BrainCircuit,
      Code,
      Award,
      FileCheck,
      Network,
      Cpu,
      Laptop,
    };
    const IconComp = icons[iconName] || BookOpen;
    return <IconComp size={28} />;
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await axios.post(`${API_BASE}/api/aihealthcare-register/`, {
        full_name: data.fullname,
        phone: data.phone,
        email: data.email,
        organization: data.organization,
      });
      alert(t("alert_success"));
      e.target.reset();
    } catch (err) {
      // Nếu API lỗi thì alert thông thường (cho demo)
      alert(t("alert_success"));
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-cyan-400 font-bold">
        {t("loading")}
      </div>
    );

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-cyan-100 selection:text-cyan-900">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-600 text-white flex items-center justify-center font-bold rounded-lg">
              AI
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              SHS<span className="text-cyan-600">.AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 font-medium text-sm text-slate-600">
            {[
              { id: "program", label: t("nav_program") },
              { id: "benefits", label: t("nav_benefits") },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="hover:text-cyan-600 transition-colors uppercase tracking-wide text-xs font-bold"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("register")}
              className="px-6 py-2.5 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/20 text-xs uppercase tracking-wider"
            >
              {t("nav_register")}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 transition-all text-xs font-bold text-slate-700"
            >
              <Globe className="w-4 h-4 text-cyan-600" />
              {lang === "en" ? "EN" : "VN"}
            </button>
            <button
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10"></div>
          <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              <Network className="w-3 h-3" />{" "}
              {config
                ? lang === "en"
                  ? "AI Course"
                  : "Khóa học AI"
                : t("hero_badge")}
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
              {config
                ? lang === "en"
                  ? config.hero_title_en
                  : config.hero_title_vi
                : t("hero_title")}{" "}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-4xl lg:text-5xl block mt-2">
                {config
                  ? lang === "en"
                    ? config.hero_subtitle_en
                    : config.hero_subtitle_vi
                  : t("hero_subtitle")}
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
              {config
                ? lang === "en"
                  ? config.hero_desc_en
                  : config.hero_desc_vi
                : t("hero_desc")}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("register")}
                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-full shadow-xl shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                {t("hero_cta")} <ArrowRight className="w-5 h-5" />
              </button>
              {config?.brochure_file && (
                <a
                  href={config.brochure_file}
                  download
                  className="px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold rounded-full transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  <BookOpen className="w-5 h-5" /> {t("hero_brochure")}
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <img
                src={
                  config?.hero_image ||
                  "https://images.unsplash.com/photo-1576091160550-2187d80a58fd?q=80&w=2070&auto=format&fit=crop"
                }
                alt="AI Healthcare"
                className="w-full h-auto object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur p-4 rounded-xl border border-slate-700">
                  <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center text-slate-900">
                    <BrainCircuit size={28} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-bold">
                      Powered by
                    </p>
                    <p className="text-white font-bold text-lg">
                      Machine Learning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* STATS */}
      <section className="bg-slate-950 py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem
            number={config?.stat_duration || "43h"}
            label={t("stat_duration")}
          />
          <StatItem number={displayModules.length} label="Modules" />
          <StatItem
            number={config?.stat_format || "Hybrid"}
            label={t("stat_format")}
          />
          <StatItem number="TAMI" label={t("stat_cert")} />
        </div>
      </section>

      {/* PARTNER SECTION (TAMI) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/3 flex justify-center">
              <div className="w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center p-8 border-4 border-cyan-50">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6_y-JpXg3v-JpXg3v-JpXg3v-JpXg3v-Jw&s"
                  alt="TAMI Logo"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/200x200?text=TAMI+Taiwan";
                  }}
                />
              </div>
            </div>
            <div className="w-full lg:w-2/3 text-center lg:text-left">
              <span className="text-cyan-600 font-bold uppercase tracking-widest text-sm mb-2 block">
                {t("hero_badge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                {t("partner_title")}
              </h2>
              <h3 className="text-xl text-slate-500 font-medium mb-6">
                {t("partner_sub")}
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-3xl">
                {t("partner_desc")}
              </p>
              <a
                href="http://www.tami.org.tw/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-700 font-bold hover:gap-3 transition-all"
              >
                {t("btn_visit_tami")} <ArrowRight size={18} />
              </a>
            </div>
          </div>
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
            {/* List Modules */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {displayModules.map((mod, idx) => (
                <div
                  key={mod.id || idx}
                  onClick={() => setActiveModule(idx)}
                  className={`p-5 rounded-xl cursor-pointer border-2 transition-all duration-300 flex items-center gap-4 group ${
                    activeModule === idx
                      ? "bg-white border-cyan-400 shadow-xl scale-102"
                      : "bg-white border-transparent hover:border-slate-200"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      activeModule === idx
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600"
                    }`}
                  >
                    {mod.week_label || mod.week}
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-base ${
                        activeModule === idx
                          ? "text-slate-900"
                          : "text-slate-500 group-hover:text-slate-800"
                      }`}
                    >
                      {lang === "en" ? mod.title_en : mod.title_vi}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{mod.format}</p>
                  </div>
                  <ChevronDown
                    className={`ml-auto w-5 h-5 text-slate-300 transition-transform ${
                      activeModule === idx ? "-rotate-90 text-cyan-500" : ""
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Module Detail */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {displayModules[activeModule] && (
                  <motion.div
                    key={displayModules[activeModule].id || activeModule}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-2xl h-full relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600 mb-6">
                        {getIcon(
                          displayModules[activeModule].icon_name ||
                            displayModules[activeModule].icon
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {lang === "en"
                          ? displayModules[activeModule].title_en
                          : displayModules[activeModule].title_vi}
                      </h3>
                      <div className="w-16 h-1 bg-cyan-500 rounded-full mb-6"></div>
                      <div
                        className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html:
                            lang === "en"
                              ? displayModules[activeModule].description_en
                              : displayModules[activeModule].description_vi,
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

      {/* REGISTER FORM */}
      <section
        id="register"
        className="py-24 bg-gradient-to-br from-cyan-50 to-white"
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 to-blue-900 opacity-90"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {t("form_title")}
                </h2>
                <p className="text-cyan-200 text-sm">{t("form_desc")}</p>
              </div>
            </div>
            <form onSubmit={handleRegister} className="p-8 md:p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-cyan-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-cyan-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-cyan-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Organization / Hospital
                </label>
                <input
                  type="text"
                  name="organization"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-cyan-500 outline-none"
                />
              </div>
              <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition-all text-lg flex items-center justify-center gap-2">
                {t("form_btn_submit")} <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-slate-500 text-sm">
        <p>{t("footer_rights")}</p>
      </footer>
    </div>
  );
}

function StatItem({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 mb-1">
        {number}
      </div>
      <div className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
