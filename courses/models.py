from django.db import models
from django.utils.html import format_html
from django.core.validators import FileExtensionValidator
from django.conf import settings
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
    title = models.CharField(max_length=200, verbose_name="Tên Module")
    description = models.TextField(verbose_name="Mô tả ngắn")
    
    # --- CÁC TRƯỜNG MỚI CẦN THÊM ---
    order = models.IntegerField(default=0, verbose_name="Số thứ tự (1, 2, 3...)")
    duration = models.CharField(max_length=50, default="4 giờ", verbose_name="Thời lượng", help_text="Ví dụ: 4 Buổi học")
    has_certificate = models.BooleanField(default=True, verbose_name="Có cấp chứng chỉ không?")
    is_active = models.BooleanField(default=True, verbose_name="Đang tuyển sinh")
    
    # (Giữ nguyên các trường cũ nếu có)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order}. {self.title}"

    class Meta:
        ordering = ['order'] # Tự động sắp xếp theo số thứ tự
        verbose_name = "Học phần (Module)"
        verbose_name_plural = "Quản lý Modules"
# --- 3. LỊCH HỌC ---
class ScheduleItem(models.Model):
    TYPE_CHOICES = [('class', 'Buổi học'), ('break', 'Nghỉ Đông'), ('holiday', 'Nghỉ Lễ')]
    
    date_str = models.CharField(max_length=50, verbose_name="Ngày hiển thị")
    
    topic = models.CharField(max_length=200, verbose_name="Chủ đề (VN)")
    topic_en = models.CharField(max_length=200, verbose_name="Chủ đề (EN)", blank=True, null=True)

    duration = models.CharField(max_length=100, default="09:00 - 16:30", verbose_name="Thời lượng")
    professor = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Giảng viên")
    item_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='class', verbose_name="Loại lịch")
   # meeting_link = models.URLField(verbose_name="Link Zoom/Google Meet", blank=True, null=True, help_text="Dán link phòng học online vào đây")
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
    benefit_title = models.TextField(default="Giải quyết bài toán thực tế của bản thân\n& tổ chức", verbose_name="Tiêu đề Lợi ích (VN)")
    benefit_title_en = models.TextField(default="Solving real problems for yourself\n& your organization", verbose_name="Tiêu đề Lợi ích (EN)", blank=True)
    benefit_desc = models.TextField(verbose_name="Mô tả Lợi ích (VN)", default="...")
    benefit_desc_en = models.TextField(verbose_name="Mô tả Lợi ích (EN)", default="...", blank=True)

    benefits_list = models.TextField(verbose_name="List Lợi ích (VN)", help_text="Xuống dòng để tách ý", default="...")
    benefits_list_en = models.TextField(verbose_name="List Lợi ích (EN)", help_text="Xuống dòng để tách ý", default="...", blank=True)
    footer_text = models.CharField(max_length=200, default="© 2025 TBI. All rights reserved.", verbose_name="Footer Text (VN)")
    footer_text_en = models.CharField(max_length=200, default="© 2025 TBI. All rights reserved.", verbose_name="Footer Text (EN)", blank=True)
    def __str__(self): return "Cấu hình Trang chủ"
    class Meta: verbose_name = "Cấu hình Trang chủ"

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons', verbose_name="Thuộc Môn học")
    
    title = models.CharField(max_length=200, verbose_name="Tên bài học (VN)")
    title_en = models.CharField(max_length=200, verbose_name="Tên bài học (EN)", blank=True, null=True)
    
    # [MỚI] Slug để tạo URL đẹp (VD: bai-1-tong-quan)
    slug = models.SlugField(max_length=250, unique=True, verbose_name="Slug (URL)", help_text="Tự động tạo từ tiêu đề")
    
    order = models.PositiveIntegerField(default=0, verbose_name="Thứ tự")
    is_active = models.BooleanField(default=True, verbose_name="Hiển thị?")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày tạo")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Cập nhật cuối")

    def __str__(self):
        return f"{self.module.title} - {self.title}"

    class Meta:
        ordering = ['module', 'order'] # Sắp xếp theo môn trước, rồi đến thứ tự bài
        verbose_name = "Bài học (Lesson)"
        verbose_name_plural = "Quản lý Bài học"

