import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
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
  Mail,
  X,
} from "lucide-react";
import axios from "axios";
import { useLanguage } from "./LanguageContext";
// 1. CẤU HÌNH API: Trỏ thẳng về Render để tránh lỗi kết nối localhost
const API_BASE = import.meta.env.VITE_API_URL || "https://127.0.0.1:8000";

const translations = {
  vi: {
    loading: "Đang tải nội dung...",
    notFound: "Không tìm thấy bài viết hoặc bài viết đã bị xóa.",
    backToLibrary: "Quay lại thư viện",
    readTime: "phút đọc",
    keywords: "Từ khóa",
    originalDoc: "Tài liệu nghiên cứu gốc",
    descDoc: "Tải xuống bản PDF đầy đủ của nghiên cứu này.",
    downloadBtn: "Tải PDF miễn phí",
    relatedPosts: "Bài viết liên quan",
    adsTitle: "Mini MBA Y Tế",
    adsDesc:
      "Nâng cao năng lực quản trị và chuyển đổi số cho lãnh đạo bệnh viện.",
    learnMore: "Tìm hiểu ngay",
    emailTitle: "Gửi tài liệu qua Email",
    emailDesc: "Vui lòng nhập email để nhận link tải tài liệu.",
    emailLabel: "Email công việc",
    sendBtn: "Gửi ngay",
    securityNote: "Chúng tôi cam kết bảo mật thông tin.",
    alertDownloading: "Cảm ơn! Tài liệu đang được tải xuống...",
    illustrativeImage: "Hình ảnh minh họa",
    category: {
      research: "Nghiên cứu",
      news: "Tin tức",
      expert: "Góc nhìn",
    },
  },
  en: {
    loading: "Loading content...",
    notFound: "Article not found or deleted.",
    backToLibrary: "Back to Library",
    readTime: "min read",
    keywords: "Keywords",
    originalDoc: "Original Research Document",
    descDoc: "Download the full PDF version of this research.",
    downloadBtn: "Download PDF Free",
    relatedPosts: "Related Articles",
    adsTitle: "Mini MBA Healthcare",
    adsDesc: "Enhancing management capabilities for hospital leaders.",
    learnMore: "Learn More",
    emailTitle: "Send Document via Email",
    emailDesc: "Please enter your email to receive the download link.",
    emailLabel: "Work Email",
    sendBtn: "Send Now",
    securityNote: "We are committed to protecting your privacy.",
    alertDownloading: "Thank you! The document is downloading...",
    illustrativeImage: "Illustrative image",
    category: {
      research: "Research",
      news: "News",
      expert: "Expert View",
    },
  },
};

export default function ResearchDetail() {
  const { slug } = useParams();

  // 3. LẤY NGÔN NGỮ TỪ STATE (Mặc định EN nếu ko có)
  const location = useLocation();
  const {lang, toggleLanguage} = useLanguage();
  const t = translations[lang] || translations.en;

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Helper lấy dữ liệu đa ngôn ngữ
  const getData = (item, field) => {
    if (!item) return "";
    if (lang === "en") {
      const enValue = item[`${field}_en`];
      return enValue && enValue.trim() !== "" ? enValue : item[field];
    }
    return item[field];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      lang === "vi" ? "vi-VN" : "en-US"
    );
  };

  // 4. GỌI API (SỬA LỖI LOADING)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const timeStamp = new Date().getTime();

        // [THAY ĐỔI 2] Gọi API bằng slug
        // Lưu ý: Backend Django cần thiết lập lookup_field = 'slug' thì mới chạy được dòng này
        const postRes = await axios.get(
          `${API_BASE}/api/research/${slug}/?t=${timeStamp}`
        );
        setPost(postRes.data);

        // Gọi API lấy bài liên quan
        const relatedRes = await axios.get(
          `${API_BASE}/api/research/?t=${timeStamp}`
        );
        if (relatedRes.data) {
          // [THAY ĐỔI 3] Lọc bài viết hiện tại dựa trên slug
          setRelatedPosts(
            relatedRes.data.filter((p) => p.slug !== slug).slice(0, 5)
          );
        }
      } catch (error) {
        console.error("Lỗi tải trang chi tiết:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchData();
      window.scrollTo(0, 0);
    }
  }, [slug]);
  const handleDownloadSubmit = (e) => {
    e.preventDefault();
    alert(t.alertDownloading);
    setShowEmailModal(false);
    if (post?.pdf_url) {
      window.open(post.pdf_url, "_blank");
    }
  };

  // --- RENDER GIAO DIỆN ---

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-slate-500 font-medium">{t.loading}</div>
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6 p-6 text-center">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
          <FileText size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {t.notFound}
          </h2>
          <p className="text-slate-500 mb-6">Slug: {slug}</p>
          <Link
            to="/research"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} /> {t.backToLibrary}
          </Link>
        </div>
      </div>
    );

  const displayTitle = getData(post, "title");
  const displaySummary = getData(post, "summary");
  const displayContent = getData(post, "content");

  const categoryLabel =
    post.category === "research"
      ? t.category.research
      : post.category === "news"
      ? t.category.news
      : t.category.expert;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* TOP BAR */}
      <div className="bg-slate-900 text-white py-3 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link
            to="/research"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> {t.backToLibrary}
          </Link>
          <div className="flex gap-4">
            <button className="text-slate-300 hover:text-white">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* HERO HEADER */}
      <header className="bg-slate-50 border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            {categoryLabel}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {displayTitle}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {post.author ? post.author.charAt(0) : "A"}
              </div>
              <span>{post.author || "Admin"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} /> {formatDate(post.created_at)}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} /> 5 {t.readTime}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ARTICLE */}
        <article className="lg:col-span-8">
          {displaySummary && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8 italic text-slate-700 text-lg leading-relaxed">
              {displaySummary}
            </div>
          )}

          {(post.cover_image || post.cover_url) && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={post.cover_image || post.cover_url}
                alt={displayTitle}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-lg prose-slate max-w-none 
            prose-headings:font-bold prose-headings:text-slate-900 
            prose-a:text-blue-700 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        </article>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Download Box */}
          {post.pdf_url && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-3 mb-4 text-yellow-800">
                <FileText size={32} />
                <h3 className="font-bold text-lg">{t.originalDoc}</h3>
              </div>
              <p className="text-slate-600 text-sm mb-6">{t.descDoc}</p>
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <Download size={18} /> {t.downloadBtn}
              </button>
            </div>
          )}

          {/* Related Posts */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bookmark className="text-blue-600" size={20} /> {t.relatedPosts}
            </h3>
            <div className="space-y-4">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/research/${p.slug}`}
                  state={{ lang: lang }} // Truyền ngôn ngữ để giữ trạng thái
                  className="group block"
                >
                  <h4 className="font-bold text-slate-700 text-sm group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">
                    {getData(p, "title")}
                  </h4>
                  <span className="text-xs text-slate-400">
                    {formatDate(p.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* EMAIL MODAL */}
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
                  {t.emailTitle}
                </h3>
                <p className="text-slate-500 text-sm mt-2">{t.emailDesc}</p>
              </div>

              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@hospital.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors"
                >
                  {t.sendBtn}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
