from django.urls import path, include
from django.conf import settings             # <--- Thêm dòng này
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import ModuleViewSet, ScheduleViewSet, InstructorViewSet, RegistrationViewSet, CourseOverviewViewSet, MiniMBAConfigViewSet, UserProfileView
from .views import UserProfileView, MarkLessonView, NoteView, LessonViewSet, MaterialViewSet, ResearchPostViewSet, TestimonialViewSet, GeneralHomepageConfigViewSet, PartnerViewSet, ConsultingServiceViewSet, TrainingProgramViewSet
from .views import ConsultingSolutionViewSet
from .views import (
    HealthcareMBAConfigViewSet, HealthcareModuleViewSet, 
    HealthcareInstructorViewSet, HealthcareScheduleViewSet, 
    HealthcareRegistrationViewSet
)
from .views import (
    JCIConfigViewSet, JCIModuleViewSet, 
    JCIInstructorViewSet, JCIScheduleViewSet, 
    JCIRegistrationViewSet
)

from .views import(
    AiHealthcareConfigViewSet, AiHealthcareInstructorViewSet, AiHealthcareModuleViewSet, AiHealthcareRegistrationViewSet,
    AiHealthcareScheduleViewSet
)

router = DefaultRouter()
router.register(r'modules', ModuleViewSet)
router.register(r'schedule', ScheduleViewSet)
router.register(r'instructors', InstructorViewSet)
router.register(r'register', RegistrationViewSet)
router.register(r'overviews', CourseOverviewViewSet)
router.register(r'general-config', GeneralHomepageConfigViewSet) # Dữ liệu cho HomePage.jsx
router.register(r'minimba-config', MiniMBAConfigViewSet, basename='minimba-config')
router.register(r'lessons', LessonViewSet)
router.register(r'materials', MaterialViewSet)
router.register(r'research', ResearchPostViewSet)
router.register(r'reviews', TestimonialViewSet)
router.register(r'partners', PartnerViewSet)
router.register(r'consulting-services', ConsultingServiceViewSet)
router.register(r'consulting-solutions', ConsultingSolutionViewSet)
router.register(r'training-programs', TrainingProgramViewSet)

# Đăng ký Router mới
router.register(r'healthcaremba-config', HealthcareMBAConfigViewSet, basename='healthcare-config')
router.register(r'healthcare-modules', HealthcareModuleViewSet)
router.register(r'healthcare-instructors', HealthcareInstructorViewSet)
router.register(r'healthcare-schedule', HealthcareScheduleViewSet)
router.register(r'healthcare-register', HealthcareRegistrationViewSet)


# ... Đăng ký Router
router.register(r'jci-config', JCIConfigViewSet, basename='jci-config')
router.register(r'jci-modules', JCIModuleViewSet)
router.register(r'jci-instructors', JCIInstructorViewSet)
router.register(r'jci-schedule', JCIScheduleViewSet)
router.register(r'jci-register', JCIRegistrationViewSet)


router.register(r'aihealthcare-config', AiHealthcareConfigViewSet)
router.register(r'aihealthcare-modules', AiHealthcareModuleViewSet)
router.register(r'aihealthcare-instructors', AiHealthcareInstructorViewSet)
router.register(r'aihealthcare-schedule', AiHealthcareScheduleViewSet)
router.register(r'aihealthcare-register', AiHealthcareRegistrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('mark-lesson/', MarkLessonView.as_view(), name='mark-lesson'),
    path('note/', NoteView.as_view(), name='user-note')
]