/*import React, { useState, useEffect } from "react";
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

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
// Hàm xử lý link ảnh: Nếu thiếu domain thì tự động thêm vào
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath; // Đã có domain đầy đủ
  return `${BASE_URL}${imagePath}`; // Nối thêm domain nếu là đường dẫn tương đối
};

const getOverviewIcon = (type) => {
  const iconClass = "w-8 h-8 text-blue-600"; // Class chung cho đẹp

  switch (type) {
    case "strategy": // Nếu trong admin chọn "Chiến lược"
      return <TrendingUp className={iconClass} />;

    case "finance": // Nếu trong admin chọn "Tài chính"
      return <BookOpen className={iconClass} />; // Hoặc dùng <PieChart />

    case "leadership": // Nếu trong admin chọn "Lãnh đạo"
      return <Users className={iconClass} />;

    case "marketing": // Nếu trong admin chọn "Marketing"
      return <Award className={iconClass} />;

    default: // Mặc định
      return <Zap className={iconClass} />;
  }
};

// --- COMPONENT THẺ TỔNG QUAN (OVERVIEW CARD) ---
const OverviewCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full group"
  >
    {/* 1. PHẦN ẢNH BÌA (COVER IMAGE) }
    <div className="h-48 overflow-hidden bg-gray-100 relative">
      {item.cover_image ? (
        <img
          src={getImageUrl(item.cover_image)}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <img
          src="https://placehold.co/600x400?text=Cover+Image"
          alt="Placeholder"
          className="w-full h-full object-cover opacity-50"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
    </div>

    {/* 2. PHẦN NỘI DUNG (CHỨA ICON + TEXT) }
    <div className="p-6 md:p-8 flex flex-col flex-grow relative">
      {/* Ô Vuông chứa Icon }
      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 shrink-0">
        {item.icon_type ? (
          getOverviewIcon(item.icon_type)
        ) : (
          // Fallback: Nếu quên up icon thì hiện chấm tròn xanh
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
        {item.title}
      </h3>

      <p className="text-slate-600 text-sm leading-relaxed flex-grow">
        {item.description}
      </p>
    </div>
  </motion.div>
);

// --- COMPONENT THẺ MÔ ĐUN (FEATURE CARD) ---
const FeatureCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group flex flex-col h-full"
  >
    <div className="h-48 overflow-hidden bg-gray-100">
      <img
        src={item.image_url || "https://placehold.co/600x400?text=Module+Image"}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) =>
          (e.target.src = "https://placehold.co/600x400?text=No+Image")
        }
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {getOverviewIcon(item.icon_type)}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed flex-grow">
        {item.description || item.desc}
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

const isDatePassed = (dateString) => {
  if (!dateString) return false;
  try {
    // Giả sử định dạng ngày là "DD/MM/YYYY" (ví dụ: 06/12/2025)
    const parts = dateString.split('/');
    if (parts.length === 3) {
      // Tạo ngày từ chuỗi (Lưu ý: Tháng trong JS bắt đầu từ 0 nên phải trừ 1)
      const eventDate = new Date(parts[2], parts[1] - 1, parts[0]);
      const today = new Date();
      // Reset giờ về 0 để so sánh chính xác theo ngày
      today.setHours(0, 0, 0, 0);
      
      // Nếu ngày sự kiện nhỏ hơn hôm nay -> Đã qua
      return eventDate < today;
    }
  } catch (e) {
    return false;
  }
  return false;
};

const TimelineRow = ({ item, index }) => {
  const isHoliday = item.item_type === "holiday" || item.item_type === "break";
  const dateDisplay = item.date_str || item.date;
  const profDisplay = item.prof_name || item.prof;

  // (MỚI) Gọi hàm kiểm tra xem ngày này đã qua chưa
  const isPassed = isDatePassed(dateDisplay);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      // (MỚI) Thêm hiệu ứng: Nếu đã qua (isPassed) thì làm mờ (opacity-50) và đen trắng (grayscale)
      className={`relative flex gap-6 pb-8 last:pb-0 ${
        isHoliday ? "opacity-70" : isPassed ? "opacity-50 grayscale" : ""
      }`}
    >
      <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-200 last:hidden"></div>
      
      {/* (MỚI) Logic đổi màu Icon: Ngày lễ (Đỏ), Đã qua (Xám), Sắp tới (Xanh) }
      <div
        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm
        ${
          isHoliday 
            ? "bg-red-100 text-red-500" 
            : isPassed 
              ? "bg-slate-200 text-slate-500" // Màu xám nếu đã học xong
              : "bg-blue-600 text-white"      // Màu xanh nếu chưa học
        }`}
      >
        {/* (MỚI) Đổi Icon: Nếu đã qua thì hiện dấu tích (CheckCircle), chưa qua hiện lịch (Calendar) }
        {isHoliday ? <Star size={18} /> : isPassed ? <CheckCircle size={18}/> : <Calendar size={18} />}
      </div>

      <div
        className={`flex-grow border-b border-slate-100 pb-8 last:border-0 ${
          isHoliday ? "pt-2" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <span
            className={`text-sm font-bold tracking-wide px-3 py-1 rounded-full w-fit
            ${
              isHoliday 
                ? "bg-red-100 text-red-600" 
                : isPassed 
                  ? "bg-slate-100 text-slate-500" // Badge màu xám
                  : "bg-blue-50 text-blue-700"
            }`}
          >
            {dateDisplay}
          </span>
          {!isHoliday && (
            <span className="flex items-center gap-1 text-xs text-slate-400 uppercase font-semibold">
              <Clock size={14} /> 
              {/* (MỚI) SỬA LỖI GIỜ CỨNG: Lấy từ item.duration, nếu không có mới hiện mặc định }
              {item.duration || "09:00 - 16:30"}
            </span>
          )}
        </div>
        
        {/* (MỚI) Tên bài học: Nếu đã qua thì gạch ngang (line-through) }
        <h3
          className={`text-lg font-bold ${
            isHoliday 
              ? "text-red-500 italic" 
              : isPassed 
                ? "text-slate-500 line-through" 
                : "text-slate-900"
          }`}
        >
          {item.topic}
        </h3>

        {!isHoliday && profDisplay && (
          <div className="flex items-center gap-2 mt-2 text-slate-600 text-sm">
            <User size={16} className={isPassed ? "text-slate-400" : "text-yellow-500"} />
            <span className="font-medium">{profDisplay}</span>
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

  // --- STATE DỮ LIỆU TỪ API ---
  const [modules, setModules] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [instructors, setInstructors] = useState([]); // State cho Giảng viên
  const [overviews, setOverviews] = useState([]); // State cho Tổng quan
  const [loading, setLoading] = useState(true);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- GỌI API DJANGO ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Modules
        const modRes = await fetch(`${BASE_URL}/api/modules/`);
        if (modRes.ok) setModules(await modRes.json());

        // 2. Schedule
        const schRes = await fetch(`${BASE_URL}/api/schedule/`);
        if (schRes.ok) setSchedule(await schRes.json());

        // 3. Instructors (Giảng viên)
        const instRes = await fetch(`${BASE_URL}/api/instructors/`);
        if (instRes.ok) setInstructors(await instRes.json());

        // 4. Overviews (Tổng quan)
        const overRes = await fetch(`${BASE_URL}/api/overviews/`);
        if (overRes.ok) setOverviews(await overRes.json());
      } catch (error) {
        console.error("Không kết nối được Django:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- XỬ LÝ ĐĂNG KÝ ---
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
        alert("Đăng ký thành công! Chúng tôi sẽ liên hệ lại sớm.");
        e.target.reset();
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err) {
      alert("Lỗi kết nối server.");
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      setIsMenuOpen(false);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* --- NAVIGATION --- *}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
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

          <div
            className={`hidden md:flex gap-8 text-sm font-medium ${
              scrolled ? "text-slate-600" : "text-white/90"
            }`}
          >
            <button
              onClick={() => scrollToSection("chuong-trinh")}
              className="hover:text-yellow-500 transition"
            >
              Chương trình
            </button>
            <button
              onClick={() => scrollToSection("loi-ich")}
              className="hover:text-yellow-500 transition"
            >
              Lợi ích
            </button>
            <button
              onClick={() => scrollToSection("lo-trinh")}
              className="hover:text-yellow-500 transition"
            >
              Lộ trình
            </button>
            <button
              onClick={() => scrollToSection("giang-vien")}
              className="hover:text-yellow-500 transition"
            >
              Giảng viên
            </button>
          </div>

          <button
            onClick={() => scrollToSection("dang-ky")}
            className="hidden md:block bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-6 py-2 rounded-full transition-transform transform active:scale-95 shadow-lg shadow-yellow-500/30"
          >
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
                <button
                  className="text-left"
                  onClick={() => scrollToSection("chuong-trinh")}
                >
                  Chương trình
                </button>
                <button
                  className="text-left"
                  onClick={() => scrollToSection("loi-ich")}
                >
                  Lợi ích
                </button>
                <button
                  className="text-left"
                  onClick={() => scrollToSection("lo-trinh")}
                >
                  Lộ trình
                </button>
                <button
                  onClick={() => scrollToSection("dang-ky")}
                  className="bg-blue-900 text-white py-3 rounded-lg font-bold"
                >
                  Đăng ký tư vấn
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- *}
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
              Đối tác: TRAF Academy & EDUPROVED
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Quản Trị <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                Chuyển Đổi Số Y Tế
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
              Dành cho Lãnh đạo Y tế. Chương trình thực chiến giải quyết Case
              Study thực tế.
            </p>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto font-light">
              Nhận chứng nhận EDUPROVED quốc tế sau khóa học.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection("dang-ky")}
                className="w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full shadow-xl shadow-yellow-500/30 transition-all transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                Nhận Brochure <ArrowRight className="w-5 h-5" />
              </button>
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

      {/* --- STATS SECTION --- *}
      <section className="py-10 bg-blue-900 relative -mt-2">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-blue-800/50">
          <StatItem number="10" label="Buổi Học (4h/Buổi)" />
          <StatItem number="Hybrid" label="Online & Offline" />
          <StatItem number="100%" label="Case Study Thực Tế" />
          <StatItem number="TRAF" label="Giảng Viên & Cố Vấn" />
        </div>
      </section>

      {/* --- LỢI ÍCH --- *}
      <section id="loi-ich" className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-200 rounded-full opacity-50 blur-2xl z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl z-0"></div>
            <img
              src="https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQ_sblWpCGTTTDCK-crNTqZ7W_TEuNMyazUH563CxzPlcUY6kDNULXIWVwXIFnE9Q5Qqh6EXzbtZrTdBN47w_kYULxv4RYEcV7DijI6PcOZaN0omoQ"
              className="relative rounded-3xl shadow-2xl z-10 w-full object-cover"
              alt="Medical Management"
            />
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
                  Chứng nhận EDUPROVED
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Được công nhận quốc tế, cấp bởi Viện TRAF Academy.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm block mb-2">
              TẠI SAO CHỌN MINI MBA Y TẾ?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Giải quyết bài toán thực tế của bản thân & tổ chức
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Chương trình Mini MBA Y tế được thiết kế theo mô hình Hybrid linh
              hoạt, giúp người học vừa nắm vững lý thuyết trọng tâm vừa áp dụng
              ngay vào công việc thực tế. Mỗi buổi học gồm phần lý thuyết cô
              đọng (30–45 phút) và thực hành xử lý Case Study thực tế, kết hợp
              làm Project cuối khóa để giải quyết chính những vấn đề của bản
              thân hoặc cộng đồng.
            </p>

            <ul className="space-y-5">
              {[
                "Học theo mô hình Hybrid – linh hoạt & hiệu quả",
                "Lý thuyết cô đọng – tập trung vào kiến thức áp dụng được ngay",
                "Case Study thực tế – học qua tình huống thật thay vì lý thuyết khô",
                "Project cuối khóa mang tính ứng dụng cao – giải quyết vấn đề cho học viên",
                "Giảng viên chuyên môn sâu từ TRAF Academy – kinh nghiệm thực chiến trong quản trị y tế",
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
      {/* --- TỔNG QUAN KHÓA HỌC (SECTION MỚI - HIỂN THỊ DỮ LIỆU TỪ ADMIN) --- *}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Tổng Quan Khóa Học
            </h2>
            <p className="text-slate-600 text-lg">
              4 Trụ cột kiến thức dành cho nhà quản lý y tế hiện đại.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-slate-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {overviews.length > 0 ? (
                overviews.map((item, index) => (
                  <OverviewCard
                    key={item.id || index}
                    item={item}
                    index={index}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-slate-400 bg-slate-50 p-8 rounded-xl border border-slate-100">
                  Chưa có dữ liệu tổng quan. Vui lòng nhập trong Admin.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- CURRICULUM OVERVIEW --- *}
      <section id="chuong-trinh" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Chương Trình Đào Tạo
            </h2>
            <p className="text-slate-600">
              Cấu trúc bài giảng tối ưu hóa sự tương tác và tính thực tiễn.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-slate-500">
                Đang tải dữ liệu từ server...
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modules.length > 0 ? (
                modules.map((mod, index) => (
                  <FeatureCard key={mod.id || index} item={mod} index={index} />
                ))
              ) : (
                <p className="col-span-full text-center text-slate-400 bg-slate-100 p-8 rounded-xl">
                  Chưa có dữ liệu. Vui lòng nhập trong Admin.
                </p>
              )}
              {/* Card Project Tốt Nghiệp *}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center text-center h-full"
              >
                <Award className="w-12 h-12 mb-4 text-yellow-300" />
                <h3 className="text-xl font-bold mb-2">Project Tốt Nghiệp</h3>
                <p className="text-blue-100 text-sm">
                  Giải quyết vấn đề thực tế của học viên dưới sự cố vấn của
                  chuyên gia TRAF.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* --- SCHEDULE & ROADMAP --- *}
      <section id="lo-trinh" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
              Lịch học chi tiết
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-4">
              Lộ Trình Đào Tạo Hybrid
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Chương trình gồm 10 buổi. Mỗi buổi học gồm:{" "}
              <strong>30-45 phút lý thuyết</strong>, phần còn lại tập trung giải
              quyết <strong>Case Study thực tế</strong>.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 shadow-inner border border-slate-100">
            <div className="flex flex-wrap gap-4 mb-10 justify-center text-sm border-b border-slate-200 pb-6">
              <div className="flex items-center gap-2">
                <User size={14} className="text-blue-600" />
                <span className="font-bold text-slate-700">
                  TRAF Academy Advisors
                </span>
              </div>
            </div>

            <div className="pl-2 md:pl-4">
              {loading ? (
                <p className="text-center text-slate-500">
                  Đang cập nhật lịch học...
                </p>
              ) : schedule.length > 0 ? (
                schedule.map((item, index) => (
                  <TimelineRow
                    key={item.id || index}
                    item={item}
                    index={index}
                  />
                ))
              ) : (
                <p className="text-center text-slate-400">Chưa có lịch học.</p>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-500 italic text-sm">
                *Cuối khóa sẽ có buổi bảo vệ Project tốt nghiệp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- GIẢNG VIÊN (SECTION ĐÃ SỬA ĐỂ HIỂN THỊ DỮ LIỆU TỪ ADMIN) --- *}
      <section id="giang-vien" className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Đội Ngũ Giảng Viên
            </h2>
            <p className="text-slate-600 mt-2">
              Đến từ đối tác <strong>TRAF Academy</strong>
            </p>
          </div>

          {loading ? (
            <div className="text-center text-slate-500">
              Đang tải danh sách giảng viên...
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {instructors.length > 0 ? (
                instructors.map((inst, index) => (
                  <div
                    key={inst.id || index}
                    className="bg-white p-6 rounded-2xl shadow-sm text-center border border-slate-100 hover:shadow-lg transition duration-300"
                  >
                    <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 overflow-hidden">
                      <img
                        // --- LOGIC MỚI: Ưu tiên Upload (qua getImageUrl) -> Link Online -> Placeholder ---
                        src={
                          getImageUrl(inst.image) ||
                          inst.image_url ||
                          "https://placehold.co/150x150?text=Avatar"
                        }
                        // -------------------------------------------------------------------------------

                        alt={inst.name}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/150x150?text=Avatar")
                        }
                      />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {/* 1. Hiển thị Học hàm + Tên (Ví dụ: Prof. Dr. Volker Schulte) *}
                      {inst.title ? `${inst.title} ` : ""}
                      {inst.name}
                    </h3>
                    <p className="text-blue-600 text-sm font-medium mt-1">
                      {inst.position || "Chức vụ chưa cập nhật"}
                    </p>
                    {inst.description && (
                      <p className="text-slate-500 text-xs mt-2 line-clamp-2">
                        {inst.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-slate-400">
                  Chưa có thông tin giảng viên. Vui lòng nhập trong Admin.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- CTA / REGISTRATION FORM --- *}
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
              <div className="text-yellow-400 text-2xl font-bold mb-2">
                Học phí: 17.000.000 VNĐ
              </div>
              <p className="text-blue-200">
                Bao gồm 10 buổi học, tài liệu và chứng nhận EDUPROVED.
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="grid md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullname"
                  required
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
                  name="phone"
                  required
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
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:bg-white/20 outline-none transition placeholder-white/30"
                  placeholder="email@company.com"
                />
              </div>

              <button
                type="submit"
                className="md:col-span-2 w-full bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 mt-2 text-lg"
              >
                Gửi Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- *}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h2 className="text-white text-2xl font-bold mb-4">
              TBI Institute
            </h2>
            <p className="max-w-sm mb-6">
              Viện Đào tạo và Phát triển Năng lực. Đối tác chiến lược của TRAF
              Academy.
            </p>
            <span className="text-xs">© 2025 TBI. All rights reserved.</span>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Chương trình</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Quản trị Y tế
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Chuyển đổi số
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
}*/
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
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// --- TỪ ĐIỂN UI TĨNH ---
const translations = {
  vi: {
    nav_program: "Chương trình",
    nav_benefits: "Lợi ích",
    nav_roadmap: "Lộ trình",
    nav_instructors: "Giảng viên",
    nav_register: "Đăng ký ngay",
    nav_consult: "Đăng ký tư vấn",
    partner_badge: "Đối tác: TRAF Academy & EDUPROVED",
    btn_brochure: "Nhận Brochure",
    btn_content: "Xem Nội Dung",
    stat_sessions: "Buổi Học (4h/Buổi)",
    stat_format: "Online & Offline",
    stat_case: "Case Study Thực Tế",
    stat_advisor: "Giảng Viên & Cố Vấn",
    why_choose: "TẠI SAO CHỌN MINI MBA Y TẾ?",
    cert_title: "Chứng nhận EDUPROVED",
    cert_desc: "Được công nhận quốc tế, cấp bởi Viện TRAF Academy.",
    section_overview: "Tổng Quan Khóa Học",
    section_overview_sub:
      "4 Trụ cột kiến thức dành cho nhà quản lý y tế hiện đại.",
    section_program: "Chương Trình Đào Tạo",
    section_program_sub:
      "Cấu trúc bài giảng tối ưu hóa sự tương tác và tính thực tiễn.",
    section_roadmap: "Lộ Trình Đào Tạo Hybrid",
    section_roadmap_sub: "Lịch học chi tiết",
    section_instructors: "Đội Ngũ Giảng Viên",
    section_instructors_sub: "Đến từ đối tác TRAF Academy",
    form_title: "Đăng ký giữ chỗ khóa học",
    form_tuition: "Học phí: 17.000.000 VNĐ",
    form_note: "Bao gồm 10 buổi học, tài liệu và chứng nhận EDUPROVED.",
    form_name: "Họ và tên",
    form_phone: "Số điện thoại",
    form_email: "Email (Công việc)",
    form_submit: "Gửi Đăng Ký",
    project_grad: "Project Tốt Nghiệp",
    project_desc: "Giải quyết vấn đề thực tế của học viên.",
    loading: "Đang tải dữ liệu...",
    no_data: "Chưa có dữ liệu.",
    footer_rights: "© 2025 TBI. All rights reserved.",
  },
  en: {
    nav_program: "Program",
    nav_benefits: "Benefits",
    nav_roadmap: "Roadmap",
    nav_instructors: "Instructors",
    nav_register: "Register Now",
    nav_consult: "Get Consultation",
    partner_badge: "Partner: TRAF Academy & EDUPROVED",
    btn_brochure: "Get Brochure",
    btn_content: "View Content",
    stat_sessions: "Sessions (4h/Session)",
    stat_format: "Online & Offline",
    stat_case: "Real Case Studies",
    stat_advisor: "Lecturers & Advisors",
    why_choose: "WHY CHOOSE MINI MBA HEALTHCARE?",
    cert_title: "EDUPROVED Certification",
    cert_desc: "Internationally recognized, issued by TRAF Academy.",
    section_overview: "Course Overview",
    section_overview_sub:
      "4 Pillars of knowledge for modern healthcare managers.",
    section_program: "Training Program",
    section_program_sub:
      "Lecture structure optimized for interaction and practicality.",
    section_roadmap: "Hybrid Training Roadmap",
    section_roadmap_sub: "Detailed Schedule",
    section_instructors: "Our Instructors",
    section_instructors_sub: "From our partner TRAF Academy",
    form_title: "Register for the course",
    form_tuition: "Tuition: 17,000,000 VND",
    form_note: "Includes 10 sessions, materials, and EDUPROVED certification.",
    form_name: "Full Name",
    form_phone: "Phone Number",
    form_email: "Email (Work)",
    form_submit: "Submit Registration",
    project_grad: "Graduation Project",
    project_desc: "Solving real-world problems for students.",
    loading: "Loading data...",
    no_data: "No data available.",
    footer_rights: "© 2025 TBI. All rights reserved.",
  },
};

