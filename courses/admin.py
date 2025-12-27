from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin # Dùng class của Unfold để đẹp hơn
from .models import Module, Instructor, ScheduleItem, Registration, CourseOverview
from .models import HomepageConfig, Lesson, Material
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

# --- 2. Quản lý Môn học ---
@admin.register(Module)
class ModuleAdmin(ModelAdmin):
    list_display = ('title', 'icon_badge', 'description_short')
    search_fields = ('title',)
    fields = ('title', 'description', 'image', 'image_url', 'icon_name')
    def description_short(self, obj):
        return obj.description[:50] + "..." if len(obj.description) > 50 else obj.description
    description_short.short_description = "Mô tả ngắn"

    def icon_badge(self, obj):
        # Tạo badge màu xanh cho tên icon
        return format_html(
            '<span style="background-color: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-weight: bold;">{}</span>',
            obj.icon_name
        )
    icon_badge.short_description = "Icon ID"

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
        style = f"background-color: {colors.get(obj.item_type)}; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;"
        label = obj.get_item_type_display()
        return format_html('<span style="{}">{}</span>', style, label)
    status_badge.short_description = "Loại lịch"

# --- 4. Quản lý Đăng ký (Chỉ xem, không sửa nhiều) ---
@admin.register(Registration)
class RegistrationAdmin(ModelAdmin):
    list_display = ('full_name', 'phone', 'email', 'created_at')
    search_fields = ('full_name', 'email', 'phone')
    readonly_fields = ('created_at',) # Không cho sửa ngày tạo
    list_filter = ('status', 'created_at')

@admin.register(CourseOverview)
class CourseOverviewAdmin(admin.ModelAdmin):
    list_display = ('cover_image', 'description','title', 'icon_type', 'order')
    list_editable = ('order',)
    list_display_links = ('title',)
    #def display_icon(self, obj):
        #if obj.icon_image:
            #return format_html('<img src="{}" style="width: 30px; height: 30px; object-fit: contain;" />', obj.icon_image.url)
        #return "No Icon"
    #display_icon.short_description = "Icon"
    def display_cover(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;" />', obj.cover_image.url)
        return "No Cover"
    display_cover.short_description = "Ảnh bìa"

# --- 5.Quản lý Trang chủ ---
@admin.register(HomepageConfig)
class HomepageConfigAdmin(ModelAdmin):
    list_display = ('hero_title', 'benefit_title')
    
    # Chỉ cho phép tạo tối đa 1 bản ghi để tránh lỗi
    def has_add_permission(self, request):
        # Nếu đã có 1 bản ghi rồi thì không cho thêm nữa (chỉ cho sửa)
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
    list_editable = ('order', 'is_active') # Cho phép sửa nhanh thứ tự và ẩn/hiện
    prepopulated_fields = {'slug': ('title',)} # [QUAN TRỌNG] Tự động tạo slug khi gõ title
    inlines = [MaterialInline]