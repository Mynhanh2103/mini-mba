import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  Cpu,
  Users,
} from "lucide-react";

const translations = {
  vi: {
    page_title: "Dịch Vụ Tư Vấn Chuyển Đổi Số Y Tế",
    page_sub:
      "Giải pháp chiến lược – Đồng hành cùng hệ thống Y tế Việt Nam chuyển mình số hóa.",
    cap_title: "Năng Lực Tư Vấn Cốt Lõi",
    cap_desc:
      "Sự kết hợp giữa tri thức y khoa – công nghệ – quản trị tạo nên năng lực tư vấn vượt trội. Mạng lưới chuyên gia gồm:",
    cap_1: "Chuyên gia quản trị y tế",
    cap_1_desc: "Am hiểu mô hình vận hành, tối ưu quy trình.",
    cap_2: "Chuyên gia IT y tế",
    cap_2_desc: "Kinh nghiệm triển khai HIS, LIS, PACS phức tạp.",
    cap_3: "Chuyên gia lâm sàng",
    cap_3_desc: "Đảm bảo giải pháp phù hợp chuyên môn y khoa.",
    area_title: "Lĩnh Vực Tư Vấn Chuyên Sâu",
    area_1: "Chiến lược CĐS",
    area_1_desc:
      "Đánh giá mức độ trưởng thành số, xây dựng lộ trình triển khai.",
    area_2: "Quản lý Vận hành",
    area_2_desc: "Tối ưu dòng bệnh nhân, quản lý nguồn lực, tài chính.",
    area_3: "Công nghệ Y tế",
    area_3_desc: "Tư vấn Telehealth, HIS/LIS/PACS, AI & IoT.",
    area_4: "Đào tạo Năng lực",
    area_4_desc: "Huấn luyện đội ngũ IT và nhân viên y tế.",
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
      "A unique combination of medical expertise, technology, and management. Our expert network includes:",
    cap_1: "Healthcare Management Experts",
    cap_1_desc: "Deep insights into hospital operations and optimization.",
    cap_2: "Health IT Professionals",
    cap_2_desc: "Experience in deploying complex HIS, LIS, PACS.",
    cap_3: "Clinical Specialists",
    cap_3_desc: "Ensuring solutions align with clinical workflows.",
    area_title: "Key Consulting Areas",
    area_1: "Digital Strategy",
    area_1_desc: "Assessing digital maturity and building roadmaps.",
    area_2: "Hospital Operations",
    area_2_desc: "Optimizing patient flow, resources, and finance.",
    area_3: "Healthcare Technology",
    area_3_desc: "Consulting on Telehealth, HIS/LIS/PACS, AI & IoT.",
    area_4: "Capacity Building",
    area_4_desc: "Training IT teams and medical staff on digital workflows.",
    cta_title: "Need Strategic Consulting?",
    cta_desc:
      "Contact us to build the most suitable digital transformation roadmap.",
    cta_btn: "Contact Experts",
  },
};

export default function ConsultingPage() {
  const [lang, setLang] = useState("vi");
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <nav className="absolute top-0 w-full z-50 py-6 px-6 flex justify-end">
        <button
          onClick={() => setLang(lang === "vi" ? "en" : "vi")}
          className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white font-bold border border-white/20 hover:bg-white/20"
        >
          <Globe size={18} /> {lang === "vi" ? "EN" : "VN"}
        </button>
      </nav>

      <div className="bg-blue-900 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          {t.page_title}
        </h1>
        <p className="text-blue-100 max-w-3xl mx-auto text-lg">{t.page_sub}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">
              {t.cap_title}
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">{t.cap_desc}</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 shrink-0" />
                <span>
                  <strong>{t.cap_1}:</strong> {t.cap_1_desc}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 shrink-0" />
                <span>
                  <strong>{t.cap_2}:</strong> {t.cap_2_desc}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-1 shrink-0" />
                <span>
                  <strong>{t.cap_3}:</strong> {t.cap_3_desc}
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-100 rounded-2xl p-8 h-full flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
              className="rounded-xl shadow-lg"
              alt="Consulting Team"
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-12">{t.area_title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="mt-20 bg-slate-900 rounded-3xl p-12 text-center text-white">
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
    </div>
  );
}
