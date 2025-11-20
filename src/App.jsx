import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Users, TrendingUp, Award, CheckCircle, 
  ChevronDown, Star, ArrowRight, Phone, Mail, MapPin, Menu, X 
} from 'lucide-react'

// --- DỮ LIỆU MÔ PHỎNG (Nội dung chuẩn Mini MBA - CBI Style) ---
const MODULES = [
  {
    id: 1,
    title: "Tư duy & Hoạch định Chiến lược",
    icon: <TrendingUp className="w-6 h-6" />,
    desc: "Nắm vững quy trình xây dựng chiến lược, từ phân tích môi trường kinh doanh đến thiết lập lợi thế cạnh tranh bền vững.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Quản trị Tài chính dành cho Lãnh đạo",
    icon: <BookOpen className="w-6 h-6" />,
    desc: "Đọc hiểu báo cáo tài chính, quản trị dòng tiền và ra quyết định đầu tư thông minh mà không cần là chuyên gia kế toán.",
    img: "https://images.unsplash.com/photo-1554224155-98406852d03d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Nghệ thuật Lãnh đạo & Quản trị Nhân sự",
    icon: <Users className="w-6 h-6" />,
    desc: "Kỹ năng thu phục nhân tâm, xây dựng văn hóa doanh nghiệp và tối ưu hóa hiệu suất đội ngũ.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Marketing & Sales Thời đại số",
    icon: <Award className="w-6 h-6" />,
    desc: "Xây dựng thương hiệu, thấu hiểu khách hàng và các chiến lược tăng trưởng doanh thu đột phá.",
    img: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80"
  }
]

const TESTIMONIALS = [
  {
    name: "Nguyễn Văn A",
    role: "CEO, Tech Solutions",
    content: "Khóa học Mini MBA tại CBI đã thay đổi hoàn toàn tư duy quản trị của tôi. Rất thực tế và áp dụng được ngay vào doanh nghiệp.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
  },
  {
    name: "Trần Thị B",
    role: "HR Manager, Global Corp",
    content: "Giảng viên là những chuyên gia đầu ngành. Kiến thức cô đọng, không lan man lý thuyết. Networking rất chất lượng.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
  }
]

// --- COMPONENT CON ---

