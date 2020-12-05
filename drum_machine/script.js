


var  keyValid = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C']
keyValid = keyValid.concat(keyValid.map(x => x.toLowerCase()));
console.log(keyValid);
function drumpadClick() {
    console.log('clicked');
    let id = $(this).find('audio:first').attr('id')
    console.log(id);
    $("#display").text(id);
    document.getElementById(id).play();
}

function keyPress(e) {
    if (keyValid.includes(String.fromCharCode(e.keyCode))) {
        document.getElementById(String.fromCharCode(e.keyCode).toUpperCase()).play();
    }
}

$(document).ready(function(){
    console.log('ready');
    $(".drum-pad").click(drumpadClick);
    $(window).keypress(keyPress);
 });