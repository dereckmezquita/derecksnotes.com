import validator from 'validator';
import { ErrorMessages, InputParams } from './constants';

// Input validation for users
export function checkRegisterInfo(firstName: string, lastName: string, username: string, email: string): { success: boolean, error?: string } {
    // check first and last name
    const firstNameCheck = checkName(firstName);
    const lastNameCheck = checkName(lastName);

    if (!firstNameCheck.success) return firstNameCheck;
    if (!lastNameCheck.success) return lastNameCheck;

    // check username
    const usernameCheck = checkUsername(username);

    if (!usernameCheck.success) return usernameCheck;

    // e-mail
    const emailCheck = checkEmail(email);

    if (!emailCheck.success) return emailCheck;

    return { success: true, error: undefined };
}

export function checkName(name: string): { success: boolean, error?: string } {
    // check that first name and last name are not empty and valid non malicious strings
    if (
        !validator.isAscii(name) || // if not ascii then not valid
        validator.isEmpty(name) ||
        !validator.isLength(name, { min: InputParams.NAME.MIN, max: InputParams.NAME.MAX }) ||
        !validator.isAlpha(name)
    ) return { success: false, error: ErrorMessages.NAME_ERROR.replace('{min}', InputParams.NAME.MIN.toString()).replace('{max}', InputParams.NAME.MAX.toString()) };

    return { success: true, error: undefined };
}

export function checkUsername(username: string): { success: boolean, error?: string } {
    // username is not empty and valid non malicious string
    if (
        !validator.isAscii(username) ||
        validator.isEmpty(username) ||
        !validator.isLength(username, { min: InputParams.USERNAME.MIN, max: InputParams.USERNAME.MAX }) ||
        !validator.isAlphanumeric(username)
    ) return { success: false, error: ErrorMessages.USERNAME_ERROR.replace('{min}', InputParams.USERNAME.MIN.toString()).replace('{max}', InputParams.USERNAME.MAX.toString()) };

    return { success: true, error: undefined };
}

export function checkEmail(email: string): { success: boolean, error?: string } {
    // check e-mail
    if (!validator.isAscii(email) || !validator.isEmail(email)) return { success: false, error: ErrorMessages.EMAIL_ERROR };

    return { success: true, error: undefined };
}