# --- 8. TÀI LIỆU HỌC TẬP (Material) ---
class Material(models.Model):
    TYPE_CHOICES = [
        ('video', 'Video Bài giảng'), 
        ('pdf', 'Slide / PDF'), 
        ('doc', 'Tài liệu đọc')
    ]
    
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='materials', verbose_name="Thuộc Bài học")
    
    title = models.CharField(max_length=200, verbose_name="Tên tài liệu (VN)")
    title_en = models.CharField(max_length=200, verbose_name="Tên tài liệu (EN)", blank=True, null=True)
    
    material_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='pdf', verbose_name="Loại tài liệu")
    
    # [MỚI] Thêm Validator để chỉ cho phép file tài liệu
    file_upload = models.FileField(
        upload_to='materials/', 
        verbose_name="Upload File", 
        blank=True, null=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'ppt', 'pptx'])]
    )
    
    video_url = models.URLField(verbose_name="Link Video (Youtube/Vimeo)", blank=True, null=True)
    
    is_public = models.BooleanField(default=False, verbose_name="Học thử (Public)?")
    order = models.PositiveIntegerField(default=0, verbose_name="Thứ tự hiển thị")

    def __str__(self):
        return f"[{self.get_material_type_display()}] {self.title}"

    class Meta:
        ordering = ['order']
        verbose_name = "Tài liệu"
        verbose_name_plural = "Kho Tài liệu"

class UserLessonProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='user_progress')
    
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True) # Thời điểm bấm hoàn thành

    class Meta:
        unique_together = ('user', 'lesson') # Mỗi người chỉ lưu tiến độ 1 bài 1 lần
        verbose_name = "Tiến độ học viên"
        verbose_name_plural = "Quản lý Tiến độ"

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"
    
class UserNote(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='user_notes')
    
    content = models.TextField(verbose_name="Nội dung ghi chú", blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson') # Mỗi bài học 1 bản ghi chú (có thể sửa đổi)
        verbose_name = "Ghi chú học viên"
        verbose_name_plural = "Quản lý Ghi chú"

    def __str__(self):
        return f"Note của {self.user.username} - {self.lesson.title}"
    
class ResearchPost(models.Model):
    CATEGORY_CHOICES = [
        ('news', 'Tin tức Y tế'),
        ('research', 'Nghiên cứu Khoa học'),
        ('perspective', 'Góc nhìn Chuyên gia'),
    ]

    title = models.CharField(max_length=255, verbose_name="Tiêu đề bài viết")
    slug = models.SlugField(max_length=255, unique=True, verbose_name="Slug (URL)", help_text="Tự động tạo từ tiêu đề")
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='perspective', verbose_name="Chuyên mục")
    author = models.CharField(max_length=100, default="TBI Research Team", verbose_name="Tác giả")
    
    summary = models.TextField(verbose_name="Tóm tắt ngắn", help_text="Hiện ở trang danh sách (Cập nhật)")
    content = models.TextField(verbose_name="Nội dung chi tiết", help_text="Chấp nhận mã HTML cơ bản")
    
    cover_image = models.ImageField(upload_to='research_covers/', verbose_name="Ảnh bìa", blank=True, null=True)
    
    # Đây là "Mồi câu" (Lead Magnet): File tài liệu Full
    pdf_file = models.FileField(upload_to='research_pdfs/', verbose_name="File PDF Full (Download)", blank=True, null=True)
    
    is_public = models.BooleanField(default=True, verbose_name="Công khai?")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày đăng")

    class Meta:
        ordering = ['-created_at'] # Bài mới nhất lên đầu
        verbose_name = "Bài nghiên cứu"
        verbose_name_plural = "Kho Research & Blog"

    def __str__(self):
        return self.title
    
class Testimonial(models.Model):
    name = models.CharField(max_length=200, verbose_name="Tên học viên")
    role = models.CharField(max_length=200, verbose_name="Chức vụ/Nơi công tác", help_text="Ví dụ: Giám đốc BV Đa khoa X")
    content = models.TextField(verbose_name="Lời nhận xét")
    avatar = models.ImageField(upload_to='testimonials/', null=True, blank=True, verbose_name="Ảnh đại diện")
    is_active = models.BooleanField(default=True, verbose_name="Hiển thị")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Ý kiến học viên"
        verbose_name_plural = "Quản lý Ý kiến học viên"

class Registration(models.Model):
    STATUS_CHOICES = [
        ('new', 'Mới đăng ký'),
        ('consulted', 'Đã tư vấn'),
        ('paid', 'Đã đóng tiền'),
        ('canceled', 'Hủy bỏ'),
    ]

    full_name = models.CharField(max_length=100, verbose_name="Họ tên")
    phone = models.CharField(max_length=20, verbose_name="Số điện thoại")
    email = models.EmailField(verbose_name="Email")
    
    # Liên kết trực tiếp với Module (để đếm số lượng)
    selected_module = models.ForeignKey(
        'Module', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        verbose_name="Module đăng ký",
        help_text="Để trống nếu đăng ký toàn khóa Mini MBA"
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', verbose_name="Trạng thái")
    note = models.TextField(blank=True, null=True, verbose_name="Ghi chú thêm")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày đăng ký")

    def __str__(self):
        course_name = self.selected_module.title if self.selected_module else "Toàn khóa Mini MBA"
        return f"{self.full_name} - {course_name}"

    class Meta:
        verbose_name = "Đơn đăng ký học"
        verbose_name_plural = "Quản lý Đăng ký"