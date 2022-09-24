
// this script is included on pages that have the nav bar
// when the page width is made smaller this function is responsible for activating the nav bar from the hamburger menu

// navbar activation by clicking
function flexNav() {
    const topNav: Element = document.getElementById("top-nav");

    if (topNav.className === "top-nav") {
        topNav.className += " responsive";
    } else {
        topNav.className = "top-nav";
    }

};

(window as Window).flexNav = flexNav;
