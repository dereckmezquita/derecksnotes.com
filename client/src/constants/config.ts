import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '../../../.env' });

// root starts at client/src
export const ROOT: string = path.join(process.cwd(), 'src');
export const ROOT_PUBLIC: string = path.join(process.cwd());

// app domain
export const APPLICATION_DOMAIN: string = 'derecksnotes.com';
export const APPLICATION_SUBDOMAIN: string = process.env.NEXT_PUBLIC_DEV_MODE === 'true' ? 'next.' : '';
export const APPLICATION_URL: string = APPLICATION_SUBDOMAIN + APPLICATION_DOMAIN;

// social images
export const APPLICATION_LOGO: string = APPLICATION_URL + '/site-images/512-logo.png';

// site info
export const APPLICATION_DESCRIPTION: string = "Making sciencing easier.";
export const APPLICATION_AUTHOR: { first_name: string, last_name: string } = { first_name: 'Dereck', last_name: 'Mezquita' };

export const APPLICATION_METADATA: {
    title: string, description: string, image: string, url: string
} = {
    title: 'Dereck\'s Notes',
    description: APPLICATION_DESCRIPTION,
    image: APPLICATION_LOGO,
    url: APPLICATION_URL
};

// time and date
// 1 days, 24 hours, 60 minutes, 60 seconds, 1000 milliseconds
export const REFRESH_STORE_DATA_INTERVAL: number = 1 * 2 * 60 * 60 * 1000;

// defaults for users
export const DEFAULT_PROFILE_IMAGE: string = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23ccc' /><text x='50%' y='50%' font-size='40' text-anchor='middle' dy='.3em' fill='%23777'>?</text></svg>";

// api
export const API_PREFIX: string = process.env.NEXT_PUBLIC_DEV_MODE === 'true' ? '/api/v3' : '/api';
export const MAX_COMMENT_DEPTH: number = 5;