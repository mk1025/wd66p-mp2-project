import * as Routes from "../../scripts/routes.js";
const login_ExitButton = document.getElementById("Homepage_Button");
const credentialInput = document.getElementById("email_username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login_button");
const login_alert = document.getElementById("alert");
const spinner = document.getElementById("spinner");
loginButton.addEventListener("click", login);
function login() {
    const credential = credentialInput.value;
    const password = passwordInput.value;
    if (!credential.length || !password.length) {
        return alertMessage(true, "Please enter the missing fields");
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
        credential: credentialInput.value.toLowerCase(),
        password: passwordInput.value,
    };
    $.ajax({
        type: "POST",
        url: Routes.LOGIN_API,
        data: "login=" + JSON.stringify(data),
        success: function (response) {
            console.log("Successful Response: ", response);
            handleResponseData(JSON.parse(response));
        },
        error: function (xhr, status, error) {
            console.log("XHR Status: ", xhr.status);
            console.log("XHR Text: ", xhr.responseText);
            console.log("Status: ", status);
            console.error("Error: ", error);
            handleResponseData(JSON.parse(xhr.responseText));
        },
    });
    spinner.classList.add("hidden");
}
export default function handleResponseData(data) {
    var _a;
    sessionStorage.setItem("token", (_a = data.data.token) !== null && _a !== void 0 ? _a : "");
    if (data.status === 400) {
        alertMessage(true, data.message);
    }
    if (data.data.user) {
        window.location.href = Routes.HOME_PAGE;
    }
    if (data.data.redirect) {
        window.location.href = Routes.CLASSRECORDS_PAGE;
    }
}
login_ExitButton.addEventListener("click", () => {
    window.location.href = Routes.HOME_PAGE;
});
