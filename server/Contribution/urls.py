from django.urls import path
from .views import ContributionListCreateView
from .views import (
    contribution_list,
    contribution_get,
    contribution_update,
    contribution_delete
)

urlpatterns = [
    path('create', ContributionListCreateView.as_view()),
    path('list', contribution_list),
    path('<int:pk>/', contribution_get),
    path('<int:pk>/update/', contribution_update),
    path('<int:pk>/delete/', contribution_delete),
]