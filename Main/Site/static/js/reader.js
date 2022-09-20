class Reader{
    readTextFile(path)
    {
        let rawFile = new XMLHttpRequest();
        let rand_value = Date.now(); // чтобы он, блин, не сохранял в кэше страницу, а менял ее!!!!!
        rawFile.open("GET", path + "?" + rand_value, false);
        rawFile.send(null);

        return rawFile.responseText;
    }
}

const reader = new Reader();
