import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Microscope,
  Globe,
  FileText,
  LayoutGrid,
  Home,
} from "lucide-react";

// (Dữ liệu fetch API giữ nguyên, chỉ thay phần hiển thị text tĩnh)
const API_URL =
  import.meta.env.VITE_API_URL || "https://mini-mba-admin.onrender.com";

const translations = {
  vi: {
    title: "Trung Tâm Nghiên Cứu & Tri Thức",
    desc: "Nghiên cứu là nền tảng của mọi đổi mới. Chúng tôi kết nối chuyên gia trong nước và quốc tế để phát triển giải pháp thực tiễn.",
    sec_1: "Nghiên Cứu Hàn Lâm",
    sec_1_desc:
      "Phát triển tri thức mới về mô hình CĐS, quản trị y tế và ứng dụng AI/IoT.",
    sec_2: "Nghiên Cứu Ứng Dụng",
    sec_2_desc:
      "Xây dựng mô hình vận hành số, đánh giá hiệu quả HIS/LIS/PACS và tối ưu hóa.",
    sec_3: "Hợp Tác Quốc Tế",
    sec_3_desc:
      "Kết nối tri thức toàn cầu, chuyển giao công nghệ y khoa 4.0 từ đối tác quốc tế.",
    search_ph: "Tìm kiếm bài viết...",
    read_more: "Đọc chi tiết",
  },
  en: {
    title: "Research & Knowledge Hub",
    desc: "Research is the foundation of innovation. We connect local and international experts to develop practical healthcare solutions.",
    sec_1: "Academic Research",
    sec_1_desc:
      "Developing new knowledge on digital transformation models, management, and AI/IoT.",
    sec_2: "Applied Research",
    sec_2_desc:
      "Building digital operating models, evaluating HIS/LIS/PACS effectiveness.",
    sec_3: "International Collaboration",
    sec_3_desc:
      "Connecting global expertise, transferring Medical 4.0 technologies.",
    search_ph: "Search articles...",
    read_more: "Read more",
  },
};

export default function ResearchPage() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lang, setLang] = useState("vi");
  const t = translations[lang];

  useEffect(() => {
    fetch(`${API_URL}/api/research/`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="absolute top-0 w-full z-50 py-6 px-6 flex justify-between items-center">
        {/* --- NÚT HOME MỚI --- */}
        <Link
          to="/"
          className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white font-bold border border-white/20 hover:bg-white/20 transition"
        >
          <Home size={18} /> {lang === "vi" ? "Trang chủ" : "Home"}
        </Link>

        {/* Nút đổi ngôn ngữ cũ */}
        <button
          onClick={() => setLang(lang === "vi" ? "en" : "vi")}
          className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white font-bold border border-white/20 hover:bg-white/20"
        >
          <Globe size={18} /> {lang === "vi" ? "EN" : "VN"}
        </button>
      </nav>

      <header className="bg-gradient-to-r from-purple-900 to-blue-900 text-white pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            {t.title}
          </h1>
          <p className="text-purple-100 text-lg max-w-3xl leading-relaxed">
            {t.desc}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/10">
              <Microscope className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="font-bold text-xl mb-2">{t.sec_1}</h3>
              <p className="text-sm text-purple-200">{t.sec_1_desc}</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/10">
              <FileText className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="font-bold text-xl mb-2">{t.sec_2}</h3>
              <p className="text-sm text-blue-200">{t.sec_2_desc}</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/10">
              <Globe className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="font-bold text-xl mb-2">{t.sec_3}</h3>
              <p className="text-sm text-green-200">{t.sec_3_desc}</p>
            </div>
          </div>
        </div>
      </header>

      {/* TOOLBAR */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-lg">
            <LayoutGrid className="text-purple-600" />
            <span>{filteredPosts.length} Articles</span>
          </div>
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t.search_ph}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 focus:bg-white border border-transparent focus:border-purple-500 rounded-full outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              to={`/research/${post.slug}`}
              key={post.id}
              className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-slate-100"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.cover_url || "https://placehold.co/600x400"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex gap-2 mb-3">
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-grow">
                  {post.summary}
                </p>
                <div className="flex items-center text-purple-600 font-bold text-sm mt-auto">
                  {t.read_more}{" "}
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
