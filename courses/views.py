from rest_framework import viewsets, permissions, filters
from .models import Module, ScheduleItem, Instructor, Registration, CourseOverview, HomepageConfig
from .serializers import ModuleSerializer, ScheduleItemSerializer, InstructorSerializer, RegistrationSerializer, CourseOverviewSerializer, HomepageConfigSerializer, ResearchPostSerializer
from rest_framework import mixins, viewsets
from .models import Lesson, Material, Testimonial
from .serializers import LessonSerializer, MaterialSerializer, TestimonialSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
from .models import ScheduleItem, UserLessonProgress, Lesson, UserNote, ResearchPost
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

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        full_name = f"{user.first_name} {user.last_name}".strip() or user.username

        # --- LOGIC TÍNH TIẾN ĐỘ MỚI (Dựa trên UserLessonProgress) ---
        total_lessons = Lesson.objects.filter(is_active=True).count()

        # Đếm số bài user này đã hoàn thành
        completed_lessons = UserLessonProgress.objects.filter(user=user, is_completed=True).count()

        progress_percent = 0
        if total_lessons > 0:
            progress_percent = int((completed_lessons / total_lessons) * 100)

        # Lấy danh sách ID các bài đã học để Frontend tô xanh
        completed_ids = UserLessonProgress.objects.filter(user=user, is_completed=True).values_list('lesson_id', flat=True)

        return Response({
            "name": full_name,
            "email": user.email,
            "role": "Học viên Chính thức",
            "progress": {
                "percent": progress_percent,
                "completed": completed_lessons,
                "total": total_lessons,
                "completed_ids": list(completed_ids) # Trả về mảng [1, 5, 8...]
            }
        })
    
class MarkLessonView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lesson_id = request.data.get('lesson_id')
        if not lesson_id:
            return Response({"error": "Thiếu lesson_id"}, status=400)

        # Tìm bài học
        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "Bài học không tồn tại"}, status=404)

        # Tạo hoặc cập nhật tiến độ (Toggle: Nếu đang xong thì thành chưa, và ngược lại)
        progress, created = UserLessonProgress.objects.get_or_create(user=request.user, lesson=lesson)

        # Logic Toggle: Bấm lần 1 là xong, bấm lần 2 là bỏ xong (hoặc bạn có thể chỉ cho phép xong thôi)
        # Ở đây tôi làm logic: Luôn set là True khi gọi API này
        progress.is_completed = True
        progress.save()

        return Response({"status": "success", "is_completed": True})
    
class NoteView(APIView):
    permission_classes = [IsAuthenticated]

    # Lấy ghi chú của 1 bài học
    def get(self, request):
        lesson_id = request.query_params.get('lesson_id')
        if not lesson_id:
            return Response({"error": "Thiếu lesson_id"}, status=400)
        
        try:
            note = UserNote.objects.get(user=request.user, lesson_id=lesson_id)
            return Response({"content": note.content, "updated_at": note.updated_at})
        except UserNote.DoesNotExist:
            return Response({"content": ""}) # Chưa có note thì trả về rỗng

    # Lưu ghi chú
    def post(self, request):
        lesson_id = request.data.get('lesson_id')
        content = request.data.get('content', '')
        
        if not lesson_id:
            return Response({"error": "Thiếu lesson_id"}, status=400)

        # Tạo mới hoặc cập nhật (update_or_create)
        note, created = UserNote.objects.update_or_create(
            user=request.user, 
            lesson_id=lesson_id,
            defaults={'content': content}
        )
        
        return Response({"status": "success", "updated_at": note.updated_at})
    
class ResearchPostViewSet(viewsets.ReadOnlyModelViewSet):
    # Cho phép ai cũng xem được (AllowAny), không cần đăng nhập
    permission_classes = [permissions.AllowAny] 
    
    queryset = ResearchPost.objects.filter(is_public=True).order_by('-created_at')
    serializer_class = ResearchPostSerializer
    lookup_field = 'slug' # Lấy bài theo slug (VD: /api/research/bai-viet-1)
    
    # Cho phép tìm kiếm và lọc
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'summary']

class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    # Chỉ lấy những review được tích chọn "Hiển thị"
    queryset = Testimonial.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = TestimonialSerializer