import validator from 'validator';
import { VALIDATOR_PARAMS_STRONG_PASSWORD } from '../params/user_input_params';

const params = {
    name: {
        min: 1,
        max: 64
    },
    username: {
        min: 1,
        max: 24
    }
}

// Input validation for users
export function userInfoCheck(firstName: string, lastName: string, username: string, email: string, password: string): { success: boolean, error?: string } {
    // check that first name and last name are not empty and valid non mailicious strings
    if (
        !validator.isAscii(firstName) || // if not ascii then not valid
        !validator.isAscii(lastName) ||
        validator.isEmpty(firstName) ||
        validator.isEmpty(lastName) ||
        !validator.isLength(firstName, { min: params.name.min, max: params.name.max }) ||
        !validator.isLength(lastName, { min: params.name.min, max: params.name.max }) ||
        !validator.isAlpha(firstName) ||
        !validator.isAlpha(lastName)
    ) return { success: false, error: `Names must be between ${params.name.min} and ${params.name.max} characters long and contain only letters.`};

    // username is not empty and valid non mailicious string
    if (
        !validator.isAscii(username) ||
        validator.isEmpty(username) ||
        !validator.isLength(username, { min: params.username.min, max: params.username.max }) ||
        !validator.isAlphanumeric(username)
    ) return { success: false, error: `Username must be between ${params.username.min} and ${params.username.max} characters long and contain only letters and numbers.`};

    // e-mail
    if (!validator.isAscii(email) || !validator.isEmail(email)) return { success: false, error: "Invalid e-mail."};

    // password
    if (!validator.isAscii(password) || !validator.isStrongPassword(password, VALIDATOR_PARAMS_STRONG_PASSWORD)) return { success: false, error: `Password must be at least ${(VALIDATOR_PARAMS_STRONG_PASSWORD as any).minLength} characters long and contain at least one lowercase letter, one uppercase letter, and one number.`};

    return { success: true, error: undefined };
}