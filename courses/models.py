from django.db import models
from django.utils.html import format_html

# --- 1. GIẢNG VIÊN ---
class Instructor(models.Model):
    name = models.CharField(max_length=100, verbose_name="Họ và Tên")
    # Thêm trường tiếng Anh
    title = models.CharField(max_length=200, verbose_name="Học hàm/Học vị (VN)")
    title_en = models.CharField(max_length=200, verbose_name="Học hàm/Học vị (EN)", blank=True, null=True)
    
    position = models.CharField(max_length=200, verbose_name="Chức vụ (VN)")
    position_en = models.CharField(max_length=200, verbose_name="Chức vụ (EN)", blank=True, null=True)
    
    image = models.ImageField(upload_to='instructors/', verbose_name="Upload Ảnh", blank=True, null=True)
    image_url = models.URLField(verbose_name="Hoặc Link Ảnh Online", blank=True, null=True)
    
    description = models.TextField(blank=True, null=True, verbose_name="Mô tả thêm (VN)")
    description_en = models.TextField(blank=True, null=True, verbose_name="Mô tả thêm (EN)")
    
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = "Giảng viên"
        verbose_name_plural = "Danh sách Giảng viên"

# --- 2. MÔN HỌC ---
class Module(models.Model):
    title = models.CharField(max_length=200, verbose_name="Tên Môn học (VN)")
    title_en = models.CharField(max_length=200, verbose_name="Tên Môn học (EN)", blank=True, null=True)

    description = models.TextField(verbose_name="Mô tả (VN)")
    description_en = models.TextField(verbose_name="Mô tả (EN)", blank=True, null=True)

    image = models.ImageField(upload_to='modules/', verbose_name="Upload Ảnh bìa", blank=True, null=True)
    image_url = models.URLField(verbose_name="Hoặc Link Ảnh Online", blank=True, null=True)
    icon_name = models.CharField(max_length=50, default="book", verbose_name="Tên Icon") 

    def __str__(self):
        return self.title
    class Meta:
        verbose_name = "Môn học (Module)"
        verbose_name_plural = "Danh sách Môn học"

# --- 3. LỊCH HỌC ---
class ScheduleItem(models.Model):
    TYPE_CHOICES = [('class', 'Buổi học'), ('break', 'Nghỉ Đông'), ('holiday', 'Nghỉ Lễ')]
    
    date_str = models.CharField(max_length=50, verbose_name="Ngày hiển thị")
    
    topic = models.CharField(max_length=200, verbose_name="Chủ đề (VN)")
    topic_en = models.CharField(max_length=200, verbose_name="Chủ đề (EN)", blank=True, null=True)

    duration = models.CharField(max_length=100, default="09:00 - 16:30", verbose_name="Thời lượng")
    professor = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Giảng viên")
    item_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='class', verbose_name="Loại lịch")
    
    def __str__(self):
        return f"{self.date_str} - {self.topic}"
    class Meta:
        verbose_name = "Lịch học"
        verbose_name_plural = "Quản lý Lịch học"

# --- 4. TỔNG QUAN ---
class CourseOverview(models.Model):
    ICON_CHOICES = [('strategy', 'Chiến lược'), ('finance', 'Tài chính'), ('leadership', 'Lãnh đạo'), ('marketing', 'Marketing')]

    cover_image = models.ImageField(upload_to='overviews/covers/', verbose_name="Ảnh bìa", null=True, blank=True)
    
    title = models.CharField(max_length=200, verbose_name="Tiêu đề (VN)")
    title_en = models.CharField(max_length=200, verbose_name="Tiêu đề (EN)", blank=True, null=True)

    description = models.TextField(verbose_name="Mô tả (VN)")
    description_en = models.TextField(verbose_name="Mô tả (EN)", blank=True, null=True)

    icon_type = models.CharField(max_length=50, choices=ICON_CHOICES, default='strategy', verbose_name="Loại Icon")
    order = models.IntegerField(default=0, verbose_name="Thứ tự")

    class Meta:
        ordering = ['order']
        verbose_name = "Trụ cột khóa học"
        verbose_name_plural = "Tổng quan (4 Trụ cột)"
    def __str__(self): return self.title

# --- 5. CẤU HÌNH TRANG CHỦ ---
class HomepageConfig(models.Model):
    # Hero
    hero_title = models.CharField(max_length=200, default="Quản Trị", verbose_name="Tiêu đề 1 (VN)")
    hero_title_en = models.CharField(max_length=200, default="Management", verbose_name="Tiêu đề 1 (EN)", blank=True)

    hero_subtitle = models.CharField(max_length=200, default="Chuyển Đổi Số Y Tế", verbose_name="Tiêu đề 2 (VN)")
    hero_subtitle_en = models.CharField(max_length=200, default="Healthcare Digital Transformation", verbose_name="Tiêu đề 2 (EN)", blank=True)
    
    # Stats (Số liệu thì thường không cần dịch số, chỉ dịch chữ nếu có)
    stat_1 = models.CharField(max_length=50, default="10", verbose_name="Số liệu 1")
    stat_2 = models.CharField(max_length=50, default="Hybrid", verbose_name="Số liệu 2")
    stat_3 = models.CharField(max_length=50, default="100%", verbose_name="Số liệu 3")
    stat_4 = models.CharField(max_length=50, default="TRAF", verbose_name="Số liệu 4")
    
    # Lợi ích
    benefit_title = models.CharField(max_length=200, default="Giải quyết...", verbose_name="Tiêu đề Lợi ích (VN)")
    benefit_title_en = models.CharField(max_length=200, default="Solving...", verbose_name="Tiêu đề Lợi ích (EN)", blank=True)

    benefit_desc = models.TextField(verbose_name="Mô tả Lợi ích (VN)", default="...")
    benefit_desc_en = models.TextField(verbose_name="Mô tả Lợi ích (EN)", default="...", blank=True)

    benefits_list = models.TextField(verbose_name="List Lợi ích (VN)", help_text="Xuống dòng để tách ý", default="...")
    benefits_list_en = models.TextField(verbose_name="List Lợi ích (EN)", help_text="Xuống dòng để tách ý", default="...", blank=True)

    def __str__(self): return "Cấu hình Trang chủ"
    class Meta: verbose_name = "Cấu hình Trang chủ"
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
    # Footer
    footer_text = models.CharField(max_length=200, default="© 2025 TBI. All rights reserved.", verbose_name="Footer Text (VN)")
    footer_text_en = models.CharField(max_length=200, default="© 2025 TBI. All rights reserved.", verbose_name="Footer Text (EN)", blank=True)
    def __str__(self):
        return f"{self.full_name} ({self.get_status_display()})"

    class Meta:
        verbose_name = "Đơn đăng ký"
        verbose_name_plural = "Danh sách Đăng ký"