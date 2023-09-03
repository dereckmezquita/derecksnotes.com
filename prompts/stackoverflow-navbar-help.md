I have my personal website which I wrote many years ago using HTML + ejs templates and scss. I am now in the process of re-writing the website using nextjs and react styled-components.

I am having trouble reproducing the behaviour of my nav bar my previous code in react and seeking help please. This is mostly a react/css problem.

## desired behaviour of navbar

I want my navbar to be as such:

1. A single bar across the screen with all links/buttons in-line.
   1. Links to different pages on the left side and some data/other links on the right side.
1. Some of the buttons on the left side should be drop-downs which are shown on hover.
   1. The drop-down content should be displayed directly below the button as a small rectangle with links aligned stacked.
1. The navbar should be responsive.
   1. When the user makes the window smaller than x amount (968px here) the navbar collapses and only displays a main link to the blog page (home page) and a hamburger button on the right side.
   1. When the user clicks on the hamburger button the menu drops down and shows all the links available.
   1. The drop-down menus should still function in this responsive mode when hovered over or clicked on on a mobile device.

## explanation of current problems and screenshots

Currently, the trouble I'm having is that my drop-down menus are not displayed correctly/below the drop-down button and I don't know how to make my navbar responsive using react. Should I use a hook, should I use css to track screen size etc. Please help.

Here are some screenshots of my previous version; which you can visit a live version of here: https://derecksnotes.com/

Navbar shown in desktop mode.
[![navbar in desktop mode][1]][1]
Dropdown menu hovered over in desktop mode.
[![dropdown menu hovered over][2]][2]
Navbar shown in responsive mode.
[![navbar and dropdown menu shown in responsive mode][3]][3]

My current version of the react navbar; dropdown not working and no responsive features:

Hovering over dropdown menu in react version.
[![react version broken][4]][4]

## code

### code for previous working version

Here is the code I have for the previous version:

```html

<div class="top-nav" id="top-nav">
    <!--  -->
    <a class="inactive" href="/index.html">Blog</a>
    <!--  -->
    <div class="inactive dropdown">
        <div class="dropbtn">
            Dictionaries<i class="carrot-down"></i>
        </div>
        <div class="dropdown-content">
            <a href="/dictionaries/dictionary-biology.html">Biology Dictionary</a>
            <a href="/dictionaries/dictionary-chemistry.html">Chemistry Dictionary</a>
        </div>
    </div>

    <a href="https://www.linkedin.com/in/dereck/" target="_blank" title="LinkedIn" class="nav-right">
        <img src="/site-images/icons/linkedin.png" class="theme-icon">
    </a>

    <a class="clock nav-clock nav-right"></a>
    <a class="icon" href="javascript:void(0);" onclick="flexNav()"><span>&#9776;</span></a>
</div>
```

This is the function responsible for the responsive behaviour:

```js
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
```

Here are the styles:

```scss

// --------------------------------
// Add a black background color to the top navigation
.top-nav {
	background-color: $content_background;
    overflow: hidden;
    margin: 20px auto;
    width: 90%;

    border: 1px solid $border;
    border-radius: 5px;

    box-shadow: 1px 1px 10px $shadow;

    &:hover {
        box-shadow: 1px 1px 20px $shadow;
        border-radius: 5px;
    }

    a {
        cursor: pointer;
        float: left;
        display: block;
        color: $theme6;
        text-align: center;
        padding: 14px 13px;
        text-decoration: none;
        font-size: 17px;
    }

    .icon {
        display: none;
    }
}

// So that the full navbar is presented on 12.9 ipad pro
@media screen and (max-width: 1024px) {
    .top-nav {
        width: 95%;
    }
}

.nav-right {
    float: right !important;
}

.theme-icon {
    height: 16px;
    cursor: pointer;
}

// Add an active class to highlight the current page
.active {
    background-color: $theme6;
    color: $white !important;
}

// --------------------------------
// Dropdown container - needed to position the dropdown content
.dropdown {
	float: left;
    overflow: hidden;
    
    .dropbtn {
        cursor: pointer;
    }

    .dropbtn {
        font-size: 17px;
        border: none;
        outline: none;
        color: $theme6;
        padding: 14px 13px;
        background-color: $content_background;
        font-family: inherit;
        margin: 0;
    }
}

// Style the dropdown content (hidden by default)
.dropdown-content {
	display: none;
	position: absolute;
	background-color: $content_background_solid;
	min-width: 160px;

    z-index: 1;
    
    border: 1px solid $border;
    border-radius: 5px;

    box-shadow: 1px 1px 10px $shadow;

    a {
        float: none;
    
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        text-align: left;

        // Add a grey background to dropdown links on hover
        &:hover {
            background-color: $theme6;
            color: $white !important;
        }
    }
}

// --------------------------------
// Add a dark background on topnav links and the dropdown button on hover
.top-nav a:hover, .dropdown:hover .dropbtn {
	background-color: $theme6;
	color: $white;
}

// Show the dropdown menu when the user moves the mouse over the dropdown button
.dropdown:hover .dropdown-content {
	display: block;
}

// When the screen is less than 600 pixels wide, hide all links, except for the first one ("Home"). Show the link that contains should open and close the topnav (.icon)
@media screen and (max-width: 975px) {
	.top-nav a:not(:first-child), .dropdown .dropbtn {
		display: none;
	}

	.top-nav a.icon {
		float: right;
		display: block;
	}
}

// The "responsive" class is added to the topnav with TypeScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally)
@media screen and (max-width: 975px) {
	.top-nav.responsive {
		position: relative;
	}

	.top-nav.responsive a.icon {
		position: absolute;
		right: 0;
		top: 0;
	}

	.top-nav.responsive a {
		float: none;
		display: block;
		text-align: left;
	}

	.top-nav.responsive .dropdown {
		float: none;
	}

	.top-nav.responsive .dropdown-content {
		position: relative;
	}

	.top-nav.responsive .dropdown .dropbtn {
		display: block;
		width: 100%;
		text-align: left;
	}
}
```

