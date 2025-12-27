from rest_framework import viewsets, permissions
from .models import Module, ScheduleItem, Instructor, Registration, CourseOverview, HomepageConfig
from .serializers import ModuleSerializer, ScheduleItemSerializer, InstructorSerializer, RegistrationSerializer, CourseOverviewSerializer, HomepageConfigSerializer
from rest_framework import mixins, viewsets
from .models import Lesson, Material
from .serializers import LessonSerializer, MaterialSerializer
class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

class ScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ScheduleItem.objects.all()
    serializer_class = ScheduleItemSerializer

class InstructorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer

class RegistrationViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer



class CourseOverviewViewSet(viewsets.ModelViewSet):
    queryset = CourseOverview.objects.all()
    serializer_class = CourseOverviewSerializer

class HomepageConfigViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HomepageConfig.objects.all()
    serializer_class = HomepageConfigSerializer

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.filter(is_active=True).prefetch_related('materials').order_by('order')
    serializer_class = LessonSerializer
    filterset_fields = ['module', 'module__id']
    lookup_field = 'slug'

class MaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Material.objects.all().order_by('order')
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]