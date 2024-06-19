export default function GetNavbarState() {
    function falseAll(){
        for (var i = 0; i < is_accent.length; i++){
            is_accent[i] = false
        };
    }
    
    var is_accent = [false, false, false, false, false, false, false, false];
    if (window.location.pathname.toString() == "/") {
        falseAll();
        is_accent[0] = true;
    }
    else if (window.location.pathname.toString() == "/booking") {
        falseAll();
        is_accent[1] = true;
    } else if (window.location.pathname.toString() == "/login") {
        falseAll();
        is_accent[5] = true;
    }
    
    return is_accent
}