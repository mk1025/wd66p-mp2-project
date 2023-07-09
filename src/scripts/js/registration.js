"use strict";
const PROFILE_MIN_WIDTH = 200;
const PROFILE_MIN_HEIGHT = 200;
const PROFILE_MAX_WIDTH = 2048;
const PROFILE_MAX_HEIGHT = 2048;
const profileUploadBtn = document.getElementById("profile_upload");
const profilePlaceholder = document.getElementById("Profile_Placeholder");
const alertBox = document.getElementById("alert-box");
const alertRedMessages = document.getElementById("alert-red-messages");
const emailInput = document.getElementById("email");
const firstNameInput = document.getElementById("first_name");
const lastNameInput = document.getElementById("last_name");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm_password");
const registerButton = document.getElementById("Register_Button");
const homepageButton = document.getElementById("Homepage_Button");
homepageButton.addEventListener("click", () => {
    window.location.href = "index.html";
});
emailInput.addEventListener("input", () => {
    if (!emailInput.validity.valid) {
        validationMessage("vm-email", "Please enter a valid email address.", true);
    }
    else {
        validationMessage("vm-email", "", false);
    }
    checkAllInputs();
});
firstNameInput.addEventListener("input", checkAllInputs);
lastNameInput.addEventListener("input", checkAllInputs);
usernameInput.addEventListener("input", () => {
    const pattern = /^[A-Za-z0-9_]+$/;
    if (!usernameInput.validity.valid) {
        usernameInput.value.length < usernameInput.minLength
            ? validationMessage("vm-username-minlength", `Username must have minimum of a ${usernameInput.minLength} characters.`, true)
            : validationMessage("vm-username-minlength", "", false);
        usernameInput.value.length > usernameInput.maxLength
            ? validationMessage("vm-username-maxlength", `Username have only a maximum of ${usernameInput.maxLength} characters.`, true)
            : validationMessage("vm-username-maxlength", "", false);
        !isNaN(parseInt(usernameInput.value[0]))
            ? validationMessage("vm-username-firstchar", "First character in the username must not be a number.", true)
            : validationMessage("vm-username-firstchar", "", false);
        !pattern.test(usernameInput.value)
            ? validationMessage("vm-username-pattern", "Username must only contain letters, numbers or an underscore.", true)
            : validationMessage("vm-username-pattern", "", false);
    }
    else {
        validationMessage("vm-username", "", false);
        validationMessage("vm-username-minlength", "", false);
        validationMessage("vm-username-maxlength", "", false);
        validationMessage("vm-username-firstchar", "", false);
        validationMessage("vm-username-pattern", "", false);
    }
    checkAllInputs();
});
passwordInput.addEventListener("input", () => {
    const digitLookahead = /(?=.*\d)/;
    const lowercaseLookahead = /(?=.*[a-z])/;
    const uppercaseLookahead = /(?=.*[A-Z])/;
    const specialLookahead = /(?=.*[!@#$%^&*])/;
    const spaceLookahead = /\s/;
    if (!passwordInput.validity.valid) {
        passwordInput.value.length < passwordInput.minLength
            ? validationMessage("vm-password-minlength", `Password must have a minimum of ${passwordInput.minLength} characters`, true)
            : validationMessage("vm-password-minlength", "", false);
        passwordInput.value.length > passwordInput.maxLength
            ? validationMessage("vm-password-maxlength", `Password must not exceed ${passwordInput.maxLength}`, true)
            : validationMessage("vm-password-maxlength", "", false);
        !digitLookahead.test(passwordInput.value)
            ? validationMessage("vm-password-digits", "Password must contain at least one digit", true)
            : validationMessage("vm-password-digits", "", false);
        !lowercaseLookahead.test(passwordInput.value)
            ? validationMessage("vm-password-lowercase", "Password must contain at least one lowercase character", true)
            : validationMessage("vm-password-lowercase", "", false);
        !uppercaseLookahead.test(passwordInput.value)
            ? validationMessage("vm-password-uppercase", "Password must contain at least one uppercase character", true)
            : validationMessage("vm-password-uppercase", "", false);
        !specialLookahead.test(passwordInput.value)
            ? validationMessage("vm-password-special", "Password must have atleast one special character (!@#$%^&*)", true)
            : validationMessage("vm-password-special", "", false);
        spaceLookahead.test(passwordInput.value)
            ? validationMessage("vm-password-spaces", "Password cannot contain spaces", true)
            : validationMessage("vm-password-spaces", "", false);
    }
    else {
        validationMessage("vm-password-minlength", "", false);
        validationMessage("vm-password-maxlength", "", false);
        validationMessage("vm-password-digits", "", false);
        validationMessage("vm-password-lowercase", "", false);
        validationMessage("vm-password-uppercase", "", false);
        validationMessage("vm-password-special", "", false);
        validationMessage("vm-password-spaces", "", false);
    }
    checkAllInputs();
});
confirmPasswordInput.addEventListener("input", () => {
    if (confirmPasswordInput.value !== passwordInput.value) {
        validationMessage("vm-confirm-password", "Passwords do not match", true);
    }
    else {
        validationMessage("vm-confirm-password", "", false);
    }
    checkAllInputs();
});
profileUploadBtn.addEventListener("change", () => {
    var _a;
    const imagefile = (_a = profileUploadBtn.files) === null || _a === void 0 ? void 0 : _a[0];
    if (imagefile) {
        const image = new Image();
        image.src = URL.createObjectURL(imagefile);
        image.onload = () => {
            const width = image.width;
            const height = image.height;
            console.log(`Image Size -> W: ${width}, H: ${height}`);
            if (width >= PROFILE_MIN_WIDTH &&
                width <= PROFILE_MAX_WIDTH &&
                height >= PROFILE_MIN_HEIGHT &&
                height <= PROFILE_MAX_HEIGHT) {
                validationMessage("vm-image-size", "", false);
                console.log(imagefile);
            }
            else {
                validationMessage("vm-image-size", `Image height and width must be between ${PROFILE_MIN_HEIGHT}px and ${PROFILE_MAX_HEIGHT}px.`, true);
                console.log("Invalid Image Size");
            }
            profilePlaceholder.src = image.src;
        };
    }
    checkAllInputs();
});
function validationMessage(id, message, appear) {
    var _a;
    let element = document.createElement("span");
    element.classList.add("mb-2");
    element.id = id;
    element.innerText = message;
    if (appear) {
        if (!document.getElementById(id))
            alertRedMessages.appendChild(element);
        if (alertBox.classList.contains("hidden"))
            alertBox.classList.remove("hidden");
        registerButton.disabled = true;
    }
    else {
        (_a = alertRedMessages.querySelector(`#${id}`)) === null || _a === void 0 ? void 0 : _a.remove();
    }
    if (alertRedMessages.children.length === 0) {
        alertBox.classList.add("hidden");
        registerButton.disabled = false;
    }
}
function checkAllInputs() {
    if ($("#email").val() &&
        $("#username").val() &&
        $("#password").val() &&
        $("#confirm_password").val() &&
        $("#first_name").val() &&
        $("#last_name").val()) {
        validationMessage("vm-all-inputs", "", false);
    }
    else {
        validationMessage("vm-all-inputs", "Please fill all inputs.", true);
    }
}
function sendData() {
    var _a;
    let imageInput = $("#profile_upload")[0];
    const imageFile = (_a = imageInput.files) === null || _a === void 0 ? void 0 : _a[0];
    const formData = new FormData();
    formData.append("email_address", $("#email").val());
    formData.append("username", $("#username").val());
    formData.append("password", $("#password").val());
    formData.append("first_name", $("#first_name").val());
    formData.append("last_name", $("#last_name").val());
    if (imageFile) {
        formData.append("image", imageFile);
    }
    else {
        const defaultImagePath = "assets/placeholders/profile_placeholder.png";
        const defaultImageFile = new File([], defaultImagePath, { type: "image/png" });
        formData.append("image", defaultImageFile);
    }
    $.ajax({
        type: "POST",
        url: "php/registration.php",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response);
            handleResponse(response);
        },
        error: function (xhr, status, error) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(status);
            console.error(error);
            handleResponse(xhr.responseText);
        },
    });
}
function handleResponse(response) {
    let responseJSON = JSON.parse(response);
    switch (responseJSON.status) {
        case 400:
            setModal("error", responseJSON.title, responseJSON.message);
            break;
        case 201:
            setModal("success", responseJSON.title, responseJSON.message);
            break;
        case 409:
            setModal("warning", responseJSON.title, responseJSON.message);
            break;
    }
}
function setModal(status, title, message) {
    const modal = document.getElementById("modal");
    const modalContainer = document.getElementById("modal-container");
    while (modalContainer.firstChild) {
        modalContainer.removeChild(modalContainer.firstChild);
    }
    const modalIcon = document.createElement("i");
    switch (status) {
        case "error":
            modalIcon.classList.add("fa-solid", "fa-circle-xmark", "text-4xl", "text-red-400");
            break;
        case "warning":
            modalIcon.classList.add("fa-solid", "fa-circle-exclamation", "text-4xl", "text-orange-400");
            break;
        case "success":
            modalIcon.classList.add("fa-solid", "fa-circle-check", "text-4xl", "text-green-400");
            break;
    }
    const modalTitle = document.createElement("h1");
    modalTitle.classList.add("font-semibold", "text-2xl", "text-center", "text-neutral-500");
    modalTitle.innerText = title;
    const modalMessage = document.createElement("p");
    modalMessage.classList.add("text-center", "text-sm", "text-neutral-500");
    modalMessage.innerText = message;
    modalContainer.appendChild(modalIcon);
    modalContainer.appendChild(modalTitle);
    modalContainer.appendChild(modalMessage);
    modal.showModal();
}
