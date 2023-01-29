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
    }

    // disable clicks on the rest of the page
    document.body.style.pointerEvents = "none";

    // add login prompt to the body
    document.body.appendChild(loginPrompt);
});

// add click event listener to the document
document.addEventListener("click", (event) => {
    // check if clicked outside of login prompt and prompt is open
    if (!loginPrompt.contains(event.target as HTMLElement) && isLoginPromptOpen) {
        // re-enable clicks on the rest of the page
        document.body.style.pointerEvents = "";

        // remove the login prompt
        loginPrompt.remove();
        isLoginPromptOpen = false;
    }
});
