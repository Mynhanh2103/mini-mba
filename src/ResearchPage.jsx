import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  ArrowRight,
  Calendar,
  User,
  Download,
  BookOpen,
  ChevronRight,
  Home,
  Globe,
} from "lucide-react";

// --- CẤU HÌNH ---
const API_URL =
  import.meta.env.VITE_API_URL || "https://mini-mba-admin.onrender.com";

// --- HÀM HELPER ĐA NGÔN NGỮ (QUAN TRỌNG) ---
// Hàm này tự động lấy trường _en nếu đang ở chế độ tiếng Anh
const getData = (item, field, lang) => {
  if (!item) return "";
  if (lang === "en") {
    // Ưu tiên lấy trường _en (ví dụ: title_en)
    const enValue = item[`${field}_en`];
    // Nếu có dữ liệu tiếng Anh thì trả về, nếu không thì fallback về tiếng Việt
    if (enValue && enValue.trim() !== "") return enValue;
  }
  return item[field]; // Mặc định trả về tiếng Việt (trường gốc)
};

// --- TỪ ĐIỂN UI ---
const translations = {
  vi: {
    breadcrumb_home: "Trang chủ",
    breadcrumb_research: "Thư viện & Nghiên cứu",
    hero_title: "Kho Tri Thức",
    hero_highlight: "Quản Trị Y Tế",
    hero_desc:
      "Cập nhật các xu hướng mới nhất, bài nghiên cứu chuyên sâu và góc nhìn từ chuyên gia hàng đầu.",
    tab_all: "Tất cả",
    tab_news: "Tin tức",
    tab_research: "Nghiên cứu",
    tab_perspective: "Góc nhìn",
    search_ph: "Tìm kiếm bài viết...",
    loading: "Đang tải dữ liệu...",
    no_result_title: "Không tìm thấy bài viết",
    no_result_desc: "Thử tìm từ khóa khác hoặc chọn chuyên mục khác xem sao.",
    card_read_more: "Đọc chi tiết",
    cta_title: "Bạn muốn nghiên cứu sâu hơn?",
    cta_desc:
      "Đăng ký khóa học Mini MBA để truy cập kho tài liệu nội bộ và các Case Study độc quyền.",
    cta_btn: "Đăng ký tư vấn ngay",
    cat_news: "Tin tức Y tế",
    cat_research: "Nghiên cứu",
    cat_perspective: "Góc nhìn",
    cat_other: "Khác",
  },
  en: {
    breadcrumb_home: "Home",
    breadcrumb_research: "Library & Research",
    hero_title: "Healthcare Management",
    hero_highlight: "Knowledge Hub",
    hero_desc:
      "Update the latest trends, in-depth research articles, and insights from leading experts.",
    tab_all: "All",
    tab_news: "News",
    tab_research: "Research",
    tab_perspective: "Perspective",
    search_ph: "Search articles...",
    loading: "Loading data...",
    no_result_title: "No articles found",
    no_result_desc:
      "Try searching for a different keyword or selecting another category.",
    card_read_more: "Read more",
    cta_title: "Want deeper research?",
    cta_desc:
      "Register for the Mini MBA course to access internal documents and exclusive Case Studies.",
    cta_btn: "Register for consultation",
    cat_news: "Health News",
    cat_research: "Research",
    cat_perspective: "Perspective",
    cat_other: "Other",
  },
};

// Helper format ngày (theo ngôn ngữ)
const formatDate = (dateString, lang) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(
    lang === "vi" ? "vi-VN" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};

