import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  LogOut,
  Menu,
  User,
  Clock,
  Video,
  FileText,
  ChevronDown,
  PlayCircle,
  X,
  CheckCircle,
} from "lucide-react";

// Helper formatDate
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // --- STATE DỮ LIỆU ---
  const [schedule, setSchedule] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessons, setLessons] = useState([]);

  // State User & Tiến độ
  const [user, setUser] = useState({
    name: "Đang tải...",
    role: "...",
    progress: { percent: 0, completed: 0, total: 0 },
  });

  // State: Danh sách bài đã học (Lưu ID)
  const [completedLessons, setCompletedLessons] = useState([]);

  // State: Ghi chú cá nhân
  const [openNoteId, setOpenNoteId] = useState(null); // ID bài học đang mở note
  const [noteContent, setNoteContent] = useState(""); // Nội dung note đang gõ
  const [isSavingNote, setIsSavingNote] = useState(false);

  // State: Modal Chi tiết lịch học
  const [selectedScheduleItem, setSelectedScheduleItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. FETCH DỮ LIỆU KHI VÀO TRANG ---
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [resSchedule, resModules, resProfile] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/schedule/", { headers }),
          fetch("http://127.0.0.1:8000/api/modules/", { headers }),
          fetch("http://127.0.0.1:8000/api/profile/", { headers }),
        ]);

        if (resSchedule.ok) setSchedule(await resSchedule.json());
        if (resModules.ok) setModules(await resModules.json());
        if (resProfile.ok) {
          const userData = await resProfile.json();
          setUser(userData);
          // Lưu danh sách bài đã học để tô xanh
          setCompletedLessons(userData.progress.completed_ids || []);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // --- 2. CÁC HÀM XỬ LÝ LOGIC ---

  // Chọn môn học -> Tải bài học
  const handleSelectModule = async (moduleId) => {
    if (selectedModule === moduleId) {
      setSelectedModule(null);
      return;
    }
    setSelectedModule(moduleId);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/lessons/?module=${moduleId}`
      );
      if (res.ok) setLessons(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  // Đánh dấu hoàn thành bài học
  const handleMarkLesson = async (lessonId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://127.0.0.1:8000/api/mark-lesson/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lesson_id: lessonId }),
      });

      if (res.ok) {
        // Cập nhật giao diện ngay lập tức (Optimistic UI)
        if (!completedLessons.includes(lessonId)) {
          const newCompleted = [...completedLessons, lessonId];
          setCompletedLessons(newCompleted);

          // Tự tính lại % tiến độ để thanh màu vàng chạy ngay
          setUser((prev) => {
            const newCount = prev.progress.completed + 1;
            const newPercent = Math.floor(
              (newCount / prev.progress.total) * 100
            );
            return {
              ...prev,
              progress: {
                ...prev.progress,
                completed: newCount,
                percent: newPercent,
              },
            };
          });
        }
      }
    } catch (error) {
      console.error("Lỗi đánh dấu:", error);
    }
  };

  // Mở ô ghi chú & Tải nội dung cũ
  const handleOpenNote = async (lessonId) => {
    if (openNoteId === lessonId) {
      setOpenNoteId(null); // Đóng lại nếu đang mở
      return;
    }

    setOpenNoteId(lessonId);
    setNoteContent("Đang tải...");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://127.0.0.1:8000/api/note/?lesson_id=${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setNoteContent(data.content || "");
      }
    } catch (error) {
      console.error("Lỗi tải note:", error);
      setNoteContent("");
    }
  };

  // Lưu ghi chú
  const handleSaveNote = async (lessonId) => {
    setIsSavingNote(true);
    try {
      const token = localStorage.getItem("accessToken");
      await fetch("http://127.0.0.1:8000/api/note/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lesson_id: lessonId, content: noteContent }),
      });
      alert("Đã lưu ghi chú!");
      setOpenNoteId(null);
    } catch (error) {
      alert("Lỗi khi lưu");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải dữ liệu...
      </div>
    );

  // --- 3. CÁC COMPONENT GIAO DIỆN CON ---

  const ScheduleDetailModal = () => {
    if (!selectedScheduleItem) return null;
    const item = selectedScheduleItem;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedScheduleItem(null)}
        ></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
        >
          <div className="bg-blue-900 p-6 text-white flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{item.topic}</h3>
              <p className="text-blue-200 text-sm mt-1">{item.date_str}</p>
            </div>
            <button
              onClick={() => setSelectedScheduleItem(null)}
              className="bg-white/10 hover:bg-white/20 p-1 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <Clock className="text-yellow-500" size={20} />
              <div>
                <span className="block text-xs text-slate-400 font-bold uppercase">
                  Thời gian
                </span>
                <span className="font-medium">{item.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <User className="text-blue-500" size={20} />
              <div>
                <span className="block text-xs text-slate-400 font-bold uppercase">
                  Giảng viên
                </span>
                <span className="font-medium">
                  {item.prof_name || "Đang cập nhật"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Video className="text-red-500" size={20} />
              <div>
                <span className="block text-xs text-slate-400 font-bold uppercase">
                  Hình thức
                </span>
                <span className="font-medium">Online qua Zoom / Offline</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {item.meeting_link ? (
                <a
                  href={item.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-xl transition-colors shadow-lg shadow-yellow-500/20"
                >
                  Vào lớp học ngay
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed"
                >
                  Chưa có link phòng học
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderMaterialsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Kho Tài liệu & Bài giảng
      </h2>
      <div className="grid gap-4">
        {modules.length === 0 && <p>Chưa có môn học nào.</p>}
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {/* Header Môn học */}
            <div
              onClick={() => handleSelectModule(mod.id)}
              className="p-5 flex items-center justify-between cursor-pointer bg-slate-50 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {mod.title}
                  </h3>
                </div>
              </div>
              <ChevronDown
                className={`text-slate-400 transition-transform duration-300 ${
                  selectedModule === mod.id ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Danh sách Bài học */}
            <AnimatePresence>
              {selectedModule === mod.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-100"
                >
                  <div className="p-4 space-y-3 bg-white">
                    {lessons.length === 0 ? (
                      <p className="text-sm text-slate-400 italic text-center">
                        Chưa có bài học.
                      </p>
                    ) : (
                      lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`p-3 rounded-xl border transition-all flex flex-col gap-3 group ${
                            completedLessons.includes(lesson.id)
                              ? "bg-green-50 border-green-200"
                              : "border-slate-100 hover:border-blue-200 hover:bg-blue-50/50"
                          }`}
                        >
                          <div className="flex gap-3 items-start">
                            {/* Nút Checkbox Hoàn thành */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkLesson(lesson.id);
                              }}
                              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 mt-1 ${
                                completedLessons.includes(lesson.id)
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-slate-300 text-transparent hover:border-green-500"
                              }`}
                              title="Đánh dấu đã học xong"
                            >
                              <CheckCircle size={14} strokeWidth={3} />
                            </button>

                            <div className="flex-1">
                              {/* Dòng Tiêu đề + Nút Note */}
                              <div className="flex justify-between items-start">
                                <h4
                                  className={`font-bold text-sm flex items-center gap-2 ${
                                    completedLessons.includes(lesson.id)
                                      ? "text-green-800"
                                      : "text-slate-800"
                                  }`}
                                >
                                  <span className="text-xs text-slate-400 font-normal">
                                    #{lesson.order}
                                  </span>
                                  <div className="flex flex-col">
                                    <span>{lesson.title}</span>
                                    <span className="text-[10px] text-slate-400 font-normal">
                                      {lesson.created_at
                                        ? `Cập nhật: ${formatDate(
                                            lesson.created_at
                                          )}`
                                        : ""}
                                    </span>
                                  </div>
                                </h4>

                                {/* Nút Ghi chú */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenNote(lesson.id);
                                  }}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    openNoteId === lesson.id
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                  }`}
                                  title="Ghi chú cá nhân"
                                >
                                  <FileText size={16} />
                                </button>
                              </div>

                              {/* Danh sách file đính kèm */}
                              <div className="pl-0 space-y-2 mt-2">
                                {lesson.materials?.map((mat) => (
                                  <a
                                    key={mat.id}
                                    href={mat.file_url || mat.video_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
                                  >
                                    {mat.material_type === "video" ? (
                                      <PlayCircle
                                        size={16}
                                        className="text-red-500"
                                      />
                                    ) : (
                                      <FileText
                                        size={16}
                                        className="text-blue-500"
                                      />
                                    )}
                                    <span className="truncate">
                                      {mat.title}
                                    </span>
                                    {mat.is_public && (
                                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded">
                                        Free
                                      </span>
                                    )}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Khu vực Nhập Ghi chú */}
                          <AnimatePresence>
                            {openNoteId === lesson.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-9"
                              >
                                <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                                  <label className="text-xs font-bold text-yellow-800 mb-1 block">
                                    Ghi chú của bạn:
                                  </label>
                                  <textarea
                                    value={noteContent}
                                    onChange={(e) =>
                                      setNoteContent(e.target.value)
                                    }
                                    className="w-full text-sm bg-white border border-yellow-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 min-h-[80px]"
                                    placeholder="Ghi lại ý tưởng quan trọng..."
                                  ></textarea>
                                  <div className="flex justify-end mt-2">
                                    <button
                                      onClick={() => handleSaveNote(lesson.id)}
                                      disabled={isSavingNote}
                                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-blue-900 text-xs font-bold rounded-lg transition-colors"
                                    >
                                      {isSavingNote
                                        ? "Đang lưu..."
                                        : "Lưu ghi chú"}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Chào mừng, {user.name}! 👋
          </h1>
          <p className="text-blue-200 max-w-2xl">
            Chúc bạn một ngày học tập hiệu quả.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lịch học */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Clock className="text-yellow-500" size={20} /> Lịch học sắp tới
          </h3>
          {schedule.length > 0 ? (
            schedule.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-5 items-center"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center shrink-0 text-blue-900 border border-blue-100">
                  <Calendar size={20} className="mb-1 opacity-50" />
                  <span className="text-xs font-bold text-center leading-tight">
                    {item.date_str ? item.date_str.split("/")[0] : "..."}
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="font-bold text-slate-900">{item.topic}</h4>
                  <p className="text-sm text-slate-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                    <Clock size={14} /> {item.duration} <User size={14} />{" "}
                    {item.prof_name || "Giảng viên"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedScheduleItem(item)}
                  className="px-5 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg text-sm hover:bg-blue-200 transition-colors"
                >
                  Chi tiết
                </button>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic">Chưa có lịch học.</p>
          )}
        </div>

        {/* Tiến độ */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-700 mb-4">Tiến độ học tập</h4>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all duration-1000"
                  style={{ width: `${user.progress?.percent || 0}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-slate-600">
                {user.progress?.percent || 0}%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Đã hoàn thành {user.progress?.completed || 0}/
              {user.progress?.total || 0} bài học
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar & Mobile Menu */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-20"
          />
        )}
      </AnimatePresence>
      <motion.aside
        className={`fixed md:relative z-30 h-full bg-blue-900 text-white flex flex-col transition-all duration-300 ${
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        }`}
      >
        <div className="h-20 flex items-center justify-center border-b border-blue-800/50">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-blue-900">
            T
          </div>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Tổng quan"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={<BookOpen size={20} />}
            text="Tài liệu & Bài giảng"
            active={activeTab === "materials"}
            onClick={() => setActiveTab("materials")}
            isOpen={isSidebarOpen}
          />
        </nav>
        <div className="p-4 border-t border-blue-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-300 hover:text-white w-full p-2"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
              {user.name?.charAt(0)}
            </div>
            <span className="text-sm font-bold text-slate-700 hidden md:block">
              {user.name}
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-20">
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "materials" && renderMaterialsTab()}
        </div>
      </main>

      {/* MODAL */}
      <ScheduleDetailModal />
    </div>
  );
}

function SidebarItem({ icon, text, active, onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active
          ? "bg-yellow-500 text-blue-900 font-bold"
          : "text-blue-200 hover:bg-white/10"
      }`}
    >
      <div>{icon}</div>
      {isOpen && <span className="whitespace-nowrap">{text}</span>}
    </button>
  );
}
