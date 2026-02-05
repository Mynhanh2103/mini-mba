import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  Cpu,
  BookOpen,
  Users,
  Globe,
  Handshake,
  Newspaper,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "./LanguageContext"; // Đường dẫn tuỳ vào vị trí file
import bannerBg from "./assets/hero-pic.avif";
// URL API
const API_URL = import.meta.env.VITE_API_URL || "https://127.0.0.1:8000";

// --- TỪ ĐIỂN ĐA NGÔN NGỮ ---
const translations = {
  vi: {
    // Hero Section
    hero_title: "Kiến Tạo Tương Lai",
    hero_subtitle: "Y Tế Thông Minh Việt Nam",
    hero_desc1:
      "Tiên phong trong giải pháp Chuyển đổi số - Đào tạo Quản trị - Nghiên cứu Chuyển Đổi Số",
    hero_desc2: "Kết nối tri thức toàn cầu để nâng tầm hệ thống y tế Việt Nam",
    btn_consulting: "Giải pháp Tư vấn",
    btn_training: "Chương trình Đào tạo",

    // Stats Section
    stat_1: "Đối tác Quốc tế",
    stat_2: "Dự án Chuyển đổi số",
    stat_3: "Học viên Quản lý",

    // About Section
    about_sub: "Về Smart Health Solutions",
    about_title: "Nền Tảng Chuyển Đổi Số Toàn Diện",
    about_desc:
      "Chúng tôi cung cấp hệ sinh thái dịch vụ toàn diện từ nghiên cứu, tư vấn đến triển khai giải pháp. Smart Health Solutions là sự kết hợp hoàn hảo giữa chuyên môn Y khoa, Công nghệ tiên tiến và Quản trị hiện đại.",

    // Services Section
    srv_title: "Hệ Sinh Thái Dịch Vụ",
    srv_1: "Tư Vấn Chuyển Đổi Số",
    srv_1_desc:
      "Thiết kế giải pháp, xây dựng lộ trình và triển khai chuyển đổi số hiệu quả cho bệnh viện và phòng khám.",
    srv_2: "Đào Tạo & Huấn Luyện",
    srv_2_desc:
      "Trang bị kiến thức, kỹ năng cho đội ngũ nhân sự IT và Y tế để vận hành hệ thống thông minh.",
    srv_3: "Nghiên Cứu & Phát Triển",
    srv_3_desc:
      "Cập nhật xu hướng công nghệ mới, phát triển giải pháp đột phá phù hợp với y tế Việt Nam.",

    // Partners Section
    partner_title: "Mạng Lưới Hợp Tác & Chuyên Gia",
    partner_desc:
      "Tự hào là Hub tri thức kết nối các đơn vị cung ứng công nghệ 4.0, các bệnh viện và chuyên gia hàng đầu trong và ngoài nước.",

    news_title: "Hoạt Động & Hợp Tác",
    news_view_all: "Xem tất cả tin tức",

    footer_cta_title: "Sẵn sàng đổi mới cùng chúng tôi?",
    footer_cta_btn: "Liên hệ ngay",
    footer_addr: "268 Lý Thường Kiệt, Phường Diên Hồng, Tp. Hồ Chí Minh",
  },
  en: {
    // Hero Section
    hero_title: "Shaping the Future of",
    hero_subtitle: "Smart Healthcare in Vietnam",
    hero_desc1:
      "Pioneering in Digital Transformation - Management Training - Digitalization Research",
    hero_desc2:
      "Connecting global knowledge to elevate Vietnam's healthcare system",
    btn_consulting: "Consulting Solutions",
    btn_training: "Training Programs",

    // Stats Section
    stat_1: "Global Partners",
    stat_2: "Digital Projects",
    stat_3: "Management Trainees",

    // About Section
    about_sub: "About Smart Health Solutions",
    about_title: "Comprehensive Digital Transformation Platform",
    about_desc:
      "We provide a comprehensive ecosystem from research and consulting to solution implementation. Smart Health Solutions perfectly blends Medical expertise, Advanced Technology, and Modern Management.",

    // Services Section
    srv_title: "Service Ecosystem",
    srv_1: "Digital Consulting",
    srv_1_desc:
      "Designing solutions, building roadmaps, and implementing effective digital transformation for healthcare facilities.",
    srv_2: "Training & Coaching",
    srv_2_desc:
      "Equipping IT and medical staff with necessary skills to operate smart healthcare systems.",
    srv_3: "Research & Development",
    srv_3_desc:
      "Updating technology trends and developing groundbreaking solutions tailored for Vietnam.",

    // Partners Section
    partner_title: "Partnership & Expert Network",
    partner_desc:
      "Proud to be a knowledge hub connecting 4.0 technology providers, hospitals, and leading domestic and international experts.",

    news_title: "News & Collaborations",
    news_view_all: "View all news",

    footer_cta_title: "Ready to innovate with us?",
    footer_cta_btn: "Contact Now",
    footer_addr: "268 Ly Thuong Kiet, Dien Hong Ward, Ho Chi Minh City",
  },
};

