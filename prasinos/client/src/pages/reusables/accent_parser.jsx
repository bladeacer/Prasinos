let goof_check = false;
let is_accent = [true, false, false, false, false,
    false, false, false, false, false,
    false, false, false, false, false,
    false
];
// Add staff login, staff register and staff home accent parsers
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
    ['/verify', () => setAccentN(12)],
    ['/staffLogin', () => setAccentN(13)],
    ['/staffRegister', () => setAccentN(14)],
    ['/staffHome', () => setAccentN(15)],
    // ... (add entries for other accent routes and function calls)
    ['*', () => { // Default function for unmatched paths
        falseAll();
        goof_check = true;
    }]
]);
let pathname = window.location.pathname.toString();

const setAccentFromPath = (path) => {
    const setAccentFunction = accentRouteMap.get(path);

    // Check if a function exists for the path
    if (setAccentFunction) {
      setAccentFunction(); // Call the function if it exists
    }
};

setAccentFromPath(pathname);

export { is_accent, goof_check };