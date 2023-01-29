const loginButton: HTMLElement = document.querySelector(".user-login-icon");
let loginPromptOpen: boolean = false;

loginButton.addEventListener("click", (event) => {
    if (loginPromptOpen) {
        return;
    }
    event.stopPropagation();
    console.log("Creating the login prompt.")

    // Create login prompt element
    const loginPrompt = document.createElement("div");
    loginPrompt.classList.add("login-prompt");
    loginPrompt.innerHTML = `
    <form>
      <label for="username">Username/E-mail</label>
      <input type="text" id="username" placeholder="Enter username or e-mail" required>
      <label for="password">Password</label>
      <input type="password" id="password" placeholder="Enter your password" required>
      <button type="submit">Login</button>
      <a href="#" class="register-link">Register</a>
      <a href="#" class="forgot-password-link">Forgot Password?</a>
    </form>
  `;

    document.body.appendChild(loginPrompt);

    loginPromptOpen = true;
});

document.addEventListener("click", (event) => {
    if (!(event.target as HTMLElement).closest(".login-prompt") && loginPromptOpen) {
        console.log("Removing the login prompt.")
        document.querySelector(".login-prompt").remove();
        loginPromptOpen = false;
    }
});
