const devices = new RegExp('Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini', "i"); 
if (devices.test(navigator.userAgent))
{
    alert("Версия для мобильного устройства");
    let classesToDelete = document.getElementsByClassName('desctop');
    for (let item of classesToDelete) {
        item.removeAttribute('class');
    }

    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = './css/mobile.css';
    head.appendChild(link);
    
}
else
{
    alert("Версия для ПК");
    let classesToDelete = document.getElementsByClassName('mobile');
    for (let item of classesToDelete) {
        item.removeAttribute('class');
    }
}