### current react version broken

```tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { hsla_colour, theme } from '@styles/theme';

const NavContainer = styled.nav`
    background-color: ${theme.container.background.colour.primary()};
    overflow: hidden;
    margin: 20px auto;
    width: 90%;
    color: ${theme.theme_colours[5]()};

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5), 0 0 20px rgba(100, 100, 40, 0.2) inset;

    &:hover {
        box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5);
    }

    @media screen and (max-width: 1024px) {
        width: 95%;
    }
`;

const CommonNavItem = styled.div<{ rightmost?: boolean }>`
    cursor: pointer;
    float: ${(props) => (props.rightmost ? 'right' : 'left')};
    display: block;
    color: inherit;
    text-align: center;
    padding: 14px 13px;
    text-decoration: none;
    font-size: 17px;

    &:hover {
        color: ${theme.text.colour.white()};
        background: ${theme.theme_colours[5]()};
    }
`;

// allows for argument to determine if align left or right
// inherit from Link component allows for linking to other pages
const NavItem = styled(CommonNavItem).attrs({ as: Link }) <{ rightmost?: boolean }>``;

const NavImage = styled.img`
    height: 16px;
    cursor: pointer;
`;

const DropDownContainer = styled.div`
    float: left;
    overflow: hidden;
`;

// the same as NavItem but no link
const DropDownLabel = styled(CommonNavItem)<{ rightmost?: boolean }>``;

const DropDownContent = styled.div`
    display: none;
    position: absolute;
    background-color: red;
    min-width: 160px;
    z-index: 1;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 10px #ccc;

    ${DropDownContainer}:hover & {
        display: block;
    }

    ${NavItem} {
        float: none;
        padding: 12px 16px;
        text-align: left;
    }
`;

const DateTimeDisplay = styled.div`
    cursor: pointer;
    float: right;
    display: block;
    color: inherit;
    text-align: center;
    padding: 14px 13px;
    text-decoration: none;
    font-size: 17px;
`;

// since using conditionals in components we must ensure that the component is mounted before rendering
// either this or use dynamic from next/dynamic
function NavBar() {
    const [hasMounted, setHasMounted] = useState(false);
    const [dateTime, setDateTime] = useState<string | null>(null);

    useEffect(() => {
        setHasMounted(true);

        const updateDateTime = () => {
            const currentDate = new Date();
            const displayDate = currentDate.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short'
            });
            const displayTime = currentDate.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            setDateTime(`${displayDate} ${displayTime}`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    if (!hasMounted) {
        return null;
    }
    return (
        <NavContainer>
            <NavItem href='/'>Blog</NavItem>
            <NavItem href='/courses'>Courses</NavItem>
            <DropDownContainer>
                <DropDownLabel>Dictionaries</DropDownLabel>
                <DropDownContent>
                    <NavItem href='/dictionaries/biology'>Biology Dictionary</NavItem>
                    <NavItem href='/dictionaries/chemistry'>Chemistry Dictionary</NavItem>
                </DropDownContent>
            </DropDownContainer>

            <NavItem rightmost href='https://www.linkedin.com/in/dereck/' target='_blank' title='LinkedIn'>
                <NavImage src='/site-images/icons/linkedin.png' />
            </NavItem>
            <DateTimeDisplay>{dateTime || "00 Jan 00:00:00"}</DateTimeDisplay>
        </NavContainer>
    )
}

export default NavBar;
```

Any help and guidance would be appreciated thank you!


  [1]: https://i.stack.imgur.com/vnsNZ.png
  [2]: https://i.stack.imgur.com/gV5oE.png
  [3]: https://i.stack.imgur.com/Srqgi.png
  [4]: https://i.stack.imgur.com/VuEpV.png