export default function HomePage() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];
  const [latestNews, setLatestNews] = useState([]);
  const [partners, setPartners] = useState([]);
  const [config, setConfig] = useState(null);
  const [consultingServices, setConsultingServices] = useState([]);

  // --- HÀM HELPER ĐA NGÔN NGỮ ---
  const getData = (configObj, field, lang, fallbackValue) => {
    if (!configObj) return fallbackValue;
    if (lang === "en") {
      // Nếu là tiếng Anh, tìm trường có đuôi _en (ví dụ title_en)
      // Nếu _en rỗng, quay về lấy tiếng Việt (field gốc)
      return configObj[`${field}_en`] || configObj[field] || fallbackValue;
    }
    // Mặc định trả về tiếng Việt
    return configObj[field] || fallbackValue;
  };

  // API Config Chung
  useEffect(() => {
    fetch(`${API_URL}/api/general-config/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setConfig(data[0]);
      });
  }, []);

  // API Config Mini MBA (nếu cần dùng đè)
  useEffect(() => {
    fetch(`${API_URL}/api/minimba-config/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setConfig(data[0]);
      });
  }, []);

  // API Tin tức
  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`${API_URL}/api/research/?t=${timestamp}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setLatestNews(sorted.slice(0, 3));
      })
      .catch((err) => console.error("Lỗi tải tin tức:", err));
  }, []);

  // API Đối tác
  useEffect(() => {
    fetch(`${API_URL}/api/partners/`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setPartners(sorted);
      })
      .catch((err) => console.error("Lỗi tải đối tác:", err));
  }, []);

  // API Dịch vụ
  useEffect(() => {
    fetch(`${API_URL}/api/consulting-services/`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setConsultingServices(sorted);
      })
      .catch((err) => console.error("Lỗi tải dịch vụ:", err));
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden">
      {/* --- 1. NAVBAR --- */}
      <nav className="absolute top-0 w-full z-50 py-6 px-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div
          className="text-white font-bold text-2xl tracking-tighter cursor-pointer"
          onClick={() => window.scrollTo(0, 0)}
        >
          SmartHealthSolutions<span className="text-blue-400"></span>
        </div>
        <button
          onClick={toggleLanguage} // Gọi hàm toggle từ Context
          className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white font-bold border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
        >
          <Globe size={18} /> {lang === "vi" ? "EN" : "VN"}
        </button>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <header className="relative min-h-[90vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden pt-20">
        <div
          style={{ backgroundImage: `url(${bannerBg})` }}
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 animate-pulse-slow"
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600 rounded-full blur-[150px] opacity-20 translate-y-1/3 -translate-x-1/3"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-bold mb-6 backdrop-blur-md">
              <Activity size={16} /> #1 Healthcare Solution Provider
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              {t.hero_title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
                {t.hero_subtitle}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-2 max-w-3xl mx-auto font-light leading-relaxed">
              {t.hero_desc1}
            </p>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              {t.hero_desc2}
            </p>
          </motion.div>
        </div>
      </header>

      {/* --- 4. ABOUT & MISSION --- */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2 block">
              {t.about_sub}
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              {t.about_title}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              {t.about_desc}
            </p>

            <div className="space-y-4">
              {[
                lang === "vi"
                  ? "Kết nối chuyên gia toàn cầu"
                  : "Global Expert Network",
                lang === "vi"
                  ? "Giải pháp thực tiễn & khả thi"
                  : "Practical & Feasible Solutions",
                lang === "vi"
                  ? "Cam kết đồng hành dài hạn"
                  : "Long-term Partnership Commitment",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-teal-500 shrink-0" />
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-3xl opacity-20 blur-lg"></div>
            <img
              src="/images/premium_photo-1681843060942-3ea0f3077477.avif"
              alt="Vision"
              className="relative rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* --- FOUNDER SECTION --- */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start gap-12">
            {/* CỘT TRÁI: Founder */}
            <div className="w-full md:w-5/12 flex flex-col items-center md:items-start space-y-6">
              <div className="w-full text-center md:text-left">
                <h2 className="text-3xl font-black text-[#002147] uppercase leading-none">
                  Founder & CEO
                </h2>
                <div className="w-20 h-1.5 bg-yellow-400 mt-3 rounded-full mx-auto md:mx-0"></div>
              </div>

              <div className="relative w-64 h-64 md:w-80 md:h-80 group">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 transform translate-x-4 translate-y-4"></div>
                <img
                  src={config?.founder_image || "https://placehold.co/400x400"}
                  alt={config?.founder_name}
                  className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-2xl z-10"
                />
                <div className="absolute bottom-4 -right-4 z-20 bg-yellow-400 text-blue-900 font-bold px-4 py-1 rounded-full shadow-lg text-sm">
                  {getData(config, "founder_role", lang, "Founder & CEO")}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: Bio */}
            <div className="w-full md:w-7/12 text-center md:text-left md:pt-20">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                {config?.founder_name || "Mr. Trương Minh Chương"}
              </h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto md:mx-0 rounded-full mb-6"></div>

              <div className="prose prose-lg text-slate-600 leading-relaxed text-justify">
                {(getData(config, "founder_bio", lang, "") || "")
                  .split("\n")
                  .map((para, idx) => (
                    <p key={idx} className="mb-4 text-sm md:text-base">
                      {para}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. SERVICES --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              {t.srv_title}
            </h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link
              to="/consulting"
              className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">
                {t.srv_1}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {t.srv_1_desc}
              </p>
              <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                {lang === "vi" ? "Xem chi tiết" : "Learn more"}{" "}
                <ChevronRight size={18} />
              </div>
            </Link>

            <Link
              to="/training"
              className="group p-8 rounded-3xl bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-yellow-500 text-blue-900 text-xs font-bold px-3 py-1 rounded-bl-xl">
                POPULAR
              </div>
              <div className="w-16 h-16 bg-white/10 text-yellow-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.srv_2}</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {t.srv_2_desc}
              </p>
              <div className="flex items-center text-yellow-400 font-bold group-hover:gap-2 transition-all">
                {lang === "vi" ? "Xem khóa học" : "View courses"}{" "}
                <ChevronRight size={18} />
              </div>
            </Link>

            <Link
              to="/research"
              className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300"></div>
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-purple-600 transition-colors">
                {t.srv_3}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {t.srv_3_desc}
              </p>
              <div className="flex items-center text-purple-600 font-bold group-hover:gap-2 transition-all">
                {lang === "vi" ? "Xem thư viện" : "Visit library"}{" "}
                <ChevronRight size={18} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* --- 6. PARTNERS SECTION --- */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-8">
            {t.partner_title}
          </h3>

          <div className="flex flex-wrap justify-center items-center gap-12">
            {partners.length > 0 ? (
              partners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={partner.name}
                  className="group"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    crossOrigin="anonymous"
                    className="h-10 md:h-12 object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
                  />
                </a>
              ))
            ) : (
              <p className="text-slate-400 italic text-sm">
                {lang === "vi"
                  ? "Đang cập nhật đối tác..."
                  : "Updating partners..."}
              </p>
            )}
          </div>

          <p className="mt-8 text-sm text-slate-500 italic max-w-2xl mx-auto">
            {t.partner_desc}
          </p>
        </div>
      </section>

      {/* --- 7. LATEST NEWS (Dữ liệu động đã sửa ngôn ngữ) --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                <Handshake size={20} /> <span>Newsroom</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                {t.news_title}
              </h2>
            </div>
            <Link
              to="/research"
              className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
            >
              {t.news_view_all} <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.length > 0 ? (
              latestNews.map((news) => {
                // 2. SỬA LỖI LINK: Ưu tiên dùng slug, fallback về id nếu slug rỗng
                const linkTo = news.slug
                  ? `/research/${news.slug}`
                  : `/research/${news.id}`;

                return (
                  <Link
                    to={linkTo} // Đã fix URL
                    state={{ lang: lang }} // Truyền ngôn ngữ
                    key={news.id}
                    className="group cursor-pointer"
                  >
                    <div className="h-56 overflow-hidden rounded-2xl mb-4 relative">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all z-10" />
                      <img
                        src={
                          news.cover_image ||
                          news.cover_url ||
                          "https://placehold.co/600x400"
                        }
                        alt={getData(news, "title", lang, "")}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-blue-900 uppercase">
                        {news.category || "News"}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {getData(news, "title", lang, "Untitled")}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                      {getData(news, "summary", lang, "")}
                    </p>
                    <span className="text-sm font-bold text-slate-400 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                      {lang === "vi" ? "Đọc tiếp" : "Read more"}{" "}
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-10 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-300">
                {lang === "vi"
                  ? "Đang cập nhật tin tức hợp tác mới nhất..."
                  : "Updating latest collaboration news..."}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- 8. FOOTER CTA --- */}
      <section className="bg-blue-600 py-20 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            {t.footer_cta_title}
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            {lang === "vi"
              ? "Hãy để Smart Health Solutions trở thành đối tác tin cậy của bạn trong hành trình chuyển đổi số."
              : "Let Smart Health Solutions be your trusted partner in your digital transformation journey."}
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-full shadow-xl hover:bg-blue-50 transition-all hover:-translate-y-1"
          >
            {t.footer_cta_btn}
          </Link>
        </div>
      </section>

      {/* FOOTER INFO */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                S
              </div>
              Smart Health Solutions
            </h3>
            <p className="mb-2">{t.footer_addr}</p>
            <p className="mb-2">Email: mr.truongchuong@gmail.com</p>
            <p>Mobile: 077 410 9425</p>
          </div>
          <div className="text-right flex flex-col justify-end">
            <div className="flex gap-4 justify-end mb-4">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Globe size={16} />
              </div>
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Newspaper size={16} />
              </div>
            </div>
            <p>© 2025 Smart Health Solutions. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
