// navbar activation by clicking
function flexNav() {
    const topNav: HTMLElement = document.getElementById("top-nav")!;

    if (topNav.className === "top-nav") {
        topNav.className += " responsive";
    } else {
        topNav.className = "top-nav";
    }

};

(window as Window).flexNav = flexNav;