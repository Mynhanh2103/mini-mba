from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse # <--- 1. Thêm dòng này
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
# 2. Thêm hàm này để trả về chữ khi vào trang chủ
def home(request):
    return HttpResponse("Backend Django đang chạy ngon lành! Hãy vào /admin để quản lý.")

urlpatterns = [
    path('', home), # <--- 3. Thêm dòng này (để xử lý đường dẫn gốc)
    path('admin/', admin.site.urls),
    path('api/', include('courses.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # API Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)