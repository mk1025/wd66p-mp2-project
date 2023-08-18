import * as Routes from "../../scripts/routes";
import { LinearScale } from "../../scripts/math";
import { CONSOLE_LOG } from "../../scripts/env";
import * as DOM from "../../scripts/dom";
import { PROFILE_FIRSTNAME, PROFILE_LASTNAME, PROFILE_PHOTO, NEW_TRANSMUTATION_BUTTON, LOGOUT_BUTTON, TRANSMUTATION_MODAL, ERROR_MODAL, } from "./dom";
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
            CONSOLE_LOG &&
                console.log("Successful Response: ", JSON.parse(response) || response);
            DOM.SPINNER.classList.add("hidden");
            let data = JSON.parse(response).data;
            PROFILE_FIRSTNAME.innerText = data.user.firstName || "???";
            PROFILE_LASTNAME.innerText = data.user.lastName || "???";
            PROFILE_PHOTO.setAttribute("src", "../../api/" + data.user.imagePath);
            SendData("index", "GET", null);
        },
        error: function (xhr, status, error) {
            DOM.SPINNER.classList.remove("hidden");
            if (CONSOLE_LOG) {
                console.group("Token Errors:");
                console.error("(Error) XHR Status: ", xhr.status);
                console.error("(Error) XHR Text: ", xhr.responseText);
                console.error("(Error) Status: ", status);
                console.error("Error: ", error);
                console.groupEnd();
            }
            if (xhr.status === 403)
                window.location.href = Routes.LOGIN_PAGE;
        },
    });
});
NEW_TRANSMUTATION_BUTTON.addEventListener("click", NewTransmutationInit);
LOGOUT_BUTTON.addEventListener("click", function () {
    $.ajax({
        type: "POST",
        url: Routes.SESSIONS_API,
        data: "logout=" + JSON.stringify({ token: sessionStorage.getItem("token") }),
        success: function (response) {
            CONSOLE_LOG &&
                console.log("Successful Response: ", JSON.parse(response) || response);
            sessionStorage.removeItem("token");
            window.location.href = Routes.LOGIN_PAGE;
        },
        error: function (xhr, status, error) {
            if (CONSOLE_LOG) {
                console.group("Logout Errors:");
                console.error("(Error) XHR Status: ", xhr.status);
                console.error("(Error) XHR Text: ", xhr.responseText);
                console.error("(Error) Status: ", status);
                console.error("Error: ", error);
                console.groupEnd();
            }
            sessionStorage.removeItem("token");
            if (xhr.status === 403)
                window.location.href = Routes.LOGIN_PAGE;
        },
    });
});
function NewTransmutationInit() {
    CONSOLE_LOG && console.log("New Transmutation Init");
    TRANSMUTATION_MODAL.Title.innerText = "Add a New Transmutation";
    const Displays = TRANSMUTATION_MODAL.Displays;
    const Inputs = TRANSMUTATION_MODAL.Inputs;
    Inputs.Name.value = "";
    Displays.Lowest.innerText = "0";
    Inputs.Lowest.value = "0";
    Displays.Passing.innerText = "50";
    Inputs.Passing.value = "75";
    Displays.Highest.innerText = "100";
    Inputs.Highest.value = "100";
    Inputs.Lowest.oninput = () => {
        Inputs.Lowest.max = Inputs.Passing.value;
        Displays.Passing.innerText = LinearScale(parseInt(Inputs.Lowest.value), parseInt(Inputs.Highest.value), 0, 100, parseInt(Inputs.Passing.value))
            .toFixed(2)
            .toString();
    };
    Inputs.Passing.oninput = () => {
        Inputs.Passing.min = Inputs.Lowest.value;
        Inputs.Passing.max = Inputs.Highest.value;
        Displays.Passing.innerText = LinearScale(parseInt(Inputs.Lowest.value), parseInt(Inputs.Highest.value), 0, 100, parseInt(Inputs.Passing.value))
            .toFixed(2)
            .toString();
    };
    Inputs.Highest.oninput = () => {
        Inputs.Highest.min = Inputs.Passing.value;
        Displays.Passing.innerText = LinearScale(parseInt(Inputs.Lowest.value), parseInt(Inputs.Highest.value), 0, 100, parseInt(Inputs.Passing.value))
            .toFixed(2)
            .toString();
    };
    TRANSMUTATION_MODAL.Modal.show();
}
function EditTransmutationInit(transmutation) {
    CONSOLE_LOG && console.log("Edit Transmutation Init: ", transmutation);
    TRANSMUTATION_MODAL.Modal.show();
}
function SendData(title, method, data) {
    var _a;
    let request = {
        token: (_a = sessionStorage.getItem("token")) !== null && _a !== void 0 ? _a : "",
        data: data,
    };
    $.ajax({
        url: Routes.TRANSMUTATIONS_API,
        type: method,
        data: `${title}=` + JSON.stringify(request),
        success: function (response) {
            CONSOLE_LOG &&
                console.log("Successful Request Response: ", JSON.parse(response) || response);
        },
        error: function (xhr, status, error) {
            if (CONSOLE_LOG) {
                console.group("Request Errors:");
                console.error("(Error) XHR Status: ", xhr.status);
                console.error("(Error) XHR Text: ", xhr.responseText);
                console.error("(Error) Status: ", status);
                console.error("Error: ", error);
                console.groupEnd();
            }
            let data = JSON.parse(xhr.responseText);
            ERROR_MODAL.Text.innerHTML = `
        <b>Error:</b> <br>${data.title || "Internal Server Error"}
        <br><br>
        <b>${data.message || "Internal Server Error"}</b>
      `;
            if (xhr.status === 403)
                window.location.href = Routes.LOGIN_PAGE;
        },
    });
}
