from rest_framework import viewsets
from .models import Module, ScheduleItem, Instructor, Registration, CourseOverview
from .serializers import ModuleSerializer, ScheduleItemSerializer, InstructorSerializer, RegistrationSerializer, CourseOverviewSerializer
from rest_framework import mixins, viewsets
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