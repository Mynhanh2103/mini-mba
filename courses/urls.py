from django.urls import path, include
from django.conf import settings             # <--- Thêm dòng này
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import ModuleViewSet, ScheduleViewSet, InstructorViewSet, RegistrationViewSet, CourseOverviewViewSet, HomepageConfigViewSet

router = DefaultRouter()
router.register(r'modules', ModuleViewSet)
router.register(r'schedule', ScheduleViewSet)
router.register(r'instructors', InstructorViewSet)
router.register(r'register', RegistrationViewSet)
router.register(r'overviews', CourseOverviewViewSet)
router.register(r'config', HomepageConfigViewSet)
urlpatterns = [
    path('', include(router.urls)),

]