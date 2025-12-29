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
} from "lucide-react";

// --- CẤU HÌNH ---
const API_URL = "https://mini-mba-admin.onrender.com"; // Đổi thành link Render của bạn nếu cần

// Helper format ngày
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper màu sắc cho từng chuyên mục
const getCategoryStyle = (cat) => {
  switch (cat) {
    case "news":
      return {
        label: "Tin tức Y tế",
        color: "bg-green-100 text-green-700 border-green-200",
      };
    case "research":
      return {
        label: "Nghiên cứu",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      };
    case "perspective":
      return {
        label: "Góc nhìn",
        color: "bg-purple-100 text-purple-700 border-purple-200",
      };
    default:
      return { label: "Khác", color: "bg-slate-100 text-slate-600" };
  }
};

export default function ResearchPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 1. Fetch dữ liệu
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Gọi API Public (không cần Token)
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

  // 2. Xử lý Lọc & Tìm kiếm
  useEffect(() => {
    let result = posts;

    // Lọc theo Category
    if (selectedCategory !== "all") {
      result = result.filter((post) => post.category === selectedCategory);
    }

    // Lọc theo Search Term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerTerm) ||
          post.summary.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredPosts(result);
  }, [searchTerm, selectedCategory, posts]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* --- HERO SECTION --- */}
      <header className="bg-blue-900 text-white pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-6 font-medium">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              <Home size={14} /> Trang chủ
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">Thư viện & Nghiên cứu</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Kho Tri Thức{" "}
              <span className="text-yellow-400">Quản Trị Y Tế</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl font-light">
              Cập nhật các xu hướng mới nhất, bài nghiên cứu chuyên sâu và góc
              nhìn từ chuyên gia hàng đầu.
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
              { id: "all", label: "Tất cả" },
              { id: "news", label: "Tin tức" },
              { id: "research", label: "Nghiên cứu" },
              { id: "perspective", label: "Góc nhìn" },
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
              placeholder="Tìm kiếm bài viết..."
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
          <div className="text-center py-20 text-slate-500">
            Đang tải dữ liệu...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">
              Không tìm thấy bài viết
            </h3>
            <p className="text-slate-500">
              Thử tìm từ khóa khác hoặc chọn chuyên mục khác xem sao.
            </p>
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
                      alt={post.title}
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
                        <Calendar size={14} /> {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} /> {post.author}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                      {post.summary}
                    </p>

                    {/* Footer Card */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <button className="text-blue-700 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                        Đọc chi tiết <ArrowRight size={16} />
                      </button>

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
          <h2 className="text-3xl font-bold mb-4">
            Bạn muốn nghiên cứu sâu hơn?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Đăng ký khóa học Mini MBA để truy cập kho tài liệu nội bộ và các
            Case Study độc quyền.
          </p>
          <Link
            to="/#dang-ky"
            className="inline-block px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full transition-colors"
          >
            Đăng ký tư vấn ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
