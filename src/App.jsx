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
} from "lucide-react";
import finance from "./assets/finance-economics-work-male-discussion-laptop.jpg";
// --- DỮ LIỆU MÔ PHỎNG (Nội dung chuẩn Mini MBA - CBI Style) ---
const MODULES = [
  {
    id: 1,
    title: "Tư duy & Hoạch định Chiến lược",
    icon: <TrendingUp className="w-6 h-6" />,
    desc: "Nắm vững quy trình xây dựng chiến lược, từ phân tích môi trường kinh doanh đến thiết lập lợi thế cạnh tranh bền vững.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Quản trị Tài chính dành cho Lãnh đạo",
    icon: <BookOpen className="w-6 h-6" />,
    desc: "Đọc hiểu báo cáo tài chính, quản trị dòng tiền và ra quyết định đầu tư thông minh mà không cần là chuyên gia kế toán.",
    img: finance,
  },
  {
    id: 3,
    title: "Nghệ thuật Lãnh đạo & Quản trị Nhân sự",
    icon: <Users className="w-6 h-6" />,
    desc: "Kỹ năng thu phục nhân tâm, xây dựng văn hóa doanh nghiệp và tối ưu hóa hiệu suất đội ngũ.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Marketing & Sales Thời đại số",
    icon: <Award className="w-6 h-6" />,
    desc: "Xây dựng thương hiệu, thấu hiểu khách hàng và các chiến lược tăng trưởng doanh thu đột phá.",
    img: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80",
  },
];

// --- DỮ LIỆU LỊCH TRÌNH (Từ file Excel) ---
const SCHEDULE_ITEMS = [
  {
    date: "06/12/2025",
    topic: "Healthcare Digitalization",
    prof: "Prof. Volker Schulte",
    type: "class",
  },
  {
    date: "13/12/2025",
    topic: "Change Management",
    prof: "Ms. Kathrin Gass",
    type: "class",
  },
  {
    date: "20/12/2025",
    topic: "Process Optimization",
    prof: "Ms. Kathrin Gass",
    type: "class",
  },
  {
    date: "27/12/2025",
    topic: "Nghỉ Đông / Winter Break",
    prof: "",
    type: "break",
  },
  /*{
    date: "03/01/2026",
    topic: "Crisis and Conflict Management",
    prof: "Ms. Kathrin Gass",
    type: "class",
  },*/
  {
    date: "10/01/2026",
    topic: "Crisis and conflict management",
    prof: "Ms. Kathrin Gass",
    type: "class",
  },
  {
    date: "17/01/2026",
    topic: "Entrepreneurial business models in healthcare",
    prof: "Prof. Dieter Reineke",
    type: "class",
  },
  {
    date: "24/01/2026",
    topic: "Effective Communication",
    prof: "Ms. Kathrin Gass",
    type: "class",
  },
  {
    date: "31/01/2026",
    topic: "How to Launch a Startup in Healthcare",
    prof: "Prof. Dieter Reineke",
    type: "class",
  },
  {
    date: "07/02/2026",
    topic: "AI in Hospital Management",
    prof: "Prof. Volker Schulte",
    type: "class",
  },
  {
    date: "14/02/2026",
    topic: "Nghỉ Tết Nguyên Đán (Dự kiến)",
    prof: "",
    type: "holiday",
  },
  {
    date: "07/03/2026",
    topic: "Leadership and Positive Psychology at Work",
    prof: "Prof. Volker Schulte",
    type: "class",
  },
  {
    date: "14/03/2026",
    topic: "Healthcare Data Management",
    prof: "Prof. Volker Schulte",
    type: "class",
  },
];

// --- COMPONENT CON ---

const FeatureCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
  >
    <div className="h-48 overflow-hidden">
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <div className="p-6">
      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {item.icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
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

const TimelineRow = ({ item, index }) => {
  const isHoliday = item.type === "holiday" || item.type === "break";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`relative flex gap-6 pb-8 last:pb-0 ${
        isHoliday ? "opacity-70" : ""
      }`}
    >
      {/* Đường nối dọc */}
      <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-200 last:hidden"></div>

      {/* Icon tròn */}
      <div
        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm 
        ${isHoliday ? "bg-red-100 text-red-500" : "bg-blue-600 text-white"}`}
      >
        {isHoliday ? <Star size={18} /> : <Calendar size={18} />}
      </div>

      {/* Nội dung bên phải */}
      <div
        className={`flex-grow border-b border-slate-100 pb-8 last:border-0 ${
          isHoliday ? "pt-2" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <span
            className={`text-sm font-bold tracking-wide px-3 py-1 rounded-full w-fit 
            ${
              isHoliday ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-700"
            }`}
          >
            {item.date}
          </span>
          {!isHoliday && (
            <span className="flex items-center gap-1 text-xs text-slate-400 uppercase font-semibold">
              <Clock size={14} /> 09:00 - 16:30
            </span>
          )}
        </div>

        <h3
          className={`text-lg font-bold ${
            isHoliday ? "text-red-500 italic" : "text-slate-900"
          }`}
        >
          {item.topic}
        </h3>

        {!isHoliday && (
          <div className="flex items-center gap-2 mt-2 text-slate-600 text-sm">
            <User size={16} className="text-yellow-500" />
            <span className="font-medium">{item.prof}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Đóng menu mobile nếu đang mở
      setIsMenuOpen(false);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* --- NAVIGATION --- */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
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

          <div
            className={`hidden md:flex gap-8 text-sm font-medium ${
              scrolled ? "text-slate-600" : "text-white/90"
            }`}
          >
            <a
              href="#chuong-trinh"
              className="hover:text-yellow-500 transition"
            >
              Chương trình
            </a>
            <a href="#loi-ich" className="hover:text-yellow-500 transition">
              Lợi ích
            </a>
            <a href="#lo-trinh" className="hover:text-yellow-500 transition">
              Lộ trình
            </a>
            <a href="#giang-vien" className="hover:text-yellow-500 transition">
              Giảng viên
            </a>
          </div>

          <button className="hidden md:block bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-6 py-2 rounded-full transition-transform transform active:scale-95 shadow-lg shadow-yellow-500/30">
            Đăng ký ngay
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden ${
              scrolled ? "text-slate-900" : "text-white"
            }`}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="flex flex-col p-6 gap-4 text-slate-700 font-medium">
                <a href="#chuong-trinh" onClick={() => setIsMenuOpen(false)}>
                  Chương trình
                </a>
                <a href="#loi-ich" onClick={() => setIsMenuOpen(false)}>
                  Lợi ích
                </a>
                <a href="#lo-trinh" onClick={() => setIsMenuOpen(false)}>
                  Lộ trình
                </a>
                <button className="bg-blue-900 text-white py-3 rounded-lg font-bold">
                  Đăng ký tư vấn
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover"
            alt="Business Meeting"
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
              Chương trình đào tạo quản lý cấp cao
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Mini MBA <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                Quản Trị Y Tế Thực Chiến
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              Dành riêng cho Lãnh đạo Bệnh viện, Quản lý Y tế và Startup. Cô
              đọng kiến thức MBA quốc tế trong 3 tháng.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* NÚT ĐÃ ĐƯỢC KÍCH HOẠT */}
              <button
                onClick={() => scrollToSection("dang-ky")}
                className="w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full shadow-xl shadow-yellow-500/30 transition-all transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                Nhận Brochure <ArrowRight className="w-5 h-5" />
              </button>

              {/* NÚT ĐÃ ĐƯỢC KÍCH HOẠT */}
              <button
                onClick={() => scrollToSection("chuong-trinh")}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-bold rounded-full transition-all text-lg cursor-pointer"
              >
                Xem Nội Dung
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

      {/* --- STATS SECTION --- */}
      <section className="py-10 bg-blue-900 relative -mt-2">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-blue-800/50">
          <StatItem number="12" label="Buổi Học Chuyên Sâu" />
          <StatItem number="500+" label="Học Viên Y Tế" />
          <StatItem number="100%" label="Giảng Viên Quốc Tế" />
          <StatItem number="4.9" label="Đánh Giá Hài Lòng" />
        </div>
      </section>

      <section id="loi-ich" className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Cột hình ảnh - Đã xử lý bao quanh */}
          <div className="relative">
            {/* Blobs trang trí */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-200 rounded-full opacity-50 blur-2xl z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl z-0"></div>

            {/* Ảnh chính */}
            <img
              src="/images/team-doctors-meeting.jpg"
              className="relative rounded-3xl shadow-2xl z-10 w-full object-cover"
              alt="Medical Management"
            />

            {/* Floating Card - Giữ nguyên nhưng đảm bảo Z-index cao hơn */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-4 md:-bottom-10 md:-left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs z-20 hidden md:block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <CheckCircle size={20} />
                </div>
                <span className="font-bold text-slate-800">
                  Chuẩn hóa quốc tế
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Nội dung đào tạo từ các trường ĐH hàng đầu Thụy Sĩ và Đức.
              </p>
            </motion.div>
          </div>

          {/* Cột nội dung */}
          <div className="relative z-10">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm block mb-2">
              Tại sao chọn Mini MBA Y Tế?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Nâng tầm quản trị bệnh viện & phòng khám
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Ngành y tế đang thay đổi chóng mặt với Chuyển đổi số và AI. Chương
              trình trang bị tư duy quản trị hiện đại, giúp bạn vận hành tổ chức
              hiệu quả, xử lý khủng hoảng và đổi mới sáng tạo.
            </p>

            <ul className="space-y-4">
              {[
                "Hiểu sâu về Digital Health & AI trong y tế",
                "Kỹ năng quản trị sự thay đổi & xử lý khủng hoảng",
                "Mô hình kinh doanh & Khởi nghiệp y tế",
                "Networking với các chuyên gia y tế hàng đầu",
              ].map((item, i) => (
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

      {/* --- CURRICULUM OVERVIEW --- */}
      <section id="chuong-trinh" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Tổng Quan Khóa Học
            </h2>
            <p className="text-slate-600">
              4 Trụ cột kiến thức dành cho nhà quản lý y tế hiện đại.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MODULES.map((mod, index) => (
              <FeatureCard key={mod.id} item={mod} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* --- SCHEDULE & ROADMAP (Thay thế Testimonials) --- */}
      <section id="lo-trinh" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
              Lịch học chi tiết
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-4">
              Lộ Trình Đào Tạo 2025 - 2026
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Chương trình diễn ra vào các ngày thứ Bảy, tối ưu thời gian cho
              nhân sự y tế. Giảng dạy trực tiếp bởi các Giáo sư: Volker Schulte,
              Dieter Reineke và Ms. Kathrin Gass.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 shadow-inner border border-slate-100">
            {/* Chú thích giảng viên */}
            <div className="flex flex-wrap gap-4 mb-10 justify-center text-sm border-b border-slate-200 pb-6">
              <div className="flex items-center gap-2">
                <User size={14} className="text-blue-600" />
                <span className="font-bold text-slate-700">
                  Prof. Volker Schulte
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-blue-600" />
                <span className="font-bold text-slate-700">
                  Ms. Kathrin Gass
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-blue-600" />
                <span className="font-bold text-slate-700">
                  Prof. Dieter Reineke
                </span>
              </div>
            </div>

            {/* Timeline Items */}
            <div className="pl-2 md:pl-4">
              {SCHEDULE_ITEMS.map((item, index) => (
                <TimelineRow key={index} item={item} index={index} />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-500 italic text-sm">
                *Lưu ý: Lịch học có thể điều chỉnh tùy theo tình hình thực tế.
                Ban tổ chức sẽ thông báo trước 2 tuần.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- GIẢNG VIÊN --- */}
      <section id="giang-vien" className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Đội Ngũ Giảng Viên
            </h2>
            <p className="text-slate-600 mt-2">
              Các chuyên gia hàng đầu từ Châu Âu
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 overflow-hidden">
                <img
                  src="/images/Volker-Schulte.jpg"
                  alt="Volker"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">Prof. Dr. Volker Schulte</h3>
              <p className="text-blue-600 text-sm mb-2">
                PhD in Political Sciences
              </p>
              <p className="text-blue-600 text-sm mb-2">
                Professor for Health Management
              </p>
              {/* <p className="text-slate-500 text-sm">
                Giáo sư hàng đầu về Quản trị Y tế và Chuyển đổi số.
              </p> */}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 overflow-hidden">
                <img
                  src="/images/IMG_3742.jpg.jpeg"
                  alt="Kathrin"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">Ms. Kathrin Gass</h3>
              <p className="text-blue-600 text-sm mb-2">
                Adjunct Assistant Professor
              </p>
              {/* <p className="text-slate-500 text-sm">
                Tư vấn cấp cao về xử lý khủng hoảng và tối ưu quy trình.
              </p> */}
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 overflow-hidden">
                <img
                  src="/images/Reineke_Rolf-Dieter_300-dpi-scaled-e1662626023357.webp"
                  alt="Dieter"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">Prof. Dr. Dieter Reineke</h3>
              <p className="text-blue-600 text-sm mb-2">
                Professor, University of Applied Sciences and Arts Northwestern
                Switzerland
              </p>
              {/* <p className="text-slate-500 text-sm">
                Giáo sư về Chiến lược kinh doanh và Mô hình khởi nghiệp.
              </p> */}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA / REGISTRATION FORM --- */}
      <section
        id="dang-ky"
        className="py-24 bg-gradient-to-br from-blue-900 to-slate-900 text-white"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold mb-4">
                Đăng ký giữ chỗ khóa học
              </h3>
              <p className="text-blue-200">
                Sĩ số giới hạn để đảm bảo chất lượng tương tác. Đăng ký ngay để
                nhận ưu đãi học phí sớm.
              </p>
            </div>

            <form className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/20 outline-none transition placeholder-white/30"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/20 outline-none transition placeholder-white/30"
                  placeholder="09xxxxxxx"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Email (Công việc)
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/20 outline-none transition placeholder-white/30"
                  placeholder="email@company.com"
                />
              </div>

              <button
                type="button"
                className="md:col-span-2 w-full bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 mt-2 text-lg"
              >
                Gửi Đăng Ký & Nhận Brochure
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h2 className="text-white text-2xl font-bold mb-4">
              TBI Institute
            </h2>
            <p className="max-w-sm mb-6">
              Viện Đào tạo và Phát triển Năng lực. Đơn vị hàng đầu trong lĩnh
              vực đào tạo quản trị doanh nghiệp thực chiến tại Việt Nam.
            </p>
            <span className="text-xs">© 2025 TBI. All rights reserved.</span>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Chương trình</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Mini MBA
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  CEO Quản trị
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Giám đốc Nhân sự (CHRO)
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Phone size={14} /> 0909.123.456
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Mail size={14} /> tuyensinh@tbi.edu.vn
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin size={14} /> TP. Hồ Chí Minh
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