const FeatureCard = ({ item, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
  >
    <div className="h-48 overflow-hidden">
      <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    </div>
    <div className="p-6">
      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {item.icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
    </div>
  </motion.div>
)

const StatItem = ({ number, label }) => (
  <div className="text-center text-white p-4">
    <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">{number}</div>
    <div className="text-blue-100 text-sm uppercase tracking-wider font-medium">{label}</div>
  </div>
)

// --- MAIN APP COMPONENT ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Hiệu ứng header khi scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo giả lập CBI */}
            <div className="w-10 h-10 bg-blue-900 text-white flex items-center justify-center font-bold text-xl rounded-lg shadow-lg">C</div>
            <span className={`font-extrabold text-2xl tracking-tight ${scrolled ? 'text-blue-900' : 'text-white'}`}>CBI<span className="font-light">.Institute</span></span>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden md:flex gap-8 text-sm font-medium ${scrolled ? 'text-slate-600' : 'text-white/90'}`}>
            <a href="#chuong-trinh" className="hover:text-yellow-500 transition">Chương trình</a>
            <a href="#loi-ich" className="hover:text-yellow-500 transition">Lợi ích</a>
            <a href="#giang-vien" className="hover:text-yellow-500 transition">Giảng viên</a>
            <a href="#cam-nhan" className="hover:text-yellow-500 transition">Học viên nói gì</a>
          </div>

          <button className="hidden md:block bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-6 py-2 rounded-full transition-transform transform active:scale-95 shadow-lg shadow-yellow-500/30">
            Đăng ký ngay
          </button>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`md:hidden ${scrolled ? 'text-slate-900' : 'text-white'}`}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="flex flex-col p-6 gap-4 text-slate-700 font-medium">
                <a href="#chuong-trinh" onClick={() => setIsMenuOpen(false)}>Chương trình</a>
                <a href="#loi-ich" onClick={() => setIsMenuOpen(false)}>Lợi ích</a>
                <button className="bg-blue-900 text-white py-3 rounded-lg font-bold">Đăng ký tư vấn</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image với lớp phủ */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover"
            alt="Business Meeting"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/80 to-blue-900/40"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-yellow-400 text-sm font-bold mb-6 tracking-wider uppercase">
              Chương trình đào tạo quản lý cấp cao
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Mini MBA <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">Tinh Hoa Quản Trị Thực Chiến</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              Được thiết kế đặc biệt cho các nhà quản lý bận rộn. Cô đọng kiến thức MBA 2 năm chỉ trong 3 tháng. Nâng tầm tư duy, bứt phá sự nghiệp tại CBI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full shadow-xl shadow-yellow-500/30 transition-all transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2">
                Nhận Brochure <ArrowRight className="w-5 h-5"/>
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-bold rounded-full transition-all text-lg">
                Xem Nội Dung
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </header>

      {/* --- STATS SECTION --- */}
      <section className="py-10 bg-blue-900 relative -mt-2">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-blue-800/50">
          <StatItem number="10+" label="Năm Kinh Nghiệm" />
          <StatItem number="5000+" label="Học Viên Tốt Nghiệp" />
          <StatItem number="50+" label="Chuyên Gia Hàng Đầu" />
          <StatItem number="98%" label="Hài Lòng Về Khóa Học" />
        </div>
      </section>

      {/* --- PROBLEM vs SOLUTION (WHY US) --- */}
      <section id="loi-ich" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80" 
              className="relative rounded-3xl shadow-2xl z-10"
              alt="Why Choose CBI"
            />
            {/* Floating Card */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs z-20 hidden md:block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle size={20}/></div>
                <span className="font-bold text-slate-800">Chứng chỉ uy tín</span>
              </div>
              <p className="text-xs text-slate-500">Được công nhận bởi các tập đoàn hàng đầu và mạng lưới doanh nghiệp đối tác.</p>
            </motion.div>
          </div>

          <div>
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Tại sao chọn Mini MBA tại CBI?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-6">Giải pháp tối ưu cho nhà quản lý bận rộn</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Bạn muốn nâng cao năng lực quản trị nhưng không có 2 năm để học Thạc sĩ? Chương trình Mini MBA của chúng tôi được thiết kế để cô đọng những gì tinh túy nhất, giúp bạn áp dụng ngay vào công việc điều hành hàng ngày.
            </p>

            <ul className="space-y-4">
              {[
                "Tiết kiệm 80% thời gian so với MBA truyền thống",
                "Phương pháp Case-study (Tình huống thực tế) từ Harvard",
                "Mở rộng Networking với cộng đồng 5000+ quản lý",
                "Cam kết hỗ trợ tư vấn sau khóa học trọn đời"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle className="text-yellow-500 w-5 h-5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- CURRICULUM SECTION --- */}
      <section id="chuong-trinh" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Khung Chương Trình Đào Tạo</h2>
            <p className="text-slate-600">Hệ thống kiến thức được chuẩn hóa quốc tế, tinh chỉnh phù hợp với môi trường kinh doanh tại Việt Nam.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MODULES.map((mod, index) => (
              <FeatureCard key={mod.id} item={mod} index={index} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="text-blue-700 font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
              Xem chi tiết đề cương khóa học <ArrowRight className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </section>

      {/* --- LECTURERS & TESTIMONIALS --- */}
      <section id="giang-vien" className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Left: Lecturers Info */}
            <div>
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Đội ngũ chuyên gia</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-6">Học từ những người giỏi nhất</h2>
              <p className="text-slate-600 mb-8">
                Giảng viên tại CBI không chỉ là những học giả, họ là những CEO, Chủ tịch hội đồng quản trị đang trực tiếp điều hành các doanh nghiệp lớn. Họ mang đến những bài học "xương máu" mà sách vở không bao giờ có.
              </p>
              
              <div className="flex -space-x-4 mb-8">
                {[1,2,3,4].map(i => (
                  <img key={i} className="w-14 h-14 rounded-full border-4 border-white shadow-md" src={`https://i.pravatar.cc/150?img=${i+10}`} alt="Speaker" />
                ))}
                <div className="w-14 h-14 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                  +12
                </div>
              </div>

              <button className="px-6 py-3 border border-blue-900 text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition">
                Xem hồ sơ giảng viên
              </button>
            </div>

            {/* Right: Testimonials Slider style */}
            <div className="bg-blue-900 rounded-3xl p-8 md:p-12 text-white relative">
              <Star className="text-yellow-400 w-10 h-10 mb-6" fill="currentColor" />
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
                "{TESTIMONIALS[0].content}"
              </p>
              <div className="flex items-center gap-4">
                <img src={TESTIMONIALS[0].avatar} className="w-12 h-12 rounded-full border-2 border-yellow-400" alt="User" />
                <div>
                  <h4 className="font-bold text-lg">{TESTIMONIALS[0].name}</h4>
                  <p className="text-blue-300 text-sm">{TESTIMONIALS[0].role}</p>
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500 opacity-10 rounded-tr-full"></div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CTA / REGISTRATION FORM --- */}
      <section id="dang-ky" className="py-24 bg-gradient-to-br from-slate-50 to-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Form Info Side */}
            <div className="bg-blue-900 p-10 md:w-2/5 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-4">Đăng ký tư vấn</h3>
                <p className="text-blue-200 mb-8 text-sm">Để lại thông tin, bộ phận tuyển sinh của CBI sẽ liên hệ gửi brochure chi tiết và ưu đãi học phí tháng này.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-yellow-400"/> <span>0909.123.456</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-yellow-400"/> <span>tuyensinh@cbi.edu.vn</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-yellow-400"/> <span>Q.3, TP. Hồ Chí Minh</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 md:mt-0">
                <p className="text-xs text-blue-400 uppercase tracking-widest mb-2">Follow us</p>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer">f</div>
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer">in</div>
                </div>
              </div>
            </div>

            {/* Form Input Side */}
            <div className="p-10 md:w-3/5">
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="09xxxxxxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email (Công việc)</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="email@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Chức vụ hiện tại</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                    <option>Quản lý cấp trung (Manager)</option>
                    <option>Giám đốc / C-level</option>
                    <option>Chủ doanh nghiệp</option>
                    <option>Nhân viên tiềm năng</option>
                  </select>
                </div>
                
                <button type="button" className="w-full bg-yellow-500 text-blue-900 font-bold py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 mt-4">
                  Gửi đăng ký ngay
                </button>
                <p className="text-xs text-center text-slate-400 mt-3">*Thông tin của bạn được bảo mật tuyệt đối.</p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h2 className="text-white text-2xl font-bold mb-4">CBI Institute</h2>
            <p className="max-w-sm mb-6">Viện Đào tạo và Phát triển Năng lực. Đơn vị hàng đầu trong lĩnh vực đào tạo quản trị doanh nghiệp thực chiến tại Việt Nam.</p>
            <span className="text-xs">© 2025 CBI. All rights reserved.</span>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Chương trình</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Mini MBA</a></li>
              <li><a href="#" className="hover:text-white">CEO Quản trị</a></li>
              <li><a href="#" className="hover:text-white">Giám đốc Nhân sự (CHRO)</a></li>
              <li><a href="#" className="hover:text-white">Giám đốc Tài chính (CFO)</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-white">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="hover:text-white">Liên hệ</a></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  )
}
