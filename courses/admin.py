from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin # Dùng class của Unfold để đẹp hơn
from .models import Module, Instructor, ScheduleItem, Registration, CourseOverview
from .models import MiniMBAConfig, Lesson, Material, ResearchPost, Testimonial, Partner, ConsultingService
from .models import TrainingProgram, GeneralHomepageConfig, ConsultingSolution
# --- Cấu hình chung ---
admin.site.site_header = "TBI Institute Admin"
admin.site.site_title = "TBI Admin Portal"
admin.site.index_title = "Trung tâm Quản trị Dữ liệu"
# 1. Quản lý Trang chủ Tổng
@admin.register(GeneralHomepageConfig)
class GeneralHomepageConfigAdmin(ModelAdmin):
    list_display = ('hero_title', 'founder_name') # Thêm founder_name ra list
    
    # Cập nhật fieldsets
    fieldsets = (
        ("1. Hero Banner", {
            "fields": (
                ("hero_title", "hero_title_en"),
                ("hero_slogan", "hero_slogan_en"),
                "hero_image",
            ),
        }),
        # [THÊM MỚI] Nhóm Founder
        ("2. Giới thiệu Founder", {
            "fields": (
                "founder_image",
                "founder_name",
                ("founder_role", "founder_role_en"),
                "founder_bio", 
                "founder_bio_en"
            ),
        }),
        ("3. Footer", {
            "fields": ("footer_text", "footer_text_en"),
        }),
    )
    
    def has_add_permission(self, request):
        return not GeneralHomepageConfig.objects.exists()
    
# --- 1. Quản lý Giảng viên ---
@admin.register(Instructor)
class InstructorAdmin(ModelAdmin):
    list_display = ('display_image', 'name', 'title', 'position')
    search_fields = ('name', 'title')
    
    # [CẬP NHẬT] Thêm các trường _en vào đây để nhập liệu
    fields = (
        'name', 
        'title', 'title_en',           # Học vị VN / EN
        'position', 'position_en',     # Chức vụ VN / EN
        'image', 'image_url', 
        'description', 'description_en' # Mô tả VN / EN
    )

    def display_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;" />', obj.image.url)
        elif obj.image_url:
            return format_html('<img src="{}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;" />', obj.image_url)
        return "No Image"
    display_image.short_description = "Ảnh đại diện"

# --- 2. Quản lý Môn học (Module) ---
@admin.register(Module)
class ModuleAdmin(ModelAdmin):
    list_display = ('title', 'title_en', 'order', 'duration', 'is_active') # Hiện thêm tên EN ở danh sách cho dễ nhìn
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'title_en')
    
    # [CẬP NHẬT] Form nhập liệu chi tiết
    fields = (
        'title', 'title_en', 
        'description', 'description_en', 
        'order', 'duration', 'has_certificate', 'is_active'
    )
# --- 3. Quản lý Lịch học ---
@admin.register(ScheduleItem)
class ScheduleAdmin(ModelAdmin):
    list_display = ('date_str', 'duration', 'status_badge', 'topic', 'professor')
    list_filter = ('item_type', 'professor')
    search_fields = ('topic', 'date_str')
    ordering = ('id',) # Sắp xếp theo thứ tự nhập

    def status_badge(self, obj):
        # Tô màu trạng thái: Xanh (Học), Đỏ (Nghỉ lễ), Cam (Nghỉ đông)
        colors = {
            'class': '#dcfce7; color: #166534', # Xanh lá nhạt
            'break': '#ffedd5; color: #9a3412', # Cam nhạt
            'holiday': '#fee2e2; color: #991b1b', # Đỏ nhạt
        }
        style = f"background-color: {colors.get(obj.item_type, '#ffffff')}; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;"
        label = obj.get_item_type_display()
        return format_html('<span style="{}">{}</span>', style, label)
    status_badge.short_description = "Loại lịch"

# --- 4. Quản lý Đăng ký ---
# courses/admin.py

