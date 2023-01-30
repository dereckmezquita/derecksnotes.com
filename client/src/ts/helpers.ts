import validator from 'validator';
import { VALIDATOR_PARAMS_STRONG_PASSWORD } from './user_input_params';

// Input validation for users
export function isValidUsername(username: string, email: string, password: string): { success: boolean, error?: string } {
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

    return { success: true, error: undefined };
}