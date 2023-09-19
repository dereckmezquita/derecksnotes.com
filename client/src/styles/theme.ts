import { green_theme as colour_scheme } from './theme_colours';

// h: hue - controls the colour; a number between 0 and 360
// s: saturation - controls the intensity of the colour; a number between 0 and 100
// l: lightness - controls the brightness of the colour; a number between 0 and 100
// a: alpha - controls the opacity of the colour; a number between 0 and 1
export function hsla_colour(h: number, s: number, l: number, a: number = 1) {
    return function (h1?: number, s1?: number, l1?: number, a1?: number) {
        return `hsla(${h1 || h}, ${s1 || s}%, ${l1 || l}%, ${a1 || a})`;
    }
}

export const theme = {
    theme_colours: colour_scheme,
    icon: {
        colour: hsla_colour(205, 70, 50, 1)
    },
    container: {
        background: {
            colour: {
                primary: hsla_colour(0, 0, 100, 1), // this is the deepest background that gets the lines
                content: hsla_colour(0, 0, 100, 0.65), // used for content holders; posts etc
                solid: hsla_colour(0, 0, 100, 1), // used for solid backgrounds
            }
        },
        shadow: {
            primary: '1px 1px 10px hsla(0, 0%, 60%, 0.5)',
            box: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        },
        border: {
            radius: '0.25rem',
            colour: {
                // colour is #ccc
                primary: hsla_colour(0, 0, 80, 1),
            }
        },
        spacing: {
            xsmall: '0.25rem',
            small: '0.5rem',
            medium: '1rem',
            large: '2rem',
            xlarge: '4rem',
        },
        breakpoints: {
            small: '480px',
            medium: '768px',
            large: '1024px',
            xlarge: '1200px',
        },
        widths: {
            min_width_snap_up: '1096px' // min size of post before it snaps up to full width
        }
    },
    text: {
        font: {
            roboto: 'Roboto, sans-serif',
            arial: 'Arial, sans-serif',
            times: 'Times, serif',
            // header: 'Montserrat, sans-serif'
            header: 'Arial, Helvetica, sans-serif',
        },
        colour: {
            primary: hsla_colour(0, 0, 15, 1), // black for reading
            header: colour_scheme[5], // headers and logo
            anchor: colour_scheme[6], // links
            anchor_hover: colour_scheme[7], // links light grey
            // contrasting blue colour for visited links
            anchor_visited: hsla_colour(120, 100, 5),
            white: hsla_colour(0, 0, 100, 1), // white for inverted reading
            light_grey: hsla_colour(0, 0, 60, 1)
        },
        size: {
            small: '0.8rem',
            normal: '1rem',
            medium: '1.2rem',
            large: '1.5rem',
            xlarge: '2rem',
            title: '3rem',
            subtitle: '1.5rem'
        },
        weight: {
            normal: 400,
            medium: 500,
            bold: 700,
            light: 300,
        }
    },
    colours: {
        primary: '#34495E',
        secondary: '#F5F8FA',
        error: '#DB3737',
        success: '#0F9960',
        warning: '#FFB366',
        info: '#106BA3',
        text: '#253238',
        mutedText: '#5C7080',
        overlay: 'rgba(16, 22, 26, 0.7)',
        buttonPrimary: '#106BA3',
        buttonSecondary: '#F5F8FA',
        offWhite: '#F8F9FA',
        darkGray: '#343A40',
        accent1: '#8A2387',
        accent2: '#E94057',
        accent3: '#F27121',
        accent4: '#FBBD08',
        accent5: '#B5CC18',
        anchor: '#106BA3',
        anchorHover: '#253238'
    }
};