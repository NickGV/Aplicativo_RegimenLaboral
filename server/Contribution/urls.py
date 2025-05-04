from django.urls import path
from .views import ContributionListCreateView

urlpatterns = [
    path('', ContributionListCreateView.as_view(), name='contribution-list-create'),
]