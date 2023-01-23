const loginButton: HTMLElement = document.querySelector(".user-login-icon");

loginButton.addEventListener("click", () => {
    console.log("Login button clicked");

    const body: HTMLBodyElement = document.querySelector("body");
    
    // create a div container we attach to the body
    const loginPrompt: HTMLDivElement = document.createElement("div");
    loginPrompt.setAttribute("class", "login-prompt-container");

    

    // ------------------------
    body.appendChild(loginPrompt);
});
