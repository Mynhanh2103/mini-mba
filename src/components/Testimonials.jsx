import React, { useState, useEffect } from "react";
import { Quote, Star } from "lucide-react";

// Cấu hình API URL
const API_URL =
  import.meta.env.VITE_API_URL || "https://mini-mba-admin.onrender.com";

// --- TỪ ĐIỂN ANH/VIỆT CHO FEEDBACK ---
const translations = {
  vi: {
    badge: "Feedback",
    title: "Học viên & Chuyên gia nói gì?",
    subtitle:
      "Lắng nghe chia sẻ thực tế từ các Bác sĩ, Nhà quản lý bệnh viện đã tham gia chương trình đào tạo của chúng tôi.",
    loading: "Đang tải đánh giá...",
    cta_text: "Bạn đã sẵn sàng gia nhập cộng đồng quản trị y tế?",
    cta_btn: "Đăng ký ngay hôm nay",
  },
  en: {
    badge: "Feedback",
    title: "What Students & Experts Say",
    subtitle:
      "Hear real insights from Doctors and Hospital Managers who have joined our training programs.",
    loading: "Loading reviews...",
    cta_text: "Ready to join the healthcare management community?",
    cta_btn: "Register Today",
  },
};

// --- DỮ LIỆU MẪU (FALLBACK) ĐA NGÔN NGỮ ---

// --- COMPONENT CHÍNH ---
// Nhận prop `lang` từ cha (mặc định là 'vi')
export default function Testimonials({ lang = "vi" }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[lang]; // Lấy bộ từ điển theo ngôn ngữ

  useEffect(() => {
    fetch(`${API_URL}/api/reviews/`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Lỗi tải reviews");
      })
      .then((data) => setReviews(data))
      .catch((err) => {
        console.error(err);
        setReviews([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Nếu API trả về rỗng, dùng dữ liệu mẫu tương ứng với ngôn ngữ đang chọn
  //const displayReviews = reviews.length > 0 ? reviews : sampleReviews[lang];

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background trang trí */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-yellow-400 font-bold tracking-widest uppercase text-sm">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 mb-6">
            {t.title}
          </h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto font-light">
            {t.subtitle}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-blue-200">{t.loading}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl relative hover:bg-white/10 transition-all duration-300 group hover:-translate-y-2"
              >
                <Quote
                  className="absolute top-6 right-6 text-blue-500 opacity-20 group-hover:opacity-40 transition-opacity"
                  size={60}
                />

                <div className="flex gap-1 mb-6 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>

                <p className="text-blue-50 mb-8 text-lg italic leading-relaxed font-light">
                  "{item.content}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="w-14 h-14 rounded-full border-2 border-yellow-500 p-0.5 shrink-0 overflow-hidden">
                    <img
                      src={
                        item.avatar ||
                        `https://ui-avatars.com/api/?name=${item.name}&background=random`
                      }
                      alt={item.name}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${item.name}`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">
                      {item.name}
                    </h4>
                    <p className="text-sm text-blue-300 font-medium">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-4 text-sm">{t.cta_text}</p>
          <button
            onClick={() =>
              document
                .getElementById("dang-ky")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg shadow-yellow-500/20 transition-all"
          >
            {t.cta_btn}
          </button>
        </div>
      </div>
    </section>
  );
}