@admin.register(Registration)
class RegistrationAdmin(ModelAdmin):
    # [SỬA LỖI Ở ĐÂY]: Thay 'status_label' thành 'status'
    # Django bắt buộc trường trong list_editable ('status') phải có mặt trong list_display
    list_display = ('full_name_bold', 'contact_info', 'course_badge', 'status', 'created_at_fmt')
    
    # Bộ lọc
    list_filter = ('selected_module', 'status', 'created_at')
    
    # Tìm kiếm
    search_fields = ('full_name', 'phone', 'email')
    
    # Cho phép sửa nhanh trạng thái (Hiện menu thả xuống ngay bên ngoài)
    list_editable = ('status',)
    
    ordering = ('-created_at',)

    # --- CÁC HÀM TRANG TRÍ ---
    
    def full_name_bold(self, obj):
        return format_html('<span style="font-weight: 600; color: #1e293b;">{}</span>', obj.full_name)
    full_name_bold.short_description = "Họ và tên"

    def contact_info(self, obj):
        return format_html(
            '<div><i class="ri-phone-line"></i> {}</div><div style="font-size: 12px; color: #64748b;">{}</div>',
            obj.phone, obj.email
        )
    contact_info.short_description = "Liên hệ"

    def course_badge(self, obj):
        if obj.selected_module:
            return format_html(
                '<span style="background: #e0f2fe; color: #0284c7; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 12px;">Module: {}</span>',
                obj.selected_module.title
            )
        return format_html(
            '<span style="background: #fef9c3; color: #ca8a04; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 12px; border: 1px solid #fde047;">🏆 TRỌN GÓI MINI MBA</span>'
        )
    course_badge.short_description = "Khóa đăng ký"
    
    def created_at_fmt(self, obj):
        return obj.created_at.strftime("%d/%m/%Y %H:%M")
    created_at_fmt.short_description = "Ngày ĐK"
@admin.register(CourseOverview)
class CourseOverviewAdmin(admin.ModelAdmin):
    list_display = ('display_cover', 'title', 'icon_type', 'order')
    list_editable = ('order',)
    list_display_links = ('title',)

    def display_cover(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;" />', obj.cover_image.url)
        return "No Cover"
    display_cover.short_description = "Ảnh bìa"

# --- 5. Quản lý Trang chủ ---
@admin.register(MiniMBAConfig)
class MiniMBAConfigAdmin(ModelAdmin):
    list_display = ('hero_title', 'benefit_title')
    
    def has_add_permission(self, request):
        return not MiniMBAConfig.objects.exists()
    
class MaterialInline(admin.TabularInline):
    model = Material
    extra = 1
    fields = ('title', 'material_type', 'file_upload', 'video_url', 'is_public', 'order')

@admin.register(Lesson)
class LessonAdmin(ModelAdmin):
    list_display = ('title', 'module', 'is_active', 'order', 'updated_at')
    list_filter = ('module', 'is_active')
    search_fields = ('title', 'module__title')
    list_editable = ('order', 'is_active')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [MaterialInline]

@admin.register(ResearchPost)
class ResearchPostAdmin(ModelAdmin):
    list_display = ('title', 'category', 'author', 'is_public', 'created_at')
    list_filter = ('category', 'is_public')
    search_fields = ('title', 'summary')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Testimonial)
class TestimonialAdmin(ModelAdmin):
    list_display = ('name', 'role', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'content')
    
    # [CẬP NHẬT] Thêm trường tiếng Anh vào form
    fields = (
        'name', 
        'role', 'role_en', 
        'content', 'content_en', 
        'avatar', 'is_active'
    )

@admin.register(Material)
class MaterialAdmin(ModelAdmin):
    list_display = ('title', 'lesson', 'material_type', 'is_public', 'order')
    list_filter = ('material_type', 'is_public', 'lesson__module')
    search_fields = ('title', 'lesson__title')
    list_editable = ('order', 'is_public')
    
    # Giúp hiển thị đẹp hơn
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('lesson', 'lesson__module')
    
@admin.register(Partner)
class PartnerAdmin(ModelAdmin):
    list_display = ('display_logo', 'name', 'website', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    
    def display_logo(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="height: 30px; object-fit: contain;" />', obj.logo.url)
        return "-"
    display_logo.short_description = "Logo"

# [THÊM MỚI] Đăng ký ConsultingService
@admin.register(ConsultingService)
class ConsultingServiceAdmin(ModelAdmin):
    list_display = ('title', 'icon_name', 'order', 'is_active')
    list_editable = ('order', 'is_active')

@admin.register(TrainingProgram)
class TrainingProgramAdmin(ModelAdmin):
    list_display = ('title', 'link', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('title',)
    
    # Form nhập liệu chi tiết
    fields = (
        'title', 'title_en',
        'description', 'description_en',
        'image', 'link',
        'order', 'is_active'
    )

@admin.register(ConsultingSolution)
class ConsultingSolutionAdmin(admin.ModelAdmin):
    list_display = ('title_vi', 'title_en', 'is_active', 'created_at')
    search_fields = ('title_vi', 'title_en')
    list_filter = ('is_active',)
    
    fieldsets = (
        ('Ảnh & Trạng thái', {
            'fields': ('thumbnail', 'is_active')
        }),
        ('Tiêu đề / Title', {
            'fields': ('title_vi', 'title_en')
        }),
        ('Nội dung Chi tiết (Tab 1 & Tab 2)', {
            'description': 'Nhập nội dung tương ứng cho 2 Tab: Bối cảnh (Vấn đề) và Giải pháp (Marketing)',
            'fields': ('context_vi', 'context_en', 'solution_vi', 'solution_en')
        }),
    )