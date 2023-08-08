
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from pytube import YouTube
import os
import re
import json
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


@csrf_exempt
def get_csrf_token(request):
    return JsonResponse({'csrfToken': request.COOKIES['csrftoken']})

@csrf_exempt
def download_youtube_audio_view(request):
    if request.method == 'POST':
        try:
            # Get the JSON data from the request body
            data = json.loads(request.body)
            yt_urls = data.get('yt_urls')
            if not yt_urls:
                return HttpResponseBadRequest("No YouTube URLs provided.")

            # Split the comma-separated URLs and remove any leading/trailing spaces
            yt_urls = [url.strip() for url in yt_urls.split(',')]

            # Process the YouTube URLs and download the audio
            success_urls = []
            failed_urls = []
            for yt_url in yt_urls:
                if valid(yt_url):
                    try:
                        download_youtube_audio(yt_url)
                        success_urls.append(yt_url)
                    except Exception as e:
                        failed_urls.append(f"{yt_url} - {e}")
                else:
                    failed_urls.append(f"{yt_url} is not a valid YouTube URL.")

            # Return a response indicating the success and failure of the download process
            response_data = {
                'success': success_urls,
                'failed': failed_urls,
            }
            return JsonResponse(response_data)

        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON data in the request body.")

    # Handle other request methods (e.g., GET) or invalid requests
    return HttpResponseBadRequest("Invalid Request")

@csrf_exempt
def valid(yt_url):
    pattern = r"(?:https?:\/\/)?(?:www\.)?youtube\.com"
    return bool(re.search(pattern, yt_url))

@csrf_exempt
def download_youtube_audio(yt_url):
    try:
        yt = YouTube(yt_url)
        # extract only audio
        video = yt.streams.filter(only_audio=True).first()
        # get the destination path from settings
        destination = settings.DEFAULT_DOWNLOAD_DIRECTORY
        # create the directory if it doesn't exist
        os.makedirs(destination, exist_ok=True)
        # download the file
        out_file = video.download(output_path=destination)
        # save the file with the .mp3 extension
        base, ext = os.path.splitext(out_file)
        new_file = base + '.mp3'
        os.rename(out_file, new_file)
        print("Download Successful")
    except Exception as e:
        raise Exception(f"Error downloading {yt_url}: {e}")
    

