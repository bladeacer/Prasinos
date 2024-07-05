const logout = () => {
    localStorage.clear();
    window.location = "/home";
};

const staffLogout = () => {
    localStorage.clear();
    window.location = "/staffLogin";
}

export { logout, staffLogout };