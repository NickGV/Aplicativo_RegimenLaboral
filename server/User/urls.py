from django.urls import path
from .views import register, login, UserListCreateView
from .views import retrieve_user, update_user, delete_user

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user-list-create'),
    path('register/', register),
    path('login/', login),
    path('users/<int:id>/', retrieve_user, name='user-retrieve'),   
    path('users/<int:id>/', update_user,   name='user-update'),
    path('users/<int:id>/', delete_user,   name='user-delete'),
]