export default function ResearchPage() {
  // 1. SET MẶC ĐỊNH LÀ "EN" (TIẾNG ANH)
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Helper màu sắc cho từng chuyên mục
  const getCategoryStyle = (cat) => {
    switch (cat) {
      case "news":
        return {
          label: t.cat_news,
          color: "bg-green-100 text-green-700 border-green-200",
        };
      case "research":
        return {
          label: t.cat_research,
          color: "bg-blue-100 text-blue-700 border-blue-200",
        };
      case "perspective":
        return {
          label: t.cat_perspective,
          color: "bg-purple-100 text-purple-700 border-purple-200",
        };
      default:
        return { label: t.cat_other, color: "bg-slate-100 text-slate-600" };
    }
  };

  // 1. Fetch dữ liệu
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/research/`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
          setFilteredPosts(data);
        }
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 2. Xử lý Lọc & Tìm kiếm (CẬP NHẬT ĐỂ TÌM KIẾM ĐÚNG NGÔN NGỮ)
  useEffect(() => {
    let result = posts;

    if (selectedCategory !== "all") {
      result = result.filter((post) => post.category === selectedCategory);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((post) => {
        // Lấy tiêu đề và tóm tắt theo ngôn ngữ hiện tại để tìm kiếm
        const title = getData(post, "title", lang).toLowerCase();
        const summary = getData(post, "summary", lang).toLowerCase();
        return title.includes(lowerTerm) || summary.includes(lowerTerm);
      });
    }

    setFilteredPosts(result);
  }, [searchTerm, selectedCategory, posts, lang]); // Thêm lang vào dependency

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* --- HERO SECTION --- */}
      <header className="bg-blue-900 text-white pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Top Bar: Breadcrumb + Language Switcher */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium">
              <Link to="/" className="hover:text-white flex items-center gap-1">
                <Home size={14} /> {t.breadcrumb_home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{t.breadcrumb_research}</span>
            </div>

            {/* Nút đổi ngôn ngữ */}
            <button
              onClick={() => setLang(lang === "vi" ? "en" : "vi")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs font-bold transition-colors border border-white/20"
            >
              <Globe size={14} /> {lang === "vi" ? "EN" : "VN"}
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              {t.hero_title}{" "}
              <span className="text-yellow-400">{t.hero_highlight}</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl font-light">
              {t.hero_desc}
            </p>
          </motion.div>
        </div>
      </header>

      {/* --- TOOLBAR (SEARCH & FILTER) --- */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Tabs Category */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {[
              { id: "all", label: t.tab_all },
              { id: "news", label: t.tab_news },
              { id: "research", label: t.tab_research },
              { id: "perspective", label: t.tab_perspective },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-blue-900 text-white shadow-lg shadow-blue-900/20"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t.search_ph}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-full outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- DANH SÁCH BÀI VIẾT (GRID) --- */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="text-center py-20 text-slate-500">{t.loading}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">
              {t.no_result_title}
            </h3>
            <p className="text-slate-500">{t.no_result_desc}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => {
              const catStyle = getCategoryStyle(post.category);
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Ảnh bìa */}
                  <div className="h-48 overflow-hidden relative bg-slate-200">
                    <img
                      src={
                        post.cover_url ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      // Dùng getData cho alt ảnh luôn
                      alt={getData(post, "title", lang)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Badge Category */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${catStyle.color}`}
                      >
                        {catStyle.label}
                      </span>
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />{" "}
                        {formatDate(post.created_at, lang)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} /> {post.author}
                      </span>
                    </div>

                    {/* TITLE: SỬ DỤNG HÀM getData */}
                    <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {getData(post, "title", lang)}
                    </h2>

                    {/* SUMMARY: SỬ DỤNG HÀM getData */}
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                      {getData(post, "summary", lang)}
                    </p>

                    {/* Footer Card */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <Link
                        to={`/research/${post.id}`} // Sử dụng ID thay vì Slug nếu backend chưa hỗ trợ slug
                        state={{ lang: lang }} // QUAN TRỌNG: Truyền ngôn ngữ sang trang chi tiết
                        className="text-blue-700 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
                      >
                        {t.card_read_more} <ArrowRight size={16} />
                      </Link>

                      {post.pdf_url && (
                        <div
                          className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-100"
                          title="Có tài liệu PDF"
                        >
                          <Download size={12} /> PDF
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>

      {/* --- FOOTER CTA --- */}
      <section className="bg-slate-900 text-white py-16 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <BookOpen className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-blue-200 mb-8 text-lg">{t.cta_desc}</p>
          <Link
            to="/training/mini-mba#dang-ky"
            className="inline-block px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full transition-colors"
          >
            {t.cta_btn}
          </Link>
        </div>
      </section>
    </div>
  );
}
