const logout = () => {
    localStorage.removeItem("accessToken");
    window.location ="/home";
};

const staffLogout = () => {
    localStorage.removeItem("accessToken");
    window.location ="/staffLogin"
}

export { logout, staffLogout };