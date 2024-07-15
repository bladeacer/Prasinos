let goof_check = false;
let is_accent = [true, false, false, false, false,
    false, false, false, false, false,
    false, false
];
function falseAll() {
    is_accent.fill(false);
}
function setAccentN(n) {
    falseAll();
    is_accent[n] = true;
}
function setLogin(){
    is_accent[5] = true;
    is_accent[6] = false;
}
function setRegister(){
    is_accent[6] = true;
    is_accent[5] = false;
}
const editRegex = /^\/edit\/.*$/; // Matches "/edit/" followed by anything
const resetRegex = /^\/reset\/.*$/; // Matches "/reset/" followed by anything

const accentRouteMap = new Map([
    ['/home', () => setAccentN(0)],
    ['/booking', () => setAccentN(1)],
    ['/events', () => setAccentN(2)],
    ['/rewards', () => setAccentN(3)],
    ['/support', () => setAccentN(4)],
    ['/login', () => setLogin()],
    ['/register', () => setRegister()],
    ['/settings', () => setAccentN(7)],
    ['/', () => setAccentN(8)],
    ['/dangerZone', () => setAccentN(9)],
    ['/edit', () => setAccentN(10)],
    ['/reset', () => setAccentN(11)],
    // ... (add entries for other accent routes and function calls)
    ['*', () => { // Default function for unmatched paths
        falseAll();
        goof_check = true;
    }]
]);
let pathname = window.location.pathname.toString();

const setAccentFromPath = (path) => {
    accentRouteMap.get(path)(); // Call the function associated with the path (or default)
};

setAccentFromPath(pathname);

// if (window.location.pathname.toString() == "/home") {
//     falseAll();
//     is_accent[0] = true;
// }
// else if (window.location.pathname.toString() == "/booking") {
//     falseAll();
//     is_accent[1] = true;
// }
// else if (window.location.pathname.toString() == "/events") {
//     falseAll();
//     is_accent[2] = true;
// }
// else if (window.location.pathname.toString() == "/rewards") {
//     falseAll();
//     is_accent[3] = true;
// }
// else if (window.location.pathname.toString() == "/support") {
//     falseAll();
//     is_accent[4] = true;
// }
// else if (window.location.pathname.toString() == "/login") {
//     is_accent[5] = true;
//     is_accent[6] = false;
// } else if (window.location.pathname.toString() == "/register") {
//     is_accent[6] = true;
//     is_accent[5] = false;
// } else if (window.location.pathname.toString() == "/settings") {
//     falseAll();
//     is_accent[7] = true;
// } else if (window.location.pathname.toString() == "/") {
//     falseAll();
//     is_accent[8] = true;
//     goof_check = true;
// } else if (window.location.pathname.toString() == "/dangerZone") {
//     falseAll();
//     is_accent[9] = true;
// } else if (window.location.pathname.toString().match("/edit/.*")) {
//     falseAll();
//     is_accent[10] = true;
// } else if (window.location.pathname.toString().match("/reset/.*")) {
//     falseAll();
//     is_accent[11] = true;
// }
// else {
//     falseAll();
//     goof_check = true;
// }

export { is_accent, goof_check };