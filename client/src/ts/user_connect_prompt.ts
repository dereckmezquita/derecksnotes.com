import { login, register, resetPassword } from './modules/request';
import { pass2HashText } from './modules/cryptography_helpers';
import { getEventListeners } from 'events';

type PromptType = undefined | "login" | "register" | "forgotPassword";

class UserConnectPrompt {
    static userLoginIcon = document.querySelector(".user-login-icon") as HTMLElement;
    private readonly salt: string = "derecks-notes";
    // this is the current prompt html
    private prompt: HTMLElement = document.createElement("div");
    // this stores if a prompt is open and which one
    private activePrompt: PromptType = undefined; // when undefined no prompt is open
    // login prompt
    private static readonly loginForm: string = `
    <form>
        <label for="username">Username/E-mail</label>
        <input type="text" id="username" placeholder="Enter username/e-mail" required>
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Enter password" required>
        <button type="submit" class="submit-login">Login</button>
        <a class="register-link">Register</a>
        <a class="forgot-password-link">Forgot Password?</a>
    </form>`;
    // registration prompt
    private static readonly registerForm: string = `
    <form>
        <label for="first-name">First Name</label>
        <input type="text" id="first-name" value="John" required>
        <label for="last-name">Last Name</label>
        <input type="text" id="last-name" value="Doe" required>
        <label for="username">Username</label>
        <input type="text" id="username" value="johndoe23" required>
        <label for="email">E-mail</label>
        <input type="email" id="email" value="johndoe23@example.com" required>
        <label for="password">Password</label>
        <input type="password" id="password" value="password123" required>
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" value="password123" required>
        <button type="submit" class="submit-register">Register</button>
        <a class="login-link">Login</a>
        <a class="forgot-password-link">Forgot Password?</a>
    </form>`;
    // forgot password prompt
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
        this.addListeners(this.prompt);
    }

    // listeners for opening and closing the prompt
    private addListeners(prompt: HTMLElement) {
        UserConnectPrompt.userLoginIcon.addEventListener("click", (event) => {
            event.stopPropagation();

            // if this.activePrompt is not undefined; then a prompt is already open do nothing
            if (this.activePrompt) return;

            this.createPrompt();
            this.activePrompt = "login";
            this.addLoginFormListeners(prompt);
        });

        // if the user clicks outside of the prompt close it
        document.addEventListener("click", (event) => {
            const temp1 = !prompt.contains(event.target as HTMLElement);
            console.log(`!prompt.contains(event.target as HTMLElement): ${temp1}`)
            // if the click is outside of the prompt destroy it
            if (!prompt.contains(event.target as HTMLElement)) {
                // this.destroyPrompt();
            }
        });
    }

    private addLoginFormListeners(prompt: HTMLElement) {
        const submit = prompt.querySelector("button[type='submit']") as HTMLElement;
        const registerLink = prompt.querySelector(".register-link") as HTMLElement;
        const forgotPasswordLink = prompt.querySelector(".forgot-password-link") as HTMLElement;

        submit.addEventListener("click", async (event) => {
            event.preventDefault();

            // user data
            const username: string = (prompt.querySelector("#username") as HTMLInputElement).value;
            const password: string = (prompt.querySelector("#password") as HTMLInputElement).value;

            const hashStr: string = await pass2HashText(password, this.salt);

            // send the login request
            const res: ServerRes = await login(username, hashStr);

            if (!res.success) throw new Error(res.error);

            // console.log(res.data);

            this.destroyPrompt();
        });

        registerLink.addEventListener("click", (event) => {
            event.preventDefault();
            this.switchForm("register")
        });

        forgotPasswordLink.addEventListener("click", (event) => {
            event.preventDefault();
            this.switchForm("forgotPassword")
        });
    }

    private addRegisterFormListeners(prompt: HTMLElement) {
        const submit = prompt.querySelector("button[type='submit']") as HTMLElement;
        const loginLink = prompt.querySelector(".login-link") as HTMLElement;
        const forgotPasswordLink = prompt.querySelector(".forgot-password-link") as HTMLElement;

        submit.addEventListener("click", async (event) => {
            event.preventDefault();

            // user data
            const firstName: string = (prompt.querySelector("#first-name") as HTMLInputElement).value;
            const lastName: string = (prompt.querySelector("#last-name") as HTMLInputElement).value;
            const username: string = (prompt.querySelector("#username") as HTMLInputElement).value;
            const email: string = (prompt.querySelector("#email") as HTMLInputElement).value;
            const password: string = (prompt.querySelector("#password") as HTMLInputElement).value;

            console.log(`Registering user: ${username} with password: ${password} and email: ${email} and first name: ${firstName} and last name: ${lastName}`)

            this.destroyPrompt();
        });

        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            this.switchForm("login");
        });

        forgotPasswordLink.addEventListener("click", (event) => {
            event.preventDefault();
            this.switchForm("forgotPassword");
        });
    }

    private addForgotPasswordFormListeners(prompt: HTMLElement) {
        const submit = prompt.querySelector("button[type='submit']") as HTMLElement;
        const loginLink = prompt.querySelector(".login-link") as HTMLElement;
        const registerLink = prompt.querySelector(".register-link") as HTMLElement;

        submit.addEventListener("click", async (event) => {
            event.preventDefault();

            // user data
            const email: string = (prompt.querySelector("#email") as HTMLInputElement).value;

            console.log(`Forgot password e-mail: ${email}`)

            // const res: ServerRes = await forgotPassword(email);

            // if (!res.success) throw new Error(res.error);

            // console.log(res.data);

            this.destroyPrompt();
        });

        loginLink.addEventListener("click", event => {
            event.preventDefault();
            this.switchForm("login");
        });

        registerLink.addEventListener("click", event => {
            event.preventDefault();
            this.switchForm("register");
        });
    }

    private switchForm(form: PromptType) {
        this.activePrompt = form;
        console.log(`Switching to ${form} form`);

        // not sure if need bind on adding these listeners
        switch (form) {
            case "login":
                this.prompt.innerHTML = UserConnectPrompt.loginForm;
                this.addLoginFormListeners(this.prompt);
                break;
            case "register":
                this.prompt.innerHTML = UserConnectPrompt.registerForm;
                this.addRegisterFormListeners(this.prompt);
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