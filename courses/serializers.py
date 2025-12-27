from rest_framework import serializers
from .models import Module, ScheduleItem, Instructor, Registration, CourseOverview
from .models import HomepageConfig, Lesson, Material
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

class MaterialSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Material
        fields = '__all__'

    def get_file_url(self, obj):
        if obj.file_upload:
            return obj.file_upload.url
        return None

class LessonSerializer(serializers.ModelSerializer):
    # Lồng danh sách tài liệu vào trong bài học
    materials = MaterialSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lesson
        fields = ['id', 'module', 'title', 'title_en', 'slug', 'order', 'created_at', 'materials']