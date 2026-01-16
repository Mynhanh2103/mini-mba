from rest_framework import serializers
from .models import Module, ScheduleItem, Instructor, Registration, CourseOverview, ConsultingSolution
from .models import MiniMBAConfig, Lesson, Material, ResearchPost, Testimonial, GeneralHomepageConfig, Partner, ConsultingService, TrainingProgram
from .models import HealthcareMBAConfig, HealthcareModule, HealthcareInstructor, HealthcareSchedule, HealthcareRegistration
from .models import JCIConfig, JCIModule, JCIInstructor, JCISchedule, JCIRegistration
class GeneralHomepageConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralHomepageConfig
        fields = '__all__'

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

class MiniMBAConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = MiniMBAConfig
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

class ResearchPostSerializer(serializers.ModelSerializer):
    cover_url = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = ResearchPost
        fields = '__all__'

    def get_cover_url(self, obj):
        if obj.cover_image:
            return obj.cover_image.url
        return None

    def get_pdf_url(self, obj):
        if obj.pdf_file:
            return obj.pdf_file.url
        return None
    
class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = '__all__'

class ConsultingServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultingService
        fields = '__all__'

class ConsultingSolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultingSolution
        fields = '__all__' # Lấy tất cả các trường

class TrainingProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingProgram
        fields = '__all__'

# --- SERIALIZER CHO HEALTHCARE MBA ---

class HealthcareMBAConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthcareMBAConfig
        fields = '__all__'

class HealthcareModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthcareModule
        fields = '__all__'

class HealthcareInstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthcareInstructor
        fields = '__all__'

class HealthcareScheduleSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.name', read_only=True)
    module_title = serializers.CharField(source='module.title', read_only=True)
    
    class Meta:
        model = HealthcareSchedule
        fields = '__all__'

class HealthcareRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthcareRegistration
        fields = '__all__'


# --- SERIALIZER CHO JCI CONCEPTS ---

class JCIConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = JCIConfig
        fields = '__all__'

class JCIModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JCIModule
        fields = '__all__'

class JCIInstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = JCIInstructor
        fields = '__all__'

class JCIScheduleSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.name', read_only=True)
    module_title = serializers.CharField(source='module.title', read_only=True)
    
    class Meta:
        model = JCISchedule
        fields = '__all__'

class JCIRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JCIRegistration
        fields = '__all__'