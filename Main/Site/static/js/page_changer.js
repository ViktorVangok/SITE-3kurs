function changeOn(newPageId){
    let oldPage = document.querySelector('.visible');
    let newPage = document.querySelector(newPageId);
    if(newPage === oldPage){
        console.log("No Change")
        return;
    }
    console.log("Change #" + oldPage.id + " on " + newPageId);

    oldPage.classList.remove('visible');
    oldPage.classList.add('invisible');

    newPage.classList.remove('invisible');
    newPage.classList.add('visible');
}

window.onpopstate = function(event) {
    const newPageId = window.location.hash;
    if (newPageId) {
        if(!currentUser && newPageId === '#profile'){
            window.location.hash = '#login';
            return;
        }
        console.log('Now on ' + newPageId);
        changeOn(newPageId + '-page');
    }
    else {
        console.log('Now on #main');
        changeOn("#main-page");
    }
};

(() => {
    if (!window.location.hash) {
        window.location.hash = '#main';
    }
    let newPageId = window.location.hash;
    console.log(newPageId);
    if (newPageId === '#lyrics'){
        window.location.hash = '#main';
        return;
    }
    changeOn(newPageId + '-page');
})();