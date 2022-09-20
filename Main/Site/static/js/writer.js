/**
 * submit POST of 'add new song' form (after checking the validity)
 * @returns when not valid
 */
function uploadingSongFormSubmit(){
    let name = document.getElementById("input-song-name").value;
    let artist = document.getElementById("input-song-artist").value;
    let lyrics = document.getElementById("input-lyrics").value;

    /* Удаляем запрещенные символы, повторяющиеся пробелы, пробелы на границах строки */
    name = name.replaceAll(/[/\:*?"<>|^[\]\\]/g, '')
    name = name.replace(/\s+/g, ' ');
    name = name[0] === ' ' ? name.slice(1) : name;
    name = name[name.length - 1] === ' ' ? name.slice(0, name.length - 2) : name;

    artist = artist.replaceAll(/[/\:*?"<>|^[\]\\]/g, '')
    artist = artist.replace(/\s+/g, ' ');
    artist = artist[0] === ' ' ? artist.slice(1) : artist;
    artist = artist[artist.length - 1] === ' ' ? artist.slice(0, artist.length - 2) : artist;

    if(!name || !artist || !lyrics){
        alert("Форма отправки песни должна содержать Название, Исполнителя и Текст");
        return;
    }

    document.getElementById("input-song-name").value = name;
    document.getElementById("input-song-artist").value = artist;

    document.getElementById("upload-song").submit();
}

/**
 * submit POST of 'add comment to song fragment' form (after checking the authorization)
 * @param {*} name song name
 * @param {*} artist song artist
 * @param {*} obj the Json object of coments
 * @returns when user not authorize
 */
function uploadComment(name, artist, obj){
    if (!currentUser){
        window.location.hash = '#login';
        return;
    }
    let data = JSON.stringify({ "name": name, "artist": artist, "obj": obj });
    document.getElementById("lyrics-aside").value = data;

    document.getElementById("comment-form").submit();
}

/**
 * submit POST of 'update user's avatar' form (after checking the authorization)
 */
document.getElementById('avatar-input').onchange = function(){    
    if(currentUser){
        console.log('update ' + currentUser.name + ' avatar');
        document.getElementById("avatar-input-name").value = currentUser.login;

        document.getElementById("update-avatar").submit();
    }
    else {
        alert('Авторизируйтесь!')
        window.location.hash = "#login"
    }
    
}
