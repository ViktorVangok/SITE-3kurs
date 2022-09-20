from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import HttpRequest
from Main.settings import BASE_DIR
import os
import json
from datetime import datetime
from django.core.files.storage import FileSystemStorage
# from PIL import Image
# import io
# from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.base import ContentFile

def index(request):
    if request.method  == "POST":
        # Форма регистрации
        if 'inputLogin' in request.POST:            
            registerUser(request.POST)
            return redirect('/#login')

        # Форма добавления песни
        elif 'input-song-name' in request.POST:
            addSong(request)
            return redirect("/#main")

        # Форма обновления аватарки
        elif 'avatar-input' in request.FILES:
            updateAvatar(request)
            return redirect('/#profile')
        
        # Форма добавления комментария
        elif 'lyrics-aside' in request.POST:
            addComment(request.POST)
            return redirect("/#main")

        
    
    return render(request, 'index.html', {})


def registerUser(post):
    path = os.path.join(BASE_DIR, "Site\\static\\source\\usersDB\\users.json")

    newuser = {
        "login": post["inputLogin"],
        "password": post["inputPassword"],
        "imagePath": None
    }

    with open(path, mode="r", encoding="utf-8") as read_file:
        data = json.load(read_file)
        data['users'].append(newuser)

    with open(path, mode="w", encoding="utf-8") as write_file:
        json.dump(data, write_file)

    return


def addSong(request):
    name = request.POST['input-song-name']
    artist = request.POST['input-song-artist']
    lyrics = request.POST['input-lyrics']
    img =  request.FILES['input-song-img'] if 'input-song-img' in request.FILES else None
    imgtype = img.name.split('.')[-1] if img else None

    path = os.path.join(BASE_DIR, "Site\\static\\source\\songDB")

    path += "\\" + artist
    if not os.path.exists(path):
        os.makedirs(path)
    
    path += "\\" + name
    if not os.path.exists(path):
        os.makedirs(path)
    
    songItem = {
        "SongItem": {	
            "songName": name,
            "artistName": artist,
            "imagePath": "SongDB\\" + artist + "\\" + name + "\\songImage." + imgtype if img else None,
            "songLyrics": lyrics	
        }
    }

    songComments = {
        "SongComments": []
    }

    node = {
        "songPath":"SongDB/" + artist + "/" + name + "/SongItem.json",
        "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    with open(path + "\\songItem.json", mode="w+", encoding="utf-8") as write_file:
        json.dump(songItem, write_file, ensure_ascii=False)
    
    with open(path + "\\songComments.json", mode="w+", encoding="utf-8") as write_file:
        json.dump(songComments, write_file, ensure_ascii=False)

    if img:
        fs = FileSystemStorage()
        fs.save(path + "\\songImage." + imgtype, img)

    path = os.path.join(BASE_DIR, "Site\\static\\source\\songDB\\catalog.json")
    with open(path, mode="r", encoding="utf-8") as read_file:
        catalog = json.load(read_file)
        catalog['Nodes'].insert(0, node)

    with open(path, mode="w", encoding="utf-8") as write_file:
        json.dump(catalog, write_file, ensure_ascii=False)
    
    return


def updateAvatar(request):
    #path = os.path.join(BASE_DIR, "Site\\static\\source\\usersDB\\1.jpg")
    path = os.path.join(BASE_DIR, "Site\\static\\source\\usersDB\\")

    username = request.POST["avatar-input-name"]
    img = request.FILES['avatar-input']
    imgtype = img.name.split('.')[-1]
    fs = FileSystemStorage()
    path += username + "." + imgtype
    if(os.path.exists(path)):
        os.remove(path)
    fs.save(path, img)

    path2 = os.path.join(BASE_DIR, "Site\\static\\source\\usersDB\\users.json")

    with open(path2, mode="r", encoding="utf-8") as read_file:
        data = json.load(read_file)
        for usr in data['users']:
            if usr['login'] == username:
                usr['imagePath'] = "usersDB/" + username + "." + imgtype
                break

    with open(path2, mode="w", encoding="utf-8") as write_file:
        json.dump(data, write_file)

    return


def addComment(post):
    data = json.loads(post["lyrics-aside"])

    name = data['name']
    artist = data['artist']
    obj = data['obj']

    path = os.path.join(BASE_DIR, "Site\\static\\source\\songDB\\" + artist + "\\" + name + "\\SongComments.json")

    with open(path, mode="r", encoding="utf-8") as read_file:
        data = json.load(read_file)
        for com in obj["SongComments"]:
            data['SongComments'].append(com)

    with open(path, mode="w", encoding="utf-8") as write_file:
        json.dump(data, write_file, ensure_ascii=False)
    return