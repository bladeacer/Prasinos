const logout = () => {
    sessionStorage.removeItem("accessToken");
    window.location ="/home";
};

const staffLogout = () => {
    sessionStorage.removeItem("accessToken");
    window.location ="/staffLogin"
}

export { logout, staffLogout };