// --- HÀM HELPER THÔNG MINH ---
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

// Hàm lấy dữ liệu theo ngôn ngữ: getData(item, 'title', 'en') -> trả về title_en
const getData = (item, field, lang) => {
  if (!item) return "";
  if (lang === "en") {
    // Nếu đang là tiếng Anh, thử lấy trường _en (ví dụ title_en)
    const enValue = item[`${field}_en`];
    // Nếu có dữ liệu tiếng Anh thì trả về, nếu không thì quay về tiếng Việt (fallback)
    if (enValue && enValue.trim() !== "") return enValue;
  }
  // Mặc định trả về tiếng Việt
  return item[field];
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

// --- SUB COMPONENTS (Đã cập nhật để dùng getData) ---

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

  // Xử lý tên giảng viên (hơi phức tạp vì nó nằm trong object lồng nhau)
  // Nếu có object professor thì lấy name của nó, chưa hỗ trợ name_en cho giảng viên trong lịch (có thể làm sau)
  const profDisplay = item.prof_name;

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
        {!isHoliday && profDisplay && (
          <div className="flex items-center gap-2 mt-2 text-slate-600 text-sm">
            <User
              size={16}
              className={isPassed ? "text-slate-400" : "text-yellow-500"}
            />
            <span className="font-medium">{profDisplay}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [lang, setLang] = useState("vi");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = (key) => translations[lang][key] || key;
  const toggleLang = () => setLang((prev) => (prev === "vi" ? "en" : "vi"));

  const [modules, setModules] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [overviews, setOverviews] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    // ... (Giữ nguyên logic đăng ký)
    alert(lang === "vi" ? "Đăng ký thành công!" : "Registration successful!");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      setIsMenuOpen(false);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Logic lấy danh sách lợi ích (Hỗ trợ đa ngôn ngữ)
  const defaultBenefits = [
    "Học theo mô hình Hybrid – linh hoạt & hiệu quả",
    "Lý thuyết cô đọng",
    "Case Study thực tế",
    "Project cuối khóa",
  ];

  // Lấy list từ config (dựa vào lang)
  const benefitsRaw = getData(config, "benefits_list", lang);
  const benefitsList = benefitsRaw ? benefitsRaw.split("\n") : defaultBenefits;

  const navItems = [
    { id: "chuong-trinh", label: t("nav_program") },
    { id: "loi-ich", label: t("nav_benefits") },
    { id: "lo-trinh", label: t("nav_roadmap") },
    { id: "giang-vien", label: t("nav_instructors") },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* NAVIGATION */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
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

          <div
            className={`hidden md:flex items-center gap-8 text-sm font-medium ${
              scrolled ? "text-slate-600" : "text-white/90"
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="hover:text-yellow-500 transition uppercase tracking-wide"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 border border-current px-2 py-1 rounded hover:bg-white/10 transition"
            >
              <Globe size={16} /> {lang === "vi" ? "EN" : "VN"}
            </button>
          </div>
          <button
            onClick={() => scrollToSection("dang-ky")}
            className="hidden md:block bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-6 py-2 rounded-full shadow-lg"
          >
            {t("nav_register")}
          </button>
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${scrolled ? "text-slate-900" : "text-white"}`}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {/* Mobile Menu ... (Giữ nguyên) */}
      </nav>

      {/* HERO SECTION */}
      <header className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image... */}
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
              {/* SỬ DỤNG getData ĐỂ LẤY TITLE EN/VI */}
              {getData(config, "hero_title", lang) ||
                t("hero_title_1")} <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                {getData(config, "hero_subtitle", lang) || t("hero_title_2")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-3xl mx-auto font-light leading-relaxed">
              {t("hero_desc_1")}
            </p>
            {/* Buttons... */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection("dang-ky")}
                className="w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full shadow-xl"
              >
                {t("btn_brochure")} <ArrowRight className="w-5 h-5" />
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

      {/* BENEFITS */}
      <section id="loi-ich" className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Side... */}
          <div className="relative">
            <img
              src="https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQ_sblWpCGTTTDCK-crNTqZ7W_TEuNMyazUH563CxzPlcUY6kDNULXIWVwXIFnE9Q5Qqh6EXzbtZrTdBN47w_kYULxv4RYEcV7DijI6PcOZaN0omoQ"
              className="relative rounded-3xl shadow-2xl z-10 w-full object-cover"
              alt="Medical Management"
            />
          </div>

          <div className="relative z-10">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm block mb-2">
              {t("why_choose")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              {getData(config, "benefit_title", lang) ||
                t("benefit_default_title")}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              {getData(config, "benefit_desc", lang) ||
                t("benefit_default_desc")}
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
              {t("section_overview")}
            </h2>
            <p className="text-slate-600 text-lg">
              {t("section_overview_sub")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {overviews.length > 0 ? (
              overviews.map((item, index) => (
                <OverviewCard
                  key={item.id || index}
                  item={item}
                  index={index}
                  lang={lang}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-400">
                {t("no_data")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="chuong-trinh" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
              {t("section_program")}
            </h2>
            <p className="text-slate-600">{t("section_program_sub")}</p>
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
            {/* Project Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center text-center h-full"
            >
              <Award className="w-12 h-12 mb-4 text-yellow-300" />
              <h3 className="text-xl font-bold mb-2">{t("project_grad")}</h3>
              <p className="text-blue-100 text-sm">{t("project_desc")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="lo-trinh" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
              {t("section_roadmap_sub")}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-4">
              {t("section_roadmap")}
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
              {t("section_instructors")}
            </h2>
            <p className="text-slate-600 mt-2">
              {t("section_instructors_sub")}
            </p>
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
                  {/* Dùng getData cho title và position */}
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

      {/* FORM & FOOTER ... (Giữ nguyên hoặc dùng t() như cũ) */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-center">
        <p>{t("footer_rights")}</p>
      </footer>
    </div>
  );
}
