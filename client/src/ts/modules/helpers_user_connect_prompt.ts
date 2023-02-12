// function to be activated by onkeyup event of the inputs
export function confirmPasswordMatch(
    passwordElement: HTMLInputElement,
    confirmPassElement: HTMLInputElement,
    submitButton: HTMLButtonElement,
    originalStyles: {
        labelColours: string,
        submitButtonColor: string
    }
): void {
    // get the labels from the adjacent elements right before
    const passwordLabelElement = passwordElement.previousElementSibling as HTMLLabelElement;
    const confirmPassLabelElement = confirmPassElement.previousElementSibling as HTMLLabelElement;

    if (passwordElement.value !== confirmPassElement.value) {
        // add (passwords don't match) to the password label
        passwordLabelElement.innerHTML = "Password (passwords don't match)";
        passwordLabelElement.style.color = "red";
        confirmPassLabelElement.style.color = "red";

        // disable the submit button
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "grey";
    } else {
        // reset the styles
        passwordLabelElement.innerHTML = "Password";
        passwordLabelElement.style.color = originalStyles.labelColours;
        confirmPassLabelElement.style.color = originalStyles.labelColours;

        submitButton.disabled = false;
        submitButton.style.backgroundColor = originalStyles.submitButtonColor;
    }
}