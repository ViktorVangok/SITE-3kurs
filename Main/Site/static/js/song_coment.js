let textarea = document.querySelector('#lyrics-page #lyrics-song');
textarea.addEventListener('select', function(){
    let content = window.getComputedStyle(document.querySelector('#lyrics-page #lyrics-song'),'::selection').userSelect;
    console.log(content);
});

function getHighlight() {
 
    let selection = window.getSelection(); // 1.
    
 
    let object = {
        parent : null,
        text   : '',
        rect   : null
    };
 
    // If selection is not empty.
    if ( selection.rangeCount > 0 ) {
        object = {
            text   : selection.toString().trim(), // get the text.
            parent : selection.anchorNode.parentNode, // get the element wrapping the text.
            rect   : selection.getRangeAt(0).getBoundingClientRect() // get the bounding box.
        };
    }
    return object; // 2.
}

let sharing = document.querySelector( '.sharing' );
document.querySelector('#lyrics-page').addEventListener( 'mouseup', function() {
    setTimeout( showMenu, 100 );
} );
 
function showMenu() {
 
    // 1.
    let highlight = getHighlight();
 
    // 2.
    if ( highlight.text === '' ) {
 
        sharing.setAttribute( 'class', 'sharing' );
        sharing.style.left = 0;
        sharing.style.top  = 0;
 
        return;
    }
 
    // 3.
    /**
     * Only show the sharing button if the selected is a paragraph.
     */
    if ( highlight.parent.nodeName !== 'PRE' ) {
        return;
    }
 
    // 4.
    let width = ( highlight.rect.width / 2 ) - 42;
    /**
     * The "42" is acquired from our sharing buttons width devided by 2.
     */
    
    sharing.setAttribute( 'class', 'sharing sharing--shown' );
    sharing.style.left = ( window.scrollX + highlight.rect.left + width ) + 'px';
    sharing.style.top  = ( window.scrollY + highlight.rect.top - 40 ) + 'px';
    /**
     * "40" is the height of our sharing buttons.
     * Herein, we lift it up above the higlighted area top position.
     */
}

// OnClick.
document.getElementById( 'share' ).addEventListener( 'click', function() {
 
    let highlight = getHighlight();
 
    if ( highlight.text !== '') {
        document.querySelector('.lyrics-song-fragment').textContent = highlight.text;
        document.getElementById('shareComment').style.display = "flex";
    }
} );