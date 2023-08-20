import * as Routes from "../../scripts/routes";
import { CONSOLE_LOG } from "../../scripts/env";
import { CREDENTIAL_INPUT, PASSWORD_INPUT, LOGIN_BUTTON, ALERT_DIV, SPINNER_DIV, } from "./dom";
document.addEventListener("DOMContentLoaded", function () {
    var _a;
    const data = {
        token: (_a = sessionStorage.getItem("token")) !== null && _a !== void 0 ? _a : "",
    };
    $.ajax({
        type: "POST",
        url: Routes.SESSIONS_API,
        data: "session=" + JSON.stringify(data),
        success: function (response) {
            CONSOLE_LOG && console.log("Token Response: ", response);
            let data = JSON.parse(response);
            if (data.data.redirect) {
                window.location.href = Routes.CLASSRECORDS_PAGE;
            }
        },
        error: function (xhr, status, error) {
            if (CONSOLE_LOG) {
                console.group(`DOM Load - Errors:`);
                console.error("XHR Status: ", xhr.status);
                console.error("XHR Text: ", xhr.responseText);
                console.error("Status: ", status);
                console.error("Error: ", error);
                console.groupEnd();
            }
        },
    });
});
LOGIN_BUTTON.addEventListener("click", login);
document.getElementById("Homepage_Button").onclick = homepage;
function login() {
    if (!CREDENTIAL_INPUT.value.length || !PASSWORD_INPUT.value.length) {
        return alertMessage(true, "Please enter the missing fields.");
    }
    alertMessage(false, "");
    return sendRequest();
}
function alertMessage(appearance, message) {
    if (appearance) {
        ALERT_DIV.classList.remove("hidden");
        ALERT_DIV.querySelector("span").innerText = message;
    }
    else {
        ALERT_DIV.classList.add("hidden");
        SPINNER_DIV.classList.add("hidden");
    }
}
function sendRequest() {
    SPINNER_DIV.classList.remove("hidden");
    let data = {
        credential: CREDENTIAL_INPUT.value.toLowerCase(),
        password: PASSWORD_INPUT.value,
    };
    $.ajax({
        type: "POST",
        url: Routes.LOGIN_API,
        data: "login=" + JSON.stringify(data),
        success: function (response) {
            CONSOLE_LOG && console.log("Successful Login Response: ", response);
            handleResponseData(JSON.parse(response));
        },
        error: function (xhr, status, error) {
            if (CONSOLE_LOG) {
                console.group(`Login - Errors:`);
                console.error("XHR Status: ", xhr.status);
                console.error("XHR Text: ", xhr.responseText);
                console.error("Status: ", status);
                console.error("Error: ", error);
                console.groupEnd();
            }
            handleResponseData(JSON.parse(xhr.responseText));
        },
    });
    SPINNER_DIV.classList.add("hidden");
}
function handleResponseData(data) {
    var _a;
    sessionStorage.setItem("token", (_a = data.data.token) !== null && _a !== void 0 ? _a : "");
    if (data.status === 200 && data.data.redirect) {
        window.location.href = Routes.CLASSRECORDS_PAGE;
    }
    else {
        alertMessage(true, data.message);
    }
}
function homepage() {
    window.location.href = Routes.HOME_PAGE;
}
