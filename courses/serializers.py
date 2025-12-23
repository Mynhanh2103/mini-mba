from rest_framework import serializers
from .models import Module, ScheduleItem, Instructor, Registration, CourseOverview
from .models import HomepageConfig
class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'

class ScheduleItemSerializer(serializers.ModelSerializer):
    # Lấy luôn tên giảng viên thay vì chỉ hiện ID
    prof_name = serializers.CharField(source='professor.name', read_only=True)
    
    class Meta:
        model = ScheduleItem
        fields = '__all__'

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = '__all__'

class CourseOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseOverview
        fields = '__all__'

class HomepageConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomepageConfig
        fields = '__all__'