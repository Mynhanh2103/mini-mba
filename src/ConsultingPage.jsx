import React, { useState, useEffect } from "react";
import axios from "axios"; // Import thư viện gọi API
import {
  CheckCircle,
  Layers,
  Zap,
  Globe,
  Cpu,
  Users,
  BookOpen,
  Lightbulb,
  ArrowRight,
  X,
} from "lucide-react";

// --- CẤU HÌNH NGÔN NGỮ TĨNH (Giữ nguyên phần này) ---
const translations = {
  vi: {
    page_title: "Dịch Vụ Tư Vấn Chuyển Đổi Số Y Tế",
    page_sub:
      "Giải pháp chiến lược – Đồng hành cùng hệ thống Y tế Việt Nam chuyển mình số hóa.",
    cap_title: "Năng Lực Tư Vấn Cốt Lõi",
    cap_desc:
      "Sự kết hợp giữa tri thức y khoa – công nghệ – quản trị tạo nên năng lực tư vấn vượt trội.",
    cap_1: "Chuyên gia quản trị y tế",
    cap_1_desc: "Am hiểu mô hình vận hành, tối ưu quy trình.",
    cap_2: "Chuyên gia IT y tế",
    cap_2_desc: "Kinh nghiệm triển khai HIS, LIS, PACS phức tạp.",
    cap_3: "Chuyên gia lâm sàng",
    cap_3_desc: "Đảm bảo giải pháp phù hợp chuyên môn y khoa.",
    area_title: "Lĩnh Vực Tư Vấn Chuyên Sâu",
    area_1: "Chiến lược CĐS",
    area_1_desc: "Đánh giá mức độ trưởng thành số, xây dựng lộ trình.",
    area_2: "Quản lý Vận hành",
    area_2_desc: "Tối ưu dòng bệnh nhân, quản lý nguồn lực.",
    area_3: "Công nghệ Y tế",
    area_3_desc: "Tư vấn Telehealth, AI & IoT.",
    area_4: "Đào tạo Năng lực",
    area_4_desc: "Huấn luyện đội ngũ IT và nhân viên y tế.",

    lib_title: "Thư Viện Giải Pháp & Kiến Thức",
    lib_sub:
      "Các bài phân tích chuyên sâu và giải pháp thực tiễn từ Smart Health Solutions.",
    btn_detail: "Xem chi tiết",
    tab_context: "Bối cảnh & Vấn đề",
    tab_solution: "Giải pháp SHS",
    cta_modal: "Liên hệ tư vấn giải pháp này",

    cta_title: "Bạn cần tư vấn chiến lược?",
    cta_desc: "Liên hệ ngay để xây dựng lộ trình chuyển đổi số phù hợp nhất.",
    cta_btn: "Liên hệ chuyên gia",
  },
  en: {
    page_title: "Digital Transformation Consulting",
    page_sub:
      "Strategic Solutions for a Smarter, More Efficient Healthcare System.",
    cap_title: "Core Consulting Capabilities",
    cap_desc:
      "A unique combination of medical expertise, technology, and management.",
    cap_1: "Healthcare Management Experts",
    cap_1_desc: "Deep insights into hospital operations.",
    cap_2: "Health IT Professionals",
    cap_2_desc: "Experience in deploying complex HIS, LIS, PACS.",
    cap_3: "Clinical Specialists",
    cap_3_desc: "Ensuring solutions align with clinical workflows.",
    area_title: "Key Consulting Areas",
    area_1: "Digital Strategy",
    area_1_desc: "Assessing digital maturity and roadmaps.",
    area_2: "Hospital Operations",
    area_2_desc: "Optimizing patient flow and resources.",
    area_3: "Healthcare Technology",
    area_3_desc: "Consulting on Telehealth, AI & IoT.",
    area_4: "Capacity Building",
    area_4_desc: "Training IT teams and medical staff.",

    lib_title: "Solutions & Knowledge Library",
    lib_sub:
      "In-depth analysis and practical solutions from Smart Health Solutions.",
    btn_detail: "View Details",
    tab_context: "Context & Problem",
    tab_solution: "SHS Solution",
    cta_modal: "Consult on this solution",

    cta_title: "Need Strategic Consulting?",
    cta_desc: "Contact us to build the most suitable roadmap.",
    cta_btn: "Contact Experts",
  },
};

