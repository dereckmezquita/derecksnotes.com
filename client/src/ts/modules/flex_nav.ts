
// navbar activation by clicking
function flexNav() {
    const topNav: Element = document.getElementById("top-nav");

    if (topNav.className === "top-nav") {
        topNav.className += " responsive";
    } else {
        topNav.className = "top-nav";
    }

};

export { flexNav };
