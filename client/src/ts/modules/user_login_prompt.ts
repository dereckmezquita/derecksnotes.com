// import { subtle } from 'crypto';
import { login, register } from './request';

// flag to check if login prompt is open or not
let isLoginPromptOpen = false;

// login prompt element to hold form
let loginPrompt: HTMLElement;

// select login button
const loginButton = document.querySelector(".user-login-icon");

// add click event listener to the login button
loginButton.addEventListener("click", (event) => {
    event.stopPropagation();

    // return if login prompt is already open
    if (isLoginPromptOpen) return;

    isLoginPromptOpen = true;

    // check if login prompt is created or not
    if (!loginPrompt) {
        // create the login prompt
        loginPrompt = document.createElement("div");
        loginPrompt.classList.add("login-prompt");
        loginPrompt.innerHTML = `
      <form>
        <label for="username">Username/E-mail</label>
        <input type="text" id="username" placeholder="Enter username or e-mail" required>
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Enter password" required>
        <button type="submit">Login</button>
        <a href="#" class="register-link">Register</a>
        <a href="#" class="forgot-password-link">Forgot Password?</a>
      </form>
    `;

        // stop propagation of click events within the login prompt
        loginPrompt.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        // select the form
        const form = loginPrompt.querySelector("form");

        // add submit event listener to the form
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            // get username and password
            const username = (form.querySelector("#username") as HTMLInputElement).value;
            const password = (form.querySelector("#password") as HTMLInputElement).value;

            // hash the password - using web crypto library - sha512
            const encoder = new TextEncoder();
            const decoder = new TextDecoder('ascii');

            const salt = "derecks-notes";

            // encode the password and salt as an array buffer
            const passBuff = encoder.encode(password + salt);

            // hash the password using sha512 from crypto.subtle
            // returns an array buffer
            const hashBuff = await crypto.subtle.digest("SHA-512", passBuff);

            // We want to represent the binary hash data as a string, so that we can put it into a JSON string
            const hashStr: string = decoder.decode(hashBuff);

            // send login request
            const res: ServerRes = await login(username, hashStr);

            if (!res.success) throw new Error(res.error);

            console.log(res.data);

            // remove the login prompt
            // loginPrompt.remove();
            // isLoginPromptOpen = false;
        });
    }

    // add login prompt to the body
    document.body.appendChild(loginPrompt);
});

// add click event listener to the document
document.addEventListener("click", (event) => {
    // check if clicked outside of login prompt and prompt is open
    if (!loginPrompt.contains(event.target as HTMLElement) && isLoginPromptOpen) {
        // remove the login prompt
        loginPrompt.remove();
        isLoginPromptOpen = false;
    }
});