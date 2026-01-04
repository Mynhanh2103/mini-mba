from django.urls import path, include
from django.conf import settings             # <--- Thêm dòng này
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import ModuleViewSet, ScheduleViewSet, InstructorViewSet, RegistrationViewSet, CourseOverviewViewSet, MiniMBAConfigViewSet, UserProfileView
from .views import UserProfileView, MarkLessonView, NoteView, LessonViewSet, MaterialViewSet, ResearchPostViewSet, TestimonialViewSet, GeneralHomepageConfigViewSet, PartnerViewSet, ConsultingServiceViewSet, TrainingProgramViewSet
router = DefaultRouter()
router.register(r'modules', ModuleViewSet)
router.register(r'schedule', ScheduleViewSet)
router.register(r'instructors', InstructorViewSet)
router.register(r'register', RegistrationViewSet)
router.register(r'overviews', CourseOverviewViewSet)
router.register(r'general-config', GeneralHomepageConfigViewSet) # Dữ liệu cho HomePage.jsx
router.register(r'minimba-config', MiniMBAConfigViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'materials', MaterialViewSet)
router.register(r'research', ResearchPostViewSet)
router.register(r'reviews', TestimonialViewSet)
router.register(r'partners', PartnerViewSet)
router.register(r'consulting-services', ConsultingServiceViewSet)
router.register(r'training-programs', TrainingProgramViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('mark-lesson/', MarkLessonView.as_view(), name='mark-lesson'),
    path('note/', NoteView.as_view(), name='user-note')
]