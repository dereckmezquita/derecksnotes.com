import React from 'react';
import styled from 'styled-components';

const TopNav = styled.div`
  /* Add styles for .top-nav */
`;

const NavLink = styled.a`
  /* Add styles for .inactive */
`;

const Dropdown = styled.div`
  /* Add styles for .dropdown */
`;

const DropButton = styled.div`
  /* Add styles for .dropbtn */
`;

const DropdownContent = styled.div`
  /* Add styles for .dropdown-content */
`;

const NavRight = styled.a`
  /* Add styles for .nav-right */
`;

const NavClock = styled.a`
  /* Add styles for .nav-clock */
`;

const NavIcon = styled.a`
  /* Add styles for .icon */
`;

const Nav: React.FC = () => {
    const flexNav = () => {
        // Add flexNav functionality
    };

    return (
        <TopNav id="top-nav">
            <NavLink className="inactive" href="/index.html">
                Blog
            </NavLink>
            <NavLink className="inactive" href="/courses.html">
                Courses
            </NavLink>
            <NavLink className="inactive" href="/exercises.html">
                Exercises
            </NavLink>

            <Dropdown className="inactive">
                <DropButton className="dropbtn">
                    Dictionaries<i className="carrot-down"></i>
                </DropButton>
                <DropdownContent>
                    <a href="/dictionaries/dictionary-biology.html">Biology Dictionary</a>
                    <a href="/dictionaries/dictionary-chemistry.html">Chemistry Dictionary</a>
                </DropdownContent>
            </Dropdown>

            <NavLink className="inactive" href="/references.html">
                References
            </NavLink>

            <NavLink className="inactive" href="/tools.html">
                Tools
            </NavLink>

            <NavLink className="inactive" href="/art.html">
                Art
            </NavLink>

            <NavRight href="https://www.youtube.com/channel/UCzX8gJ22qtLqZuK56eT8L9g?view_as=subscriber" target="_blank" title="YouTube">
                <img src="/site-images/icons/youtube.png" className="theme-icon" />
            </NavRight>
            <NavRight href="https://www.linkedin.com/in/dereck/" target="_blank" title="LinkedIn">
                <img src="/site-images/icons/linkedin.png" className="theme-icon" />
            </NavRight>

            <NavClock className="clock nav-clock nav-right"></NavClock>
            <NavIcon className="icon" onClick={flexNav}>
                <span>&#9776;</span>
            </NavIcon>
        </TopNav>
    );
};

export default Nav;
