
// src/helpers.ts
import { css } from 'styled-components';

export const linedGridBackground = css`
    background-size: ${(props) => props.theme.backgrounds.linedGrid.size};
    background-image: ${(props) => props.theme.backgrounds.linedGrid.image};
`;

export const dottedGridBackground = css`
    background-size: ${(props) => props.theme.backgrounds.dottedGrid.size};
    background-image: ${(props) => props.theme.backgrounds.dottedGrid.image};
`;

export const theme = {
    colours: {
        red: 'red',
        blue: '#0082FF',
        light_blue: '#4286f4',
        yellow: '#f0d461',
        yellow_background: '#fcf7e3',
        green: '#4DD964',
        light_green: '#82f061',
        green_background: '#e3fce4',
        dark_gray: '#666',
        gray: 'gray',
        light_gray: '#999',
        input_border: '#737373',
        input_border_light: '#949494',
        black: 'black',
        white: 'white',
        off_white: '#ece9e0',
        // for active items like clicked on etc
        theme_active: '#d0656a',
        // --------------------------------

        theme11: '#000000',
        theme10: '#001a00',
        theme9: '#003300',
        theme8: '#004d00',
        theme7: '#006600',

        theme6: '#008000',
        theme5: '#009900',
        theme4: '#00b300',
        theme3: '#00cc00',
        theme2: '#00e600',
        theme1: '#00ff00'
    },
    backgrounds: {
        linedGrid: {
            size: '12px 12px',
            image: 'linear-gradient(to right, rgb(240, 240, 240) 1px, transparent 1px), linear-gradient(to bottom, rgb(240, 240, 240) 1px, transparent 1px)'
        },
        dottedGrid: {
            size: '10px 10px',
            image: 'radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)'
        },
        colours: {
            border: '#CCC',
            shadow: 'rgba(153, 153, 153, 0.5)',
            background: 'rgb(255, 255, 255)',
            contentBackground: 'rgba(255, 255, 255, 0.65)',
            contentBackgroundSolid: 'rgba(255, 255, 255, 1)',
            promptBackground: 'rgba(255, 255, 255, 0.3)'
        },
        effects: {
            siteVignetting: '0 0 50px rgba(100, 100, 40, 0.8) inset',
            cardVignetting: '0 0 20px rgba(100, 100, 40, 0.2) inset',
            sepiaFilter: 'sepia(10%)'
        },
        cards: {
            background: 'rgba(255, 255, 255, 0.55)',
            backgroundHover: 'rgba(255, 255, 255, 1)'
        },
        figures: {
            background: 'rgb(255, 255, 255)',
            border: '#DDD',
            shadow: 'rgba(153, 153, 153, 0.2)'
        }
    },
    vars: {
        collapseSideBar: "1124px",
    }
};
