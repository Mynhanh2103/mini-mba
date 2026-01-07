import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Award,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  Home,
} from "lucide-react";

const translations = {
  vi: {
    title: "Chương Trình Đào Tạo",
    desc: "Hệ thống đào tạo toàn diện giúp phát triển năng lực lãnh đạo y tế trong kỷ nguyên số. Thiết kế thực tiễn - Chuẩn quốc tế - Ứng dụng ngay.",
    p1_title: "AI trong Chăm Sóc Sức Khỏe",
    p1_desc: "Ứng dụng Trí tuệ nhân tạo để nâng tầm chất lượng điều trị.",
    p2_title: "Mini MBA Quản Trị CĐS Y Tế",
    p2_desc: "Dẫn dắt chiến lược số hóa trong tổ chức y tế.",
    p3_title: "Mini MBA Quản Trị Y Tế",
    p3_desc: "Phát triển năng lực lãnh đạo cho nhà quản lý y tế hiện đại.",
    p4_title: "JCI Concepts - Quản Lý Chất Lượng",
    p4_desc: "Nâng tầm chất lượng bệnh viện theo chuẩn quốc tế JCI.",
    view_detail: "Xem chi tiết",
  },
  en: {
    title: "Training Programs",
    desc: "Comprehensive training system to develop healthcare leadership in the digital era. Practical design - International standards - Immediate application.",
    p1_title: "AI in Healthcare",
    p1_desc: "Transforming Care with Artificial Intelligence.",
    p2_title: "Mini MBA in Healthcare Digitalization",
    p2_desc: "Leading Digital Transformation in Healthcare.",
    p3_title: "Mini MBA for Healthcare Management",
    p3_desc: "Building Strong, Modern Healthcare Leaders.",
    p4_title: "JCI Concepts for Quality Management",
    p4_desc: "Elevating Quality to International Standards.",
    view_detail: "View details",
  },
};

export default function TrainingPage() {
  const [lang, setLang] = useState("vi");
  const t = translations[lang];

  const programs = [
    {
      id: 1,
      title: t.p1_title,
      desc: t.p1_desc,
      icon: <Zap size={32} />,
      color: "bg-purple-100 text-purple-600",
      link: "#",
    },
    {
      id: 2,
      title: t.p2_title,
      desc: t.p2_desc,
      icon: <TrendingUp size={32} />,
      color: "bg-blue-100 text-blue-600",
      link: "/training/mini-mba", // Dẫn về Landing Page Mini MBA
    },
    {
      id: 3,
      title: t.p3_title,
      desc: t.p3_desc,
      icon: <Award size={32} />,
      color: "bg-yellow-100 text-yellow-600",
      link: "#",
    },
    {
      id: 4,
      title: t.p4_title,
      desc: t.p4_desc,
      icon: <ShieldCheck size={32} />,
      color: "bg-green-100 text-green-600",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className="absolute top-0 w-full z-50 py-6 px-6 flex justify-between items-center">
        {/* --- NÚT HOME MỚI --- */}
        <Link
          to="/"
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-slate-700 font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition"
        >
          <Home size={18} /> {lang === "vi" ? "Trang chủ" : "Home"}
        </Link>

        {/* Nút đổi ngôn ngữ cũ (Giữ nguyên) */}
        <button
          onClick={() => setLang(lang === "vi" ? "en" : "vi")}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-slate-700 font-bold border border-slate-200 shadow-sm hover:bg-slate-50"
        >
          <Globe size={18} /> {lang === "vi" ? "EN" : "VN"}
        </button>
      </nav>

      <header className="bg-white py-20 px-6 text-center border-b border-slate-200">
        <h1 className="text-4xl font-extrabold mb-4 text-slate-900">
          {t.title}
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t.desc}</p>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((prog) => (
            <Link
              to={prog.link}
              key={prog.id}
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all flex gap-6 items-start"
            >
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${prog.color}`}
              >
                {prog.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {prog.title}
                </h3>
                <p className="text-slate-600 mb-4">{prog.desc}</p>
                <span className="text-sm font-bold uppercase tracking-wider text-blue-600 underline decoration-2 underline-offset-4">
                  {t.view_detail}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
