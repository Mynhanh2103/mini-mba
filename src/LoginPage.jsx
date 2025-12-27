import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Gọi API Login của Django
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        // Lưu token
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        // Chuyển hướng
        navigate("/dashboard");
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      console.error(error);
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans">
      {/* 1. BACKGROUND (Đồng bộ với Hero Section) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80"></div>
      </div>

      {/* 2. LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Nút quay lại trang chủ */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors text-sm font-medium group"
        >
          <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20">
            <ArrowLeft size={16} />
          </div>
          Quay lại Trang chủ
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Header: Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-900 text-white flex items-center justify-center font-bold text-xl rounded-lg shadow-lg">
                  T
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-blue-900">
                  TBI<span className="font-light">.Institute</span>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Cổng Học Viên
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Đăng nhập để truy cập kho tài liệu & bài giảng
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                    placeholder="Ví dụ: minhanh_2006"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-4 rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng nhập ngay"
                )}
              </button>
            </form>
          </div>

          {/* Footer Card */}
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Chưa có tài khoản?{" "}
              <Link
                to="/#dang-ky"
                className="text-blue-600 font-bold hover:underline"
              >
                Đăng ký tư vấn
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-blue-200/60 text-xs mt-8">
          © 2025 TBI Institute. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
