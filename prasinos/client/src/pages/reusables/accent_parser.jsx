var goof_check = false;
var is_accent = [true, false, false, false, false,
    false, false, false, false, false,
    false, false
];
function falseAll() {
    for (var i = 0; i < is_accent.length; i++) {
        is_accent[i] = false
    };
}

if (window.location.pathname.toString() == "/home") {
    falseAll();
    is_accent[0] = true;
}
else if (window.location.pathname.toString() == "/booking") {
    falseAll();
    is_accent[1] = true;
}
else if (window.location.pathname.toString() == "/events") {
    falseAll();
    is_accent[2] = true;
}
else if (window.location.pathname.toString() == "/rewards") {
    falseAll();
    is_accent[3] = true;
}
else if (window.location.pathname.toString() == "/support") {
    falseAll();
    is_accent[4] = true;
}
else if (window.location.pathname.toString() == "/login") {
    is_accent[5] = true;
    is_accent[6] = false;
} else if (window.location.pathname.toString() == "/register") {
    is_accent[6] = true;
    is_accent[5] = false;
} else if (window.location.pathname.toString() == "/settings") {
    falseAll();
    is_accent[7] = true;
} else if (window.location.pathname.toString() == "/") {
    falseAll();
    is_accent[8] = true;
    goof_check = true;
} else if (window.location.pathname.toString() == "/dangerZone") {
    falseAll();
    is_accent[9] = true;
} else if (window.location.pathname.toString().match("/edit/.*")) {
    falseAll();
    is_accent[10] = true;
} else if (window.location.pathname.toString().match("/reset/.*")) {
    falseAll();
    is_accent[11] = true;
}
else {
    falseAll();
    goof_check = true;
}

export {is_accent, goof_check};