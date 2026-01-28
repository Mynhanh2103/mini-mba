import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Home,
  Globe,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useLanguage } from "./LanguageContext"; // Kiểm tra đường dẫn này
import { address } from "framer-motion/client";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const translations = {
  vi: {
    title: "Liên Hệ Với Chúng Tôi",
    sub: "Hãy để lại thông tin, chúng tôi sẽ giải đáp mọi thắc mắc của bạn.",
    info_title: "Thông Tin Liên Hệ",
    form_title: "Gửi Tin Nhắn",
    lbl_name: "Họ và tên",
    plh_name: "Nhập họ tên của bạn",
    lbl_email: "Email",
    plh_email: "example@gmail.com",
    lbl_phone: "Số điện thoại",
    plh_phone: "090...",
    lbl_content: "Nội dung trao đổi",
    plh_content: "Bạn cần hỗ trợ vấn đề gì?",
    btn_submit: "Gửi thông tin",
    sending: "Đang gửi...",
    success_title: "Gửi thành công!",
    success_desc: "Chúng tôi đã nhận được thông tin và sẽ phản hồi sớm nhất.",
    home_btn: "Trang chủ",
    address_text: "268 Lý Thường Kiệt, Phường Diên Hồng, Tp. Hồ Chí Minh",
    mobile_btn: "Điện thoại",
    address_btn: "Địa chỉ"

  },
  en: {
    title: "Contact Us",
    sub: "Leave your information, we will answer all your questions.",
    info_title: "Contact Information",
    form_title: "Send a Message",
    lbl_name: "Full Name",
    plh_name: "Enter your name",
    lbl_email: "Email",
    plh_email: "example@gmail.com",
    lbl_phone: "Phone Number",
    plh_phone: "+84...",
    lbl_content: "Message Content",
    plh_content: "How can we help you?",
    btn_submit: "Send Message",
    sending: "Sending...",
    success_title: "Sent Successfully!",
    success_desc: "We have received your message and will respond shortly.",
    home_btn: "Home",
    address_text: "268 Ly Thuong Kiet, Dien Hong Ward, Ho Chi Minh City",
    mobile_btn: "Mobile",
    address_btn: "Address",
  },
};

export default function ContactPage() {
  const { lang, toggleLanguage } = useLanguage();
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      full_name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      content: e.target.content.value,
    };

    try {
      await axios.post(`${API_BASE}/api/contact/`, formData);
      setSuccess(true);
      e.target.reset();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR */}
      <nav className="absolute top-0 w-full z-50 py-6 px-6 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-blue-900 font-bold border border-white/50 hover:bg-white transition shadow-sm"
        >
          <Home size={18} /> {t.home_btn}
        </Link>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-slate-900 font-bold border border-white/50 hover:bg-white transition shadow-sm"
        >
          <Globe size={18} /> {lang === "vi" ? "EN" : "VN"}
        </button>
      </nav>

      {/* HEADER */}
      <header className="bg-blue-900 text-white pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {t.title}
          </h1>
          <p className="text-blue-200 text-lg">{t.sub}</p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-16 -mt-10 relative z-10">
        <div className="grid md:grid-cols-12 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          {/* LEFT COLUMN: INFO */}
          <div className="md:col-span-5 bg-gradient-to-br from-blue-800 to-slate-900 text-white p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-8 border-b border-blue-700 pb-4">
                {t.info_title}
              </h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-700/50 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="text-yellow-400" size={20} />
                  </div>
                  <div>
                    <p className="text-blue-300 text-xs uppercase font-bold tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:smarthealthsolutions@gmail.com"
                      className="font-semibold hover:text-yellow-400 transition"
                    >
                      smarthealthsolutions@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-700/50 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="text-yellow-400" size={20} />
                  </div>
                  <div>
                    <p className="text-blue-300 text-xs uppercase font-bold tracking-wider mb-1">
                      {t.mobile_btn}
                    </p>
                    <a
                      href="tel:0903928127"
                      className="font-semibold hover:text-yellow-400 transition"
                    >
                      0903 928 127
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-700/50 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="text-yellow-400" size={20} />
                  </div>
                  <div>
                    <p className="text-blue-300 text-xs uppercase font-bold tracking-wider mb-1">
                      {t.address_btn}
                    </p>
                    <p className="font-semibold leading-relaxed">
                      {t.address_text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-blue-700/50">
              <p className="text-sm text-blue-300">Smart Health Solutions</p>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="md:col-span-7 p-10 bg-white">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {t.success_title}
                </h3>
                <p className="text-slate-500 mb-8">{t.success_desc}</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  {t.form_title}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      {t.lbl_name}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={t.plh_name}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      {t.lbl_phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder={t.plh_phone}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    {t.lbl_email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={t.plh_email}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    {t.lbl_content}
                  </label>
                  <textarea
                    name="content"
                    required
                    rows="4"
                    placeholder={t.plh_content}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    t.sending
                  ) : (
                    <>
                      {t.btn_submit} <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
