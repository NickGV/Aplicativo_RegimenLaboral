from rest_framework import routers
from .views import SolicitudViewSet

router = routers.DefaultRouter()
router.register(r'solicitudes', SolicitudViewSet)

urlpatterns = router.urls