import { hsla_colour } from './theme';

// h: hue - controls the colour; a number between 0 and 360
// s: saturation - controls the intensity of the colour; a number between 0 and 100
// l: lightness - controls the brightness of the colour; a number between 0 and 100
// a: alpha - controls the opacity of the colour; a number between 0 and 1
export const green_theme = [
    hsla_colour(0, 0, 0),
    hsla_colour(120, 100, 5),
    hsla_colour(120, 100, 10),
    hsla_colour(120, 100, 15),
    hsla_colour(120, 100, 20),

    hsla_colour(120, 100, 25), // main colour to use
    hsla_colour(120, 100, 30),
    hsla_colour(120, 100, 35),
    hsla_colour(120, 100, 40),
    hsla_colour(120, 100, 45),
    hsla_colour(120, 100, 50)
];

export const red_theme = [
    hsla_colour(0, 0, 0),
    hsla_colour(357, 100, 5),
    hsla_colour(357, 100, 10),
    hsla_colour(357, 100, 15),
    hsla_colour(357, 100, 20),

    hsla_colour(357, 100, 25), // main colour to use
    hsla_colour(357, 100, 30),
    hsla_colour(357, 100, 35),
    hsla_colour(357, 100, 40),
    hsla_colour(357, 100, 45),
    hsla_colour(357, 100, 50)
];

export const blue_theme = [
    hsla_colour(0, 0, 0),
    hsla_colour(180, 100, 5),
    hsla_colour(180, 100, 10),
    hsla_colour(180, 100, 15),
    hsla_colour(180, 100, 20),

    hsla_colour(180, 100, 25), // main colour to use
    hsla_colour(180, 100, 30),
    hsla_colour(180, 100, 35),
    hsla_colour(180, 100, 40),
    hsla_colour(180, 100, 45),
    hsla_colour(180, 100, 50)
];

export const gold_theme = [
    hsla_colour(0, 0, 0),
    hsla_colour(43, 98, 7),
    hsla_colour(43, 98, 17),
    hsla_colour(43, 98, 25),
    hsla_colour(43, 98, 35),

    hsla_colour(43, 98, 45), // main colour to use
    hsla_colour(43, 90, 55),
    hsla_colour(43, 80, 65),
    hsla_colour(43, 70, 70),
    hsla_colour(43, 60, 80),
    hsla_colour(43, 50, 90)
];

export const purple_theme = [
    hsla_colour(0, 0, 0),
    hsla_colour(270, 100, 5),
    hsla_colour(270, 100, 10),
    hsla_colour(270, 100, 15),
    hsla_colour(270, 100, 20),

    hsla_colour(270, 100, 25), // main colour to use
    hsla_colour(270, 100, 30),
    hsla_colour(270, 100, 35),
    hsla_colour(270, 100, 40),
    hsla_colour(270, 100, 45),
    hsla_colour(270, 100, 50)
];

export const orange_theme = [
    hsla_colour(0, 0, 0),
    hsla_colour(30, 100, 25),
    hsla_colour(30, 100, 30),
    hsla_colour(30, 100, 35),
    hsla_colour(30, 100, 40),

    hsla_colour(30, 100, 45), // main colour to use
    hsla_colour(30, 100, 50),
    hsla_colour(30, 100, 55),
    hsla_colour(30, 100, 60),
    hsla_colour(30, 100, 65),
    hsla_colour(30, 100, 80)
];

// Industrial Orange Theme - bright but readable orange
export const industrial_orange_theme = [
    hsla_colour(0, 0, 0),
    hsla_colour(22, 90, 10), // Very dark orange
    hsla_colour(22, 85, 20), // Dark orange
    hsla_colour(22, 85, 30), // Deep orange
    hsla_colour(22, 80, 40), // Rich orange

    hsla_colour(22, 80, 50), // Main orange - more pastel for readability
    hsla_colour(22, 75, 60), // Bright orange
    hsla_colour(22, 70, 70), // Light orange
    hsla_colour(22, 65, 80), // Pale orange
    hsla_colour(22, 60, 90), // Very light orange
    hsla_colour(22, 55, 95) // Almost white with orange tinge
];
