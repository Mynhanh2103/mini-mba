from pathlib import Path
import os
import dj_database_url # Import thư viện kết nối DB Render
from django.urls import reverse_lazy
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- BẢO MẬT & MÔI TRƯỜNG ---
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-key-du-phong-cho-local')
# Tắt Debug khi lên Render (có biến RENDER), bật Debug khi ở Local
DEBUG = 'RENDER' not in os.environ

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'corsheaders',
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'cloudinary_storage', # Thêm Cloudinary
    'cloudinary',
    'rest_framework',
    
    'courses',
    'django_filters',
    'ckeditor'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # <--- QUAN TRỌNG: Để hiện CSS Admin
    'django.contrib.sessions.middleware.SessionMiddleware',
    # <--- CORS phải ở trên Common
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'tbi_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tbi_backend.wsgi.application'

# --- DATABASE (TỰ ĐỘNG CHUYỂN POSTGRES TRÊN RENDER) ---
DATABASES = {
    'default': dj_database_url.config(
        # Nếu không có biến DATABASE_URL (chạy local), dùng SQLite
        default='sqlite:///' + str(BASE_DIR / 'db.sqlite3'),
        conn_max_age=600
    )
}

# --- PASSWORD VALIDATION ---
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --- INTERNATIONALIZATION ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# --- STATIC FILES (CSS, JS) ---
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# --- CẤU HÌNH STORAGES (DÀNH CHO DJANGO 5.X) ---
# Đây là phần thay đổi quan trọng nhất để sửa lỗi upload ảnh
STORAGES = {
    # 1. Quản lý file Media (Ảnh upload) -> Luôn dùng Cloudinary
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    # 2. Quản lý file Static (CSS, JS) -> Dùng Whitenoise
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# --- MEDIA FILES (ẢNH UPLOAD) ---
# Các thông số kết nối Cloudinary
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
}

MEDIA_URL = '/media/'
# Đường dẫn dự phòng (vẫn giữ để tránh lỗi path, nhưng storage chính đã là Cloudinary)
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- CORS & CSRF (CHO PHÉP FRONTEND KẾT NỐI) ---
CORS_ALLOW_CREDENTIALS = True
# Tự động lấy link frontend từ biến môi trường, fallback về localhost
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "https://mini-mba-frontend.onrender.com"
]

CSRF_TRUSTED_ORIGINS = [
    "https://mini-mba-admin.onrender.com",
    "https://mini-mba-frontend.onrender.com",
]

# Config giao diện Admin Unfold (Giữ nguyên của bạn)
# settings.py

