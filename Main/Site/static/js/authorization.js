function authorizationFormSubmit(){
    let login = document.querySelector("#inputLogin").value;
    let pass = document.querySelector('#inputPassword').value;
    let singIn = document.querySelector('#sign-in').checked;
    let singUp = document.querySelector('#sign-up').checked;

    if(!login || !pass){
        alert("Проверьте вводимые данные");
        return;
    }

    if(singIn){
        console.log("login as " + login);
        userLogin(login, pass);
    }
    else if(singUp){
        console.log("register " + login);
        userRegister(login, pass);
    }
    else{
        console.log("Error");
    }
}

function userLogin(login, password){
    currentUser = JSON.parse(reader.readTextFile(sourcePath + "usersDB/users.json")).users
        .filter(user => user.login === login && user.password === password)[0];
    if (!currentUser){
        alert("Пользователь не найден. \nЗарегестрируйтесь или проверьте входные данные");
        return false;
    }
    if(currentUser.imagePath){
        document.querySelectorAll("img.avatar").forEach(img => img.src = sourcePath + currentUser.imagePath);
    }
    else{
        document.querySelectorAll("img.avatar").forEach(img => img.src = sourcePath + '../img/avatar.png');
    }
    document.querySelector("#profile-page .username").textContent = currentUser.login;
    
    sessionStorage.removeItem('user');
    sessionStorage.setItem('user', JSON.stringify(currentUser));

    window.location.hash = "#profile";
    return true;
}

function userRegister(login, password){
    let name = login;
    name = name.replaceAll(/[/\:*?"<>|^[\]\\]/g, '');
    name = name.replace(/\s+/g, ' ');
    name = name[0] === ' ' ? name.slice(1) : name;
    name = name[name.length - 1] === ' ' ? name.slice(0, name.length - 2) : name;

    if(name !== login){
        alert('Имя не должно содержать запрещенные символы[/\:*?"<>|^[\]\\], повторяющиеся пробелы, пробелы на границах строки');
        return;
    }

    document.getElementById("login-form").submit();
    setTimeout(function() {
        userLogin(login, password);
    }, 2000);
}