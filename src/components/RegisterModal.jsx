import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Building2,
  User,
  Phone,
  Mail,
  BookOpen,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function RegisterModal({ isOpen, onClose, selectedModule }) {
  // Thêm trường workplace (Đơn vị công tác)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    workplace: "",
  });
  const [status, setStatus] = useState("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const payload = {
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        selected_module: selectedModule ? selectedModule.id : null,
        // Gộp đơn vị công tác vào ghi chú để lưu vào Backend (nếu chưa có cột riêng)
        note: `Đơn vị: ${formData.workplace} | ${
          selectedModule ? "Đăng ký lẻ" : "Đăng ký trọn gói"
        }`,
      };

      const res = await fetch(`${API_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          onClose();
          setStatus("idle");
          setFormData({ full_name: "", phone: "", email: "", workplace: "" });
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* HEADER: Sang trọng hơn */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen size={20} className="text-yellow-400" />
            Đăng ký Khóa học
          </h3>
          <p className="text-blue-200 text-sm mt-1 pr-8">
            {selectedModule
              ? selectedModule.title
              : "Chương trình Mini MBA Quản trị Bệnh viện"}
          </p>
        </div>

        {/* BODY */}
        <div className="p-8">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Đăng ký thành công!
              </h3>
              <p className="text-slate-600 mt-2">
                Cảm ơn <strong>{formData.full_name}</strong>. Ban tuyển sinh sẽ
                liên hệ qua SĐT <strong>{formData.phone}</strong> trong vòng 24h
                làm việc.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Họ và tên bác sĩ/anh chị
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-3 text-slate-400"
                      size={18}
                    />
                    <input
                      required
                      type="text"
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-3 text-slate-400"
                      size={18}
                    />
                    <input
                      required
                      type="tel"
                      placeholder="0909..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-3 text-slate-400"
                      size={18}
                    />
                    <input
                      required
                      type="email"
                      placeholder="email@benhvien..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">
                    Đơn vị công tác (Bệnh viện/Khoa)
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-3 top-3 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="VD: Bệnh viện Đa khoa X"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={formData.workplace}
                      onChange={(e) =>
                        setFormData({ ...formData, workplace: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {status === "error" && (
                <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">
                  Có lỗi kết nối, vui lòng thử lại sau.
                </p>
              )}

              <button
                disabled={status === "loading"}
                type="submit"
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-xl shadow-lg shadow-yellow-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
              >
                {status === "loading"
                  ? "Đang xử lý..."
                  : "Xác nhận Giữ chỗ ngay"}
              </button>

              <p className="text-xs text-center text-slate-400">
                Thông tin được bảo mật tuyệt đối. Chúng tôi sẽ gửi xác nhận qua
                Email.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
