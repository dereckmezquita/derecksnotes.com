import { Response } from 'express';

export function sendRes(res: Response, success: boolean, data?: any, errorMsg?: string): void {
    // res is an express response object; use here send response
    res.json({
        success: success,
        data: data,
        error: errorMsg
    });
}

import validator from 'validator';
import { VALIDATOR_PARAMS_STRONG_PASSWORD } from '../../../config/user-input-params';

// Input validation for users
export function isValidUserInput(username: string, email: string, password: string, firstName: string, lastName: string): { success: boolean, error?: string } {
    // username
    if (
        validator.isEmpty(username) ||
        !validator.isLength(username, { min: 3, max: 24 }) ||
        !validator.isAlphanumeric(username)
    ) return { success: false, error: "Invalid username."};

    // e-mail
    if (!validator.isEmail(email)) return { success: false, error: "Invalid e-mail."};

    // password
    if (!validator.isStrongPassword(password, VALIDATOR_PARAMS_STRONG_PASSWORD)) return { success: false, error: "Invalid password."};

    // first name/last name
    if (
        !validator.isAlphanumeric(firstName) ||
        !validator.isAlphanumeric(lastName)
    ) return { success: false, error: "Invalid first/last name."};

    return { success: true, error: undefined };
}