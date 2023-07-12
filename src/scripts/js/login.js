"use strict";
const login_ExitButton = document.getElementById("Homepage_Button");
const login_emailUsernameInput = document.getElementById("email_username");
const login_passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login_button");
const login_alert = document.getElementById("alert");
const spinner = document.getElementById("spinner");
loginButton.addEventListener("click", login);
$(function () {
    var _a;
    let token = (_a = sessionStorage.getItem("token")) !== null && _a !== void 0 ? _a : "";
    const data = {
        request: "login",
        token: token,
    };
    $.ajax({
        type: "POST",
        url: "php/login.php",
        data: "session=" + JSON.stringify(data),
        success: function (response) {
            console.log(response);
            let postResponse = JSON.parse(response);
            if (postResponse.data.redirect) {
                window.location.href = "dashboard.html";
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(status);
            console.error(error);
            handleResponseData(JSON.parse(xhr.responseText));
        },
    });
});
login_ExitButton.addEventListener("click", () => {
    window.location.href = "index.html";
});
function login() {
    const emailUsername = login_emailUsernameInput.value;
    const password = login_passwordInput.value;
    if (emailUsername.length === 0 && password.length === 0) {
        return alertMessage(true, "Please enter your email and password");
    }
    if (emailUsername.length === 0) {
        return alertMessage(true, "Please enter your email");
    }
    if (password.length === 0) {
        return alertMessage(true, "Please enter your password");
    }
    alertMessage(false, "");
    return sendRequest();
}
function alertMessage(appearance, message) {
    if (appearance) {
        login_alert.classList.remove("hidden");
        login_alert.querySelector("span").innerText = message;
    }
    else {
        login_alert.classList.add("hidden");
        spinner.classList.add("hidden");
    }
}
function sendRequest() {
    spinner.classList.remove("hidden");
    let data = {
        input: login_emailUsernameInput.value.toLowerCase(),
        password: login_passwordInput.value,
    };
    $.ajax({
        type: "POST",
        url: "php/login.php",
        data: "login=" + JSON.stringify(data),
        success: function (response) {
            console.log(response);
            handleResponseData(JSON.parse(response));
        },
        error: function (xhr, status, error) {
            console.log(xhr.status);
            console.log(xhr.responseText);
            console.log(status);
            console.error(error);
            handleResponseData(JSON.parse(xhr.responseText));
        },
    });
    spinner.classList.add("hidden");
}
function handleResponseData(data) {
    var _a;
    sessionStorage.setItem("token", (_a = data.data.token) !== null && _a !== void 0 ? _a : "");
    if (data.status === 400) {
        alertMessage(true, data.message);
    }
    if (data.data.user) {
        window.location.href = "index.html";
    }
    if (data.data.redirect) {
        window.location.href = "dashboard.html";
    }
}
