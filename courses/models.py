from django.db import models
from django.utils.html import format_html # Để hiển thị ảnh

class Instructor(models.Model):
    name = models.CharField(max_length=100, verbose_name="Họ và Tên")
    title = models.CharField(max_length=200, verbose_name="Học hàm/Học vị")
    position = models.CharField(max_length=200, verbose_name="Chức vụ")
    
    # --- CÓ CẢ 2 TRƯỜNG ---
    # 1. Upload từ máy
    image = models.ImageField(upload_to='instructors/', verbose_name="Upload Ảnh", blank=True, null=True)
    # 2. Link trực tiếp
    image_url = models.URLField(verbose_name="Hoặc Link Ảnh Online", blank=True, null=True)
    # ----------------------

    description = models.TextField(blank=True, null=True, verbose_name="Mô tả thêm")
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Giảng viên"
        verbose_name_plural = "Danh sách Giảng viên"

class Module(models.Model):
    title = models.CharField(max_length=200, verbose_name="Tên Môn học")
    description = models.TextField(verbose_name="Mô tả")
    image = models.ImageField(upload_to='modules/', verbose_name="Upload Ảnh bìa", blank=True, null=True)
    image_url = models.URLField(verbose_name="Hoặc Link Ảnh Online", blank=True, null=True)
    # Icon lưu tên dạng text (vd: trending, users)
    icon_name = models.CharField(max_length=50, default="book", verbose_name="Tên Icon (VD: users, trending)") 

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Môn học (Module)"
        verbose_name_plural = "Danh sách Môn học"

class ScheduleItem(models.Model):
    TYPE_CHOICES = [
        ('class', 'Buổi học'),
        ('break', 'Nghỉ Đông'),
        ('holiday', 'Nghỉ Lễ'),
    ]
    
    date_str = models.CharField(max_length=50, verbose_name="Ngày hiển thị (VD: 06/12)")
    topic = models.CharField(max_length=200, verbose_name="Chủ đề")
    duration = models.CharField(max_length=100, default="09:00 - 16:30", verbose_name="Thời lượng (Giờ học)")
    professor = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Giảng viên")
    item_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='class', verbose_name="Loại lịch")
    
    def __str__(self):
        return f"{self.date_str} - {self.topic}"

    class Meta:
        verbose_name = "Lịch học"
        verbose_name_plural = "Quản lý Lịch học"

class Registration(models.Model):
    # --- CẬP NHẬT MỚI: QUẢN LÝ TRẠNG THÁI ---
    STATUS_CHOICES = [
        ('new', 'Mới đăng ký'),
        ('contacted', 'Đã liên hệ'),
        ('paid', 'Đã thanh toán'),
        ('canceled', 'Hủy bỏ'),
    ]
    full_name = models.CharField(max_length=100, verbose_name="Họ tên học viên")
    phone = models.CharField(max_length=20, verbose_name="Số điện thoại")
    email = models.EmailField(verbose_name="Email")
    position = models.CharField(max_length=100, blank=True, verbose_name="Nguồn/Chức vụ")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', verbose_name="Trạng thái")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày đăng ký")

    def __str__(self):
        return f"{self.full_name} ({self.get_status_display()})"

    class Meta:
        verbose_name = "Đơn đăng ký"
        verbose_name_plural = "Danh sách Đăng ký"

class CourseOverview(models.Model):
    ICON_CHOICES = [
        ('strategy', 'Chiến lược (Mũi tên lên)'),
        ('finance', 'Tài chính (Sách/Ví)'),
        ('leadership', 'Lãnh đạo (Nhóm người)'),
        ('marketing', 'Marketing (Huy chương/Loa)'),
    ]

    cover_image = models.ImageField(
        upload_to='overviews/covers/', 
        verbose_name="Ảnh bìa (Lớn)",
        null=True, blank=True
    )
    title = models.CharField(max_length=200, verbose_name="Tiêu đề trụ cột")
    description = models.TextField(verbose_name="Mô tả chi tiết")
    icon_type = models.CharField(
        max_length=50, 
        choices=ICON_CHOICES, 
        default='strategy',
        verbose_name="Loại Icon hiển thị"
    )
    order = models.IntegerField(default=0, verbose_name="Thứ tự hiển thị")

    class Meta:
        ordering = ['order']
        verbose_name = "Trụ cột khóa học"
        verbose_name_plural = "Tổng quan (4 Trụ cột)"

    def __str__(self):
        return self.title
class HomepageConfig(models.Model):
    # --- Phần Hero & Thống kê ---
    hero_title = models.CharField(max_length=200, default="Quản Trị", verbose_name="Tiêu đề Hero (Dòng 1)")
    hero_subtitle = models.CharField(max_length=200, default="Chuyển Đổi Số Y Tế", verbose_name="Tiêu đề Hero (Dòng 2 - Màu vàng)")
    
    stat_1 = models.CharField(max_length=50, default="10", verbose_name="Số liệu 1 (Số buổi)")
    stat_2 = models.CharField(max_length=50, default="Hybrid", verbose_name="Số liệu 2 (Hình thức)")
    stat_3 = models.CharField(max_length=50, default="100%", verbose_name="Số liệu 3 (Case Study)")
    stat_4 = models.CharField(max_length=50, default="TRAF", verbose_name="Số liệu 4 (Giảng viên)")
    
    # --- Phần Lợi ích ---
    benefit_title = models.CharField(max_length=200, default="Giải quyết bài toán thực tế...", verbose_name="Tiêu đề Lợi ích")
    benefit_desc = models.TextField(verbose_name="Mô tả Lợi ích", default="Chương trình Mini MBA Y tế được thiết kế...")
    benefits_list = models.TextField(verbose_name="Danh sách lợi ích (Mỗi dòng 1 ý)", help_text="Xuống dòng để tách các ý", default="Học theo mô hình Hybrid\nLý thuyết cô đọng\nCase Study thực tế")

    def __str__(self):
        return "Cấu hình Trang chủ (Chỉ tạo 1 bản ghi)"

    class Meta:
        verbose_name = "Cấu hình Trang chủ"
        verbose_name_plural = "Cấu hình Trang chủ"