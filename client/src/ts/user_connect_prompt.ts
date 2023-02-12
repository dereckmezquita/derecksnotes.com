import { login, register, resetPassword } from './modules/request';
import { pass2HashText } from './modules/cryptography_helpers';
import { confirmPasswordMatch } from './modules/helpers_user_connect_prompt';

import * as valid from './modules/validators';

type PromptType = undefined | "login" | "register" | "forgotPassword";

class UserConnectPrompt {
    static userLoginIcon = document.querySelector(".user-login-icon") as HTMLElement;

    private readonly salt: string = "derecks-notes"; // unique salt is used on the server; this is to avoid sending data over clear text
    private prompt: HTMLElement = document.createElement("div"); // this stores if a prompt is open and which one
    private activePrompt: PromptType = undefined; // when undefined no prompt is open

    // ------------------------------------------------
    private static readonly loginForm: string = `
    <form>
        <label for="username">Username</label>
        <input type="text" id="username" placeholder="Enter username" required>
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Enter password" required>
        <button type="submit">Login</button>
        <a class="register-link">Register</a>
        <a class="forgot-password-link">Forgot Password?</a>
    </form>`;
    // ------------------------------------------------
    private static readonly registerForm: string = `
    <form>
        <label for="first-name">First Name</label>
        <input type="text" id="first-name" required>
        <label for="last-name">Last Name</label>
        <input type="text" id="last-name" required>
        <label for="username">Username</label>
        <input type="text" id="username" required>
        <label for="email">E-mail</label>
        <input type="email" id="email" required>
        <label id="password-label" for="password">Password</label>
        <input type="password" id="password" required>
        <label  id="confirm-password-label" for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" required>
        <button class="submit-register" type="submit">Register</button>
        <a class="login-link">Login</a>
        <a class="forgot-password-link">Forgot Password?</a>
    </form>`;
    // ------------------------------------------------
    private static readonly forgotPasswordForm: string = `
    <form>
        <label for="username">Username/E-mail</label>
        <input type="text" id="username" placeholder="Enter username/e-mail" required>
        <button type="submit">Send</button>
        <a class="login-link">Login</a>
        <a class="register-link">Register</a>
    </form>`;

    constructor() {
        this.prompt.innerHTML = UserConnectPrompt.loginForm;
        this.addListeners();
    }

    // listeners for opening and closing the prompt
    private addListeners() {
        UserConnectPrompt.userLoginIcon.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            // if this.activePrompt is not undefined; then a prompt is already open do nothing
            if (this.activePrompt) return;

            this.createPrompt();
            this.activePrompt = "login";
            this.addLoginFormListeners.bind(this.prompt);
        });

        // if the user clicks outside of the prompt close it
        document.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            // if the click is outside of the prompt destroy it
            if (!this.prompt.contains(event.target as HTMLElement)) {
                console.log("Detected click outside prompt; destroying prompt")
                this.destroyPrompt();
            }
        });
    }

    private addLoginFormListeners(prompt: HTMLElement) {
        const submit = prompt.querySelector("button[type='submit']") as HTMLElement;
        const registerLink = prompt.querySelector(".register-link") as HTMLElement;
        const forgotPasswordLink = prompt.querySelector(".forgot-password-link") as HTMLElement;

        submit.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            // user data
            const username: string = (prompt.querySelector("#username") as HTMLInputElement).value;
            const password: string = (prompt.querySelector("#password") as HTMLInputElement).value;

            const hashStr: string = await pass2HashText(password, this.salt);

            // send the login request
            const res: ServerRes = await login(username, hashStr);

            if (!res.success) throw new Error(res.error);

            console.log(`Login response:`, res.data)

            this.destroyPrompt();
        });

        registerLink.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            this.switchForm("register")
        });

        forgotPasswordLink.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            this.switchForm("forgotPassword")
        });
    }

    private addRegisterFormListeners(prompt: HTMLElement) {
        const submit = prompt.querySelector("button[type='submit']") as HTMLElement;
        const loginLink = prompt.querySelector(".login-link") as HTMLElement;
        const forgotPasswordLink = prompt.querySelector(".forgot-password-link") as HTMLElement;

        submit.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            // user data
            const firstName: string = (prompt.querySelector("#first-name") as HTMLInputElement).value;
            const lastName: string = (prompt.querySelector("#last-name") as HTMLInputElement).value;
            const username: string = (prompt.querySelector("#username") as HTMLInputElement).value;
            const email: string = (prompt.querySelector("#email") as HTMLInputElement).value;
            const password: string = (prompt.querySelector("#password") as HTMLInputElement).value;

            // check user inputs
            const userCheck = valid.userInfoCheck(firstName, lastName, username, email, password);

            if (!userCheck.success) {
                alert(userCheck.error);
                throw new Error(userCheck.error);
            }

            const hashStr: string = await pass2HashText(password, this.salt);

            // send the register request
            const res: ServerRes = await register(firstName, lastName, username, email, hashStr);

            if (!res.success) throw new Error(res.error);

            alert(res.data);

            this.destroyPrompt();
        });

        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            this.switchForm("login");
        });

        forgotPasswordLink.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            this.switchForm("forgotPassword");
        });
    }

    private addForgotPasswordFormListeners(prompt: HTMLElement) {
        const submit = prompt.querySelector("button[type='submit']") as HTMLElement;
        const loginLink = prompt.querySelector(".login-link") as HTMLElement;
        const registerLink = prompt.querySelector(".register-link") as HTMLElement;

        submit.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            // user data
            const email: string = (prompt.querySelector("#email") as HTMLInputElement).value;

            const res: ServerRes = await resetPassword(email);

            if (!res.success) throw new Error(res.error);

            console.log(`Reset password response: `, res.data);

            this.destroyPrompt();
        });

        loginLink.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            this.switchForm("login");
        });

        registerLink.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            this.switchForm("register");
        });
    }

    private switchForm(form: PromptType) {
        this.activePrompt = form;

        // not sure if need bind on adding these listeners
        switch (form) {
            case "login":
                this.prompt.innerHTML = UserConnectPrompt.loginForm;
                this.addLoginFormListeners(this.prompt);
                break;
            case "register":
                this.prompt.innerHTML = UserConnectPrompt.registerForm;
                this.addRegisterFormListeners(this.prompt);
                // add confirmPass to onkeyup event of the inputs
                const passwordInput = document.querySelector("#password") as HTMLInputElement;
                const confirmPassInput = document.querySelector("#confirm-password") as HTMLInputElement;
                // get the submit button for the register form
                const submitBtn = document.querySelector(".submit-register") as HTMLButtonElement;

                passwordInput.addEventListener("keyup", () => {
                    confirmPasswordMatch(passwordInput, confirmPassInput, submitBtn, {
                        labelColours: "black",
                        submitButtonColor: submitBtn.style.color
                    })
                });
                confirmPassInput.addEventListener("keyup", () => {
                    confirmPasswordMatch(passwordInput, confirmPassInput, submitBtn, {
                        labelColours: "black",
                        submitButtonColor: submitBtn.style.color
                    })
                });
                break;
            case "forgotPassword":
                this.prompt.innerHTML = UserConnectPrompt.forgotPasswordForm;
                this.addForgotPasswordFormListeners(this.prompt);
                break;
        }
    }

    private createPrompt() {
        // Create a new prompt HTML element
        this.prompt.classList.add("login-prompt");
        // Set the prompt's initial form as the login form
        this.prompt.innerHTML = UserConnectPrompt.loginForm;

        this.activePrompt = "login";

        // Append the prompt to the document body
        document.body.appendChild(this.prompt);

        this.addLoginFormListeners(this.prompt);
    }

    private destroyPrompt() {
        // Remove the prompt from the document
        this.prompt.remove();
        this.prompt = document.createElement("div");

        this.activePrompt = undefined;
    }
}

new UserConnectPrompt();
