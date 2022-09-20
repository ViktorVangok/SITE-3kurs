class SongItem {
    constructor(songName, artistName, imagePath, songLyrics) {
        this.songName = songName;
        this.artistName = artistName;
        this.imagePath = imagePath;
        this.songLyrics = songLyrics;
    }
}

class SongComment {
    constructor(start, end, comment) {
        this.start = parseInt(start);
        this.end = parseInt(end);
        this.comment = comment;
    }
}

class JournalNode {
    songPath;
    datetime;
}

/**
 * Loading songs from DB.
 * @returns List of songs (see class SongItem).
 */
function getSongs() {
    let songs = new Set();
    let catalog = JSON.parse(reader.readTextFile(sourcePath + 'songDB/catalog.json')).Nodes;
    catalog.forEach(node => {
        songs.add(JSON.parse(reader.readTextFile(sourcePath + node.songPath)).SongItem);
    });

    return songs;
}

/**
 * Gets the song lyrics from DB.
 * @param {*} name 
 * @param {*} artist 
 * @returns The lyrics of the song.
 */
function getLyrics (name, artist){
    console.log("Loading song lyrics by name:" + name + ", and artist:" + artist);
    return JSON.parse(reader.readTextFile(sourcePath + 'songDB/' + artist + '/' + name + '/SongItem.json')).SongItem.songLyrics;    
}

/**
 * Loads the comments of song by name and artist from DB.
 * @param {*} name Song name
 * @param {*} artist Song Artist
 * @returns List of comments (see class SongComment).
 */
function getComments(name, artist){
    let comments = null;
    try{
        comments = JSON.parse(reader.readTextFile(sourcePath + 'songDB/' + artist + '/' + name + '/SongComments.json')).SongComments;
    }
    catch(e){
        console.log(e);
    }
    finally{
        return comments.sort(function (a, b) {
            if (a.start > b.start) {
              return 1;
            }
            if (a.start < b.start) {
              return -1;
            }
            return 0;
          });;
    }
}

/**
 * Joins song lyrics and wrapped by <span class='coment'> coments.
 * @param {*} name song name
 * @param {*} artist song artist
 * @returns innerHTML for <div> contains lyrics with coments.
 */
function getLyricsWithComments (name, artist){
    console.log("Loading comments of lyrics named:" + name + ", and artist:" + artist);

    let text = getLyrics(name, artist);
    let comments = getComments(name, artist);
    let resulted_text = "";

    if(comments?.size !== 0)
    {
        let currentIndex = 0;
        let span = "<span>", end_span = "</span>";
        comments?.forEach(comment => {
            /* 
                Шаблон: <span id='comment-0-50' class='comment'>...</span> 
            */
            let span_comment = "<span id='comment-" + comment.start + "-" + comment.end + "' class='comment' onclick='commentClick(this)'>";
            
            let st = comment.start;
            let ed = comment.end;

            let text_comment = text.substring(st, ed);
            
            resulted_text += text.substring(currentIndex, st);
            resulted_text += span_comment + text_comment + end_span;
            currentIndex = ed;
        });
        resulted_text += text.substring(currentIndex);
    }
    else
    {
        resulted_text = text;
    }

    return resulted_text;    
}

/**
 * Main function that gets list of songs and generetes patterned <li> for each one.
 */
function loadSongs() {
    console.log("Loading songs");

    let ul = document.querySelector('#song-list');
    let scaffoldedLiItem = ul.querySelectorAll('li')[0];

    let songs = getSongs();
    
    let i = 0;
    songs.forEach(song => {
        if (i >= ul.querySelectorAll('li').length) {            
            ul.appendChild(scaffoldedLiItem.cloneNode(true));
            console.log("Add li element");
        }

        let li = ul.querySelectorAll('li')[i];
        li.querySelector(".song-name").textContent = song.songName;

        li.querySelector(".song-artist").textContent = song.artistName;

        li.querySelector(".song-lyrics").textContent = song.songLyrics.substring(0, 50) + '...';
        
        if (song.imagePath){
            li.querySelector(".song-image").src = sourcePath + song.imagePath;
        }
        else{
            li.querySelector(".song-image").src = sourcePath + '../img/song-default.ico'
        }

        li.addEventListener('click', function (){
            let name = this.querySelector('.song-name').textContent;
            let artist = this.querySelector('.song-artist').textContent;
            let img = this.querySelector('.song-image').src;
            
            let textarea = document.querySelector('#lyrics-page #lyrics-song');

            textarea.innerHTML = getLyricsWithComments(name, artist);
            textarea.style.height = "fit-content";
            
            let textname = document.querySelector('#lyrics-page .lyrics-song-name');
            let textartist = document.querySelector('#lyrics-page .lyrics-song-artist');
            let lyricsimg = document.querySelector('#lyrics-page .lyrics-song-image');
            let textcomment = document.querySelector('#lyrics-page .lyrics-song-fragment');
            let textaside = document.querySelector('#lyrics-page #lyrics-aside');

            textname.textContent = name;
            textartist.textContent = artist;
            lyricsimg.src = img;
            textcomment.textContent = "Выделите фрагмент текста";
            textaside.value = "Добавьте комментарий...";
        });

        i++;
    });
}

/**
 * Event reaction on click on <span class='comment'>.
 * @param {*} elem The element clicked (to know the id that contains info about the coment clicked)
 */
function commentClick(elem){
    document.querySelector(".lyrics-song-fragment").textContent = elem.textContent;

    let st = new Number(elem.id.substring(elem.id.indexOf("-") + 1, elem.id.lastIndexOf("-")));
    let ed = new Number(elem.id.substring(elem.id.lastIndexOf("-") + 1));
    
    let name = document.querySelector(".lyrics-song-name").textContent;
    let artist = document.querySelector(".lyrics-song-artist").textContent;
    let comment = getComments(name, artist).filter(comment => comment.start == st && comment.end == ed)[0].comment;
    document.querySelector("#lyrics-aside").value = comment;
}

/**
 * Builds Json object of coment and calls upload function
 */
function setComment(){
    let name = document.querySelector('#lyrics-page .lyrics-song-name').textContent;
    let artist = document.querySelector('#lyrics-page .lyrics-song-artist').textContent;

    let fragment = document.querySelector(".lyrics-song-fragment").textContent;
    let text = getLyrics(name, artist);
    let comment = document.querySelector("#lyrics-aside").value;

    const indexes = [...text.matchAll(new RegExp(fragment, 'gi'))].map(a => a.index);

    let com = new Array();
    indexes.forEach(index => {
        com.push(new SongComment(index, index + fragment.length, comment));
    });

    let obj = new Object();
    obj['SongComments'] = com;
    console.log(JSON.stringify(obj)); // отправка джейсона на запись

    uploadComment(name, artist, obj);
}
