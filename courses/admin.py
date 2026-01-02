from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin # Dùng class của Unfold để đẹp hơn
from .models import Module, Instructor, ScheduleItem, Registration, CourseOverview
from .models import HomepageConfig, Lesson, Material, ResearchPost, Testimonial

# --- Cấu hình chung ---
admin.site.site_header = "TBI Institute Admin"
admin.site.site_title = "TBI Admin Portal"
admin.site.index_title = "Trung tâm Quản trị Dữ liệu"

# --- 1. Quản lý Giảng viên ---
@admin.register(Instructor)
class InstructorAdmin(ModelAdmin):
    list_display = ('display_image', 'name', 'title', 'position')
    search_fields = ('name', 'title')
    
    # Cho phép hiển thị cả 2 trường để nhập liệu
    fields = ('name', 'title', 'position', 'image', 'image_url', 'description')

    def display_image(self, obj):
        # Logic ưu tiên: Nếu có ảnh upload -> hiện ảnh upload. Nếu không -> hiện link.
        if obj.image:
            return format_html('<img src="{}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;" />', obj.image.url)
        elif obj.image_url:
            return format_html('<img src="{}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;" />', obj.image_url)
        return "No Image"
    display_image.short_description = "Ảnh đại diện"

# --- 2. Quản lý Môn học (ĐÃ SỬA LỖI) ---
@admin.register(Module)
class ModuleAdmin(ModelAdmin):
    list_display = ('title', 'student_count_badge', 'duration', 'is_active')
    list_editable = ('is_active',)
    search_fields = ('title',)
    
    # Ẩn các trường thừa
    fields = ('title', 'description', 'order', 'duration', 'has_certificate', 'is_active')

    def student_count_badge(self, obj):
        # Đếm số lượng người đã đăng ký module này (Trạng thái khác Hủy)
        count = Registration.objects.filter(selected_module=obj).exclude(status='canceled').count()
        target = 20 # Mục tiêu mở lớp
        
        # Logic thanh tiến trình (Progress Bar) giả lập
        percent = min((count / target) * 100, 100)
        color = "#22c55e" if count >= target else "#3b82f6" # Xanh lá nếu đủ, Xanh dương nếu chưa
        
        return format_html(
            '''
            <div style="width: 120px;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                    <span style="font-weight: bold;">{}/{} học viên</span>
                    <span>{}%</span>
                </div>
                <div style="width: 100%; background: #e2e8f0; height: 6px; border-radius: 3px;">
                    <div style="width: {}%; background: {}; height: 6px; border-radius: 3px;"></div>
                </div>
            </div>
            ''',
            count, target, int(percent), percent, color
        )
    student_count_badge.short_description = "Tiến độ tuyển sinh"

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
@admin.register(HomepageConfig)
class HomepageConfigAdmin(ModelAdmin):
    list_display = ('hero_title', 'benefit_title')
    
    def has_add_permission(self, request):
        return not HomepageConfig.objects.exists()
    
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
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'content')