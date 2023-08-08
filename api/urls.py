from django.urls import path
# from .views import main
from api.viewstwo import download_youtube_audio_view, get_csrf_token

urlpatterns = [
    path('download', download_youtube_audio_view, name= 'download_youtube_audio_view'),
    path('getcsrftoken', get_csrf_token, name='get_csrf_token'),

]
