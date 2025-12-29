import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Download,
  FileText,
  Share2,
  Bookmark,
  ChevronRight,
  Mail,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://mini-mba-backend.onrender.com";

// Helper format ngày
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ResearchDetail() {
  const { slug } = useParams(); // Lấy slug từ URL
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false); // Modal tải tài liệu

  // 1. Fetch dữ liệu bài viết & bài liên quan
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Lấy chi tiết bài viết
        const resPost = await fetch(`${API_URL}/api/research/${slug}/`);
        if (resPost.ok) {
          const data = await resPost.json();
          setPost(data);
        }

        // Lấy danh sách bài viết khác (để làm sidebar)
        const resRelated = await fetch(`${API_URL}/api/research/`);
        if (resRelated.ok) {
          const data = await resRelated.json();
          // Lọc bỏ bài hiện tại và lấy 5 bài mới nhất
          setRelatedPosts(data.filter((p) => p.slug !== slug).slice(0, 5));
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển bài
  }, [slug]);

  // Xử lý khi bấm tải tài liệu
  const handleDownloadSubmit = (e) => {
    e.preventDefault();
    // Sau này có thể gọi API lưu email vào CRM
    alert("Cảm ơn! Tài liệu đang được tải xuống...");
    setShowEmailModal(false);
    if (post?.pdf_url) {
      window.open(post.pdf_url, "_blank");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-blue-600 font-bold animate-pulse">
          Đang tải nội dung...
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Không tìm thấy bài viết
        </h2>
        <Link
          to="/research"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Quay lại thư viện
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* --- THANH ĐIỀU HƯỚNG NHANH --- */}
      <div className="bg-slate-900 text-white py-3 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link
            to="/research"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Thư viện Nghiên cứu
          </Link>
          <div className="flex gap-4">
            <button
              className="text-slate-300 hover:text-white"
              title="Lưu bài viết"
            >
              <Bookmark size={18} />
            </button>
            <button className="text-slate-300 hover:text-white" title="Chia sẻ">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- HERO HEADER --- */}
      <header className="bg-slate-50 border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            {post.category === "research"
              ? "Nghiên cứu khoa học"
              : post.category === "news"
              ? "Tin tức Y tế"
              : "Góc nhìn chuyên gia"}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {post.author.charAt(0)}
              </div>
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} /> {formatDate(post.created_at)}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} /> 10 phút đọc
            </div>
          </div>
        </div>
      </header>

      {/* --- NỘI DUNG CHÍNH (2 CỘT) --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* CỘT TRÁI: NỘI DUNG BÀI VIẾT (8/12) */}
        <article className="lg:col-span-8">
          {/* Tóm tắt (Sapo) */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8 italic text-slate-700 text-lg leading-relaxed">
            {post.summary}
          </div>

          {/* Ảnh bìa */}
          {post.cover_url && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={post.cover_url}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
              <p className="text-center text-slate-400 text-xs mt-2 italic">
                Hình ảnh minh họa cho bài nghiên cứu
              </p>
            </div>
          )}

          {/* Nội dung HTML (Render từ Admin) */}
          <div
            className="prose prose-lg prose-slate max-w-none 
            prose-headings:font-bold prose-headings:text-slate-900 
            prose-a:text-blue-700 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tag và Chữ ký */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-slate-500 text-sm">
              <strong>Từ khóa:</strong> Chuyển đổi số, Quản trị bệnh viện, Y tế
              thông minh, Mini MBA.
            </p>
          </div>
        </article>

        {/* CỘT PHẢI: SIDEBAR (4/12) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Box Tải Tài Liệu (Lead Magnet) */}
          {post.pdf_url && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-3 mb-4 text-yellow-800">
                <FileText size={32} />
                <h3 className="font-bold text-lg">Tài liệu nghiên cứu gốc</h3>
              </div>
              <p className="text-slate-600 text-sm mb-6">
                Tải xuống bản PDF đầy đủ của nghiên cứu này (bao gồm số liệu chi
                tiết và biểu đồ).
              </p>
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
              >
                <Download size={18} /> Tải PDF miễn phí
              </button>
            </div>
          )}

          {/* Box Bài viết mới nhất */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bookmark className="text-blue-600" size={20} /> Bài viết liên
              quan
            </h3>
            <div className="space-y-4">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  to={`/research/${p.slug}`}
                  className="group block"
                >
                  <h4 className="font-bold text-slate-700 text-sm group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">
                    {p.title}
                  </h4>
                  <span className="text-xs text-slate-400">
                    {formatDate(p.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Box Quảng cáo Khóa học */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-6 text-white text-center">
            <h3 className="font-bold text-xl mb-2 text-yellow-400">
              Mini MBA Y Tế
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Nâng cao năng lực quản trị và chuyển đổi số cho lãnh đạo bệnh
              viện.
            </p>
            <Link
              to="/#dang-ky"
              className="inline-block px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-lg text-sm transition-colors"
            >
              Tìm hiểu ngay
            </Link>
          </div>
        </aside>
      </div>

      {/* --- MODAL NHẬP EMAIL --- */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowEmailModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full relative z-10 shadow-2xl"
            >
              <button
                onClick={() => setShowEmailModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <Mail size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Gửi tài liệu qua Email
                </h3>
                <p className="text-slate-500 text-sm mt-2">
                  Vui lòng nhập email để hệ thống gửi link tải tài liệu Full PDF
                  cho bạn.
                </p>
              </div>

              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email công việc
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vidu@benhvien.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors"
                >
                  Gửi ngay
                </button>
                <p className="text-xs text-center text-slate-400">
                  Chúng tôi cam kết bảo mật thông tin của bạn.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
