from django.urls import path
from .views import register, login, UserListCreateView

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user-list-create'),
    path('register/', register),
    path('login/', login),
]