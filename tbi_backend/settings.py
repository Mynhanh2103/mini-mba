from pathlib import Path
import os
import dj_database_url # Import thư viện kết nối DB Render

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- BẢO MẬT & MÔI TRƯỜNG ---
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-key-du-phong-cho-local')
# Tắt Debug khi lên Render (có biến RENDER), bật Debug khi ở Local
DEBUG = 'RENDER' not in os.environ

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
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
    'corsheaders',
    'courses',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # <--- QUAN TRỌNG: Để hiện CSS Admin
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # <--- CORS phải ở trên Common
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
# Dùng Whitenoise để nén và phục vụ file tĩnh
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# --- MEDIA FILES (ẢNH UPLOAD) ---
# LƯU Ý: Render Free sẽ XÓA ẢNH sau 15 phút nếu lưu trên máy chủ.
# Bắt buộc dùng Cloudinary để lưu ảnh vĩnh viễn.
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
}
MEDIA_URL = '/media/'
# Nếu đang ở Render (Production) thì dùng Cloudinary, Local dùng thư mục thường
if not DEBUG:
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
else:
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- CORS & CSRF (CHO PHÉP FRONTEND KẾT NỐI) ---
CORS_ALLOW_CREDENTIALS = True
# Tự động lấy link frontend từ biến môi trường, fallback về localhost
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://mini-mba-frontend.onrender.com/"
]

CSRF_TRUSTED_ORIGINS = [
    "https://mini-mba-admin.onrender.com",
    "https://mini-mba-frontend.onrender.com/",
]

# Config giao diện Admin Unfold (Giữ nguyên của bạn)
UNFOLD = {
    "SITE_TITLE": "TBI Admin Portal",
    "SITE_HEADER": "Hệ thống Quản trị Đào tạo",
    "SITE_URL": "/",
    "COLORS": {
        "primary": {
            "50": "239 246 255",
            "100": "219 234 254",
            "200": "191 219 254",
            "300": "147 197 253",
            "400": "96 165 250",
            "500": "59 130 246",
            "600": "37 99 235",
            "700": "29 78 216",
            "800": "30 64 175",
            "900": "30 58 138",
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
    },
}