export default function ConsultingPage() {
  const [lang, setLang] = useState("vi");
  const t = translations[lang];

  // --- STATE QUẢN LÝ DỮ LIỆU TỪ API ---
  const [solutions, setSolutions] = useState([]); // Chứa danh sách bài viết từ Admin
  const [loading, setLoading] = useState(true); // Trạng thái đang tải

  // State cho Modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("context");

  // --- GỌI API LẤY DỮ LIỆU ---
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        // Thay đổi URL này thành URL thật của dự án Django của bạn
        // Ví dụ: http://localhost:8000/api/consulting-solutions/
        const response = await axios.get(
          "http://127.0.0.1:8000/api/consulting-solutions/"
        );
        setSolutions(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giải pháp:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  // Helper an toàn để lấy dữ liệu (tránh lỗi nếu field null)
  const getData = (item, field) => {
    if (!item) return "";
    return item[`${field}_${lang}`] || "";
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* LANGUAGE SWITCHER */}
      <nav className="absolute top-0 w-full z-50 py-6 px-6 flex justify-end">
        <button
          onClick={() => setLang(lang === "vi" ? "en" : "vi")}
          className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white font-bold border border-white/20 hover:bg-white/20 transition"
        >
          <Globe size={18} /> {lang === "vi" ? "EN" : "VN"}
        </button>
      </nav>

      {/* HERO SECTION */}
      <div className="bg-blue-900 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          {t.page_title}
        </h1>
        <p className="text-blue-100 max-w-3xl mx-auto text-lg">{t.page_sub}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* SECTION 1: NĂNG LỰC TƯ VẤN (Tĩnh) */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">
              {t.cap_title}
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">{t.cap_desc}</p>
            <ul className="space-y-4">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>{t[`cap_${i}`]}:</strong> {t[`cap_${i}_desc`]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-100 rounded-2xl p-8 flex items-center justify-center">
            {/* Ảnh tĩnh minh họa team */}
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
              className="rounded-xl shadow-lg"
              alt="Consulting Team"
            />
          </div>
        </div>

        {/* SECTION 2: LĨNH VỰC TƯ VẤN (Tĩnh) */}
        <h2 className="text-3xl font-bold text-center mb-12">{t.area_title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { icon: <Layers />, title: t.area_1, desc: t.area_1_desc },
            { icon: <Zap />, title: t.area_2, desc: t.area_2_desc },
            { icon: <Cpu />, title: t.area_3, desc: t.area_3_desc },
            { icon: <Users />, title: t.area_4, desc: t.area_4_desc },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* === NEW SECTION: THƯ VIỆN GIẢI PHÁP (DYNAMIC DATA TỪ ADMIN) === */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t.lib_title}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{t.lib_sub}</p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Render danh sách từ state 'solutions' */}
              {solutions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setActiveTab("context");
                  }}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative shrink-0">
                    {/* Sử dụng item.thumbnail từ Django Model */}
                    <img
                      // Logic: Nếu có thumbnail thì dùng, nếu không có (null) thì dùng ảnh placeholder mặc định
                      src={
                        item.thumbnail
                          ? item.thumbnail
                          : "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={getData(item, "title")}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <h3 className="font-bold text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {getData(item, "title")}
                    </h3>
                    <div className="mt-auto flex items-center gap-2 text-blue-600 text-sm font-semibold">
                      {t.btn_detail} <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA FOOTER */}
        <div className="bg-slate-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t.cta_title}</h2>
          <p className="text-blue-200 mb-8">{t.cta_desc}</p>
          <a
            href="mailto:mr.truongchuong@gmail.com"
            className="inline-block px-8 py-3 bg-yellow-500 text-blue-900 font-bold rounded-full hover:bg-yellow-400 transition-colors"
          >
            {t.cta_btn}
          </a>
        </div>
      </div>

      {/* === MODAL POPUP (HIỂN THỊ CHI TIẾT) === */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50 shrink-0">
              <h3 className="text-2xl font-bold pr-8 text-slate-900">
                {getData(selectedItem, "title")}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full transition text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs Controller */}
            <div className="flex border-b border-slate-200 shrink-0">
              <button
                onClick={() => setActiveTab("context")}
                className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                  activeTab === "context"
                    ? "bg-white text-rose-600 border-rose-600"
                    : "bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100"
                }`}
              >
                <BookOpen size={18} />
                {t.tab_context}
              </button>
              <button
                onClick={() => setActiveTab("solution")}
                className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                  activeTab === "solution"
                    ? "bg-blue-50 text-blue-700 border-blue-700"
                    : "bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100"
                }`}
              >
                <Lightbulb size={18} />
                {t.tab_solution}
              </button>
            </div>

            {/* Modal Content - HTML từ Admin (Rich Text) */}
            <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
              <div
                className="prose prose-lg prose-slate max-w-none prose-img:rounded-xl"
                dangerouslySetInnerHTML={{
                  __html:
                    activeTab === "context"
                      ? getData(selectedItem, "context")
                      : getData(selectedItem, "solution"),
                }}
              />

              {/* Call To Action trong Modal */}
              {activeTab === "solution" && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
                  <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                    {t.cta_modal}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