UNFOLD = {
    "SITE_TITLE": "TBI Admin Portal",
    "SITE_HEADER": "TBI Institute Admin",
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": False,
        "navigation": [
            # --- NHÓM 1: TRANG CHỦ CÔNG TY (GENERAL) ---
            {
                "title": "Quản lý Nội dung (CMS)",
                "separator": True,
                "items": [
                    {
                        "title": "Cấu hình Trang Chủ",
                        "icon": "settings_suggest",
                        "link": reverse_lazy("admin:courses_generalhomepageconfig_changelist"),
                    },
                    {
                        "title": "Đối tác & Khách hàng",
                        "icon": "handshake",
                        "link": reverse_lazy("admin:courses_partner_changelist"),
                    },
                    {
                        "title": "Ý kiến Học viên (Review)",
                        "icon": "reviews",
                        "link": reverse_lazy("admin:courses_testimonial_changelist"),
                    },
                    {
                        "title": "Bài viết & Tin tức",
                        "icon": "article",
                        "link": reverse_lazy("admin:courses_researchpost_changelist"),
                    },
                    {
                        "title": "Các Gói Dịch vụ",
                        "icon": "support_agent",
                        "link": reverse_lazy("admin:courses_consultingservice_changelist"),
                    },
                    {
                        "title": "Thư viện Giải pháp",
                        "icon": "library_books",
                        "link": reverse_lazy("admin:courses_consultingsolution_changelist"),
                    },
                ],
            },

            # ------------------------------------
            # 2. MINI MBA (GENERAL)
            # ------------------------------------
            {
                "title": "Đào tạo: Mini MBA (General)",
                "separator": True,
                "items": [
                    {
                        "title": "Cấu hình Trang chủ",
                        "icon": "settings",
                        "link": reverse_lazy("admin:courses_minimbaconfig_changelist"),
                    },
                    {
                        "title": "Chuyên đề (Modules)",
                        "icon": "view_module",
                        "link": reverse_lazy("admin:courses_module_changelist"),
                    },
                    {
                        "title": "Lịch học",
                        "icon": "calendar_today",
                        "link": reverse_lazy("admin:courses_scheduleitem_changelist"),
                    },
                    {
                        "title": "Giảng viên",
                        "icon": "people",
                        "link": reverse_lazy("admin:courses_instructor_changelist"),
                    },
                    {
                        "title": "Danh sách Đăng ký",
                        "icon": "app_registration",
                        "link": reverse_lazy("admin:courses_registration_changelist"),
                    },
                     {
                        "title": "Bài học (Lessons)",
                        "icon": "menu_book",
                        "link": reverse_lazy("admin:courses_lesson_changelist"),
                    },
                     {
                        "title": "Tài liệu (Materials)",
                        "icon": "folder_shared",
                        "link": reverse_lazy("admin:courses_material_changelist"),
                    },
                ],
            },

            # ------------------------------------
            # 3. MINI MBA HEALTHCARE
            # ------------------------------------
            {
                "title": "Đào tạo: Mini MBA Healthcare",
                "separator": True,
                "items": [
                    {
                        "title": "Cấu hình Landing Page",
                        "icon": "medical_services",
                        "link": reverse_lazy("admin:courses_healthcarembaconfig_changelist"),
                    },
                    {
                        "title": "Chuyên đề (HC Modules)",
                        "icon": "healing",
                        "link": reverse_lazy("admin:courses_healthcaremodule_changelist"),
                    },
                    {
                        "title": "Lịch khai giảng",
                        "icon": "event_note",
                        "link": reverse_lazy("admin:courses_healthcareschedule_changelist"),
                    },
                    {
                        "title": "Đội ngũ Giảng viên",
                        "icon": "school",
                        "link": reverse_lazy("admin:courses_healthcareinstructor_changelist"),
                    },
                    {
                        "title": "Đăng ký Tư vấn",
                        "icon": "contact_mail",
                        "link": reverse_lazy("admin:courses_healthcareregistration_changelist"),
                    },
                ],
            },

            # ------------------------------------
            # 4. JCI CONCEPTS
            # ------------------------------------
            {
                "title": "Đào tạo: JCI Concepts",
                "separator": True,
                "items": [
                    {
                        "title": "Cấu hình Trang JCI",
                        "icon": "verified_user",
                        "link": reverse_lazy("admin:courses_jciconfig_changelist"),
                    },
                    {
                        "title": "Chuyên đề JCI",
                        "icon": "playlist_add_check",
                        "link": reverse_lazy("admin:courses_jcimodule_changelist"),
                    },
                    {
                        "title": "Lịch học JCI",
                        "icon": "event_available",
                        "link": reverse_lazy("admin:courses_jcischedule_changelist"),
                    },
                    {
                        "title": "Giảng viên JCI",
                        "icon": "person_pin",
                        "link": reverse_lazy("admin:courses_jciinstructor_changelist"),
                    },
                    {
                        "title": "Đăng ký JCI",
                        "icon": "how_to_reg",
                        "link": reverse_lazy("admin:courses_jciregistration_changelist"),
                    },
                ],
            },

            # ------------------------------------
            # 5. AI IN HEALTHCARE (MỚI)
            # ------------------------------------
            {
                "title": "Đào tạo: AI in Healthcare",
                "separator": True,
                "items": [
                    {
                        "title": "Cấu hình Trang AI",
                        "icon": "memory", # Icon vi mạch/AI
                        "link": reverse_lazy("admin:courses_aihealthcareconfig_changelist"),
                    },
                    {
                        "title": "Chuyên đề AI",
                        "icon": "view_list",
                        "link": reverse_lazy("admin:courses_aihealthcaremodule_changelist"),
                    },
                    {
                        "title": "Lịch học AI",
                        "icon": "calendar_month",
                        "link": reverse_lazy("admin:courses_aihealthcareschedule_changelist"),
                    },
                    {
                        "title": "Giảng viên AI",
                        "icon": "group",
                        "link": reverse_lazy("admin:courses_aihealthcareinstructor_changelist"),
                    },
                    {
                        "title": "Đăng ký AI",
                        "icon": "app_registration",
                        "link": reverse_lazy("admin:courses_aihealthcareregistration_changelist"),
                    },
                ],
            },

            # ------------------------------------
            # 6. HỆ THỐNG
            # ------------------------------------
            {
                "title": "Hệ thống Quản trị",
                "separator": True,
                "items": [
                    {
                        "title": "Danh sách Khóa học (Menu)",
                        "icon": "list_alt",
                        "link": reverse_lazy("admin:courses_trainingprogram_changelist"),
                    },
                    {
                        "title": "Tài khoản Admin",
                        "icon": "admin_panel_settings",
                        "link": reverse_lazy("admin:auth_user_changelist"),
                    },
                    {
                        "title": "Nhóm quyền",
                        "icon": "lock",
                        "link": reverse_lazy("admin:auth_group_changelist"),
                    },
                ],
            },
        ],
    },
}
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Tạm thời để AllowAny để không ảnh hưởng các API trang chủ hiện tại
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny', 
    ],
    'DEFAULT_FILTER_BACKEND': ['django_filters.rest_framework.DjangoFilterBackend'],
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60), # Token sống 60 phút
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),    # Refresh token sống 1 ngày
}
CORS_ALLOW_CREDENTIALS = True