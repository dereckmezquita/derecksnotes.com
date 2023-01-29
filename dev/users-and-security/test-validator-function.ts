import validator from 'validator';

const strong_password_params: {} = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    returnScore: false,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10
}

function isValidUserInput(username: string, email: string, password: string, firstName: string, lastName: string): string {
    // username
    if (
        validator.isEmpty(username) ||
        !validator.isLength(username, { min: 3, max: 24 }) ||
        !validator.isAlphanumeric(username)
    ) return "Invalid username.";

    // e-mail
    if (!validator.isEmail(email)) return "Invalid e-mail.";

    // password
    if (!validator.isStrongPassword(password, strong_password_params)) return "Invalid password.";

    // first name/last name
    if (
        !validator.isAlphanumeric(firstName) ||
        !validator.isAlphanumeric(lastName)
    ) return "Invalid first/last name.";

    return "Valid inputs.";
}

console.log(isValidUserInput("user", "user@gmail.com", "Password123!", "First", "Last"));
// Output: true

console.log(isValidUserInput("us", "usergmail.com", "Password123", "First", "Last"));
// Output: false

console.log(isValidUserInput("", "user@gmail.com", "Password123!", "First", "Last"));
// Output: false

console.log(isValidUserInput("user", "user@gmail.com", "password", "First", "Last"));
// Output: false

console.log(isValidUserInput("user", "user@gmail.com", "Password123!", "First", ""));
// Output: false


