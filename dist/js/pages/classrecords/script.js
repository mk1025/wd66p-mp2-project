import * as ROUTES from "../../scripts/routes";
import * as DOM from "../../scripts/dom";
import { CONSOLE_LOG } from "../../scripts/env";
import { PROFILE_FIRSTNAME, PROFILE_LASTNAME, PROFILE_PHOTO, NEW_RECORD_BUTTON, LOGOUT_BUTTON, RECORD_MODAL, DELETE_MODAL, ERROR_MODAL, } from "./dom";
import { RECORDS_LIST, SECTION_LIST, TRANSMUTATION_LIST, } from "./dom_lists";
document.addEventListener("DOMContentLoaded", function () {
    var _a;
    $.ajax({
        type: "POST",
        url: ROUTES.SESSIONS_API,
        data: "session=" +
            JSON.stringify({ token: (_a = sessionStorage.getItem("token")) !== null && _a !== void 0 ? _a : "" }),
        success: function (response) {
            CONSOLE_LOG &&
                console.log("Successful Response: ", JSON.parse(response) || response);
            DOM.SPINNER.classList.add("hidden");
            let data = JSON.parse(response).data;
            PROFILE_FIRSTNAME.innerText = data.user.firstName || "???";
            PROFILE_LASTNAME.innerText = data.user.lastName || "???";
            PROFILE_PHOTO.setAttribute("src", "../../api/" + data.user.imagePath);
            getSections();
            getTransmutations();
            getRecords();
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
                window.location.href = ROUTES.LOGIN_PAGE;
        },
    });
});
function NewRecordInit() {
    CONSOLE_LOG && console.log("New Record Init");
    RECORD_MODAL.Modal.show();
}
export function EditRecordInit(record) {
    CONSOLE_LOG && console.log("Edit Record Init: ", record);
    RECORD_MODAL.Modal.show();
}
export function DeleteRecordInit(record) {
    CONSOLE_LOG && console.log("Delete Record Init: ", record);
    DELETE_MODAL.Modal.show();
}
function SendRequest(title, method, data) {
    var _a;
    let request = {
        token: (_a = sessionStorage.getItem("token")) !== null && _a !== void 0 ? _a : "",
        data: data,
    };
    $.ajax({
        type: method,
        url: ROUTES.CLASSRECORDS_API,
        data: `${title}=` + JSON.stringify(request),
        success: function (response) {
            var _a;
            CONSOLE_LOG &&
                console.log(`Successful (${title}) response: `, (_a = JSON.parse(response)) !== null && _a !== void 0 ? _a : response);
            getSections();
            getTransmutations();
            getRecords();
        },
        error: function (xhr, status, error) {
            if (CONSOLE_LOG) {
                console.group(`Request (${title}) Errors:`);
                console.error("(Error) XHR Status: ", xhr.status);
                console.error("(Error) XHR Text: ", xhr.responseText);
                console.error("(Error) Status: ", status);
                console.error("Error: ", error);
                console.groupEnd();
            }
            let data = JSON.parse(xhr.responseText);
            ERROR_MODAL.Text.innerHTML = `
        <b>Error:</b> ${data.title}
        <br><br>
        ${data.message}  
      `;
            ERROR_MODAL.Modal.show();
            if (xhr.status === 403)
                window.location.href = ROUTES.LOGIN_PAGE;
        },
    });
}
function getSections() {
    $.ajax({
        type: "GET",
        url: ROUTES.CLASSRECORDS_API,
        data: "sections=" + JSON.stringify({ token: sessionStorage.getItem("token") }),
        success: function (response) {
            CONSOLE_LOG &&
                console.log("Successful GET SECTIONS Response: ", JSON.parse(response) || response);
            let data = JSON.parse(response).data;
            SECTION_LIST.Populate(data);
        },
        error: function (xhr, status, error) {
            if (CONSOLE_LOG) {
                console.group("GET SECTIONS Errors:");
                console.error("(Error) XHR Status: ", xhr.status);
                console.error("(Error) XHR Text: ", xhr.responseText);
                console.error("(Error) Status: ", status);
                console.error("Error: ", error);
                console.groupEnd();
            }
            if (xhr.status === 403)
                window.location.href = ROUTES.LOGIN_PAGE;
        },
    });
}
function getTransmutations() {
    $.ajax({
        type: "GET",
        url: ROUTES.CLASSRECORDS_API,
        data: "transmutations=" +
            JSON.stringify({ token: sessionStorage.getItem("token") }),
        success: function (response) {
            CONSOLE_LOG &&
                console.log("Successful GET TRANSMUTATIONS Response: ", JSON.parse(response) || response);
            let data = JSON.parse(response).data;
            TRANSMUTATION_LIST.Populate(data);
        },
        error: function (xhr, status, error) {
            if (CONSOLE_LOG) {
                console.group("GET TRANSMUTATIONS Errors:");
                console.error("(Error) XHR Status: ", xhr.status);
                console.error("(Error) XHR Text: ", xhr.responseText);
                console.error("(Error) Status: ", status);
                console.error("Error: ", error);
                console.groupEnd();
            }
            if (xhr.status === 403)
                window.location.href = ROUTES.LOGIN_PAGE;
        },
    });
}
function getRecords() {
    $.ajax({
        type: "GET",
        url: ROUTES.CLASSRECORDS_API,
        data: "index=" + JSON.stringify({ token: sessionStorage.getItem("token") }),
        success: function (response) {
            CONSOLE_LOG &&
                console.log("Successful GET RECORDS Response: ", JSON.parse(response) || response);
            let data = JSON.parse(response).data;
            RECORDS_LIST.Populate(data);
        },
        error: function (xhr, status, error) {
            if (CONSOLE_LOG) {
                console.group("GET RECORDS Errors:");
                console.error("(Error) XHR Status: ", xhr.status);
                console.error("(Error) XHR Text: ", xhr.responseText);
                console.error("(Error) Status: ", status);
                console.error("Error: ", error);
                console.groupEnd();
            }
            if (xhr.status === 403)
                window.location.href = ROUTES.LOGIN_PAGE;
        },
    });
}
NEW_RECORD_BUTTON.addEventListener("click", NewRecordInit);
LOGOUT_BUTTON.addEventListener("click", function () {
    $.ajax({
        type: "POST",
        url: ROUTES.SESSIONS_API,
        data: "logout=" + JSON.stringify({ token: sessionStorage.getItem("token") }),
        success: function (response) {
            CONSOLE_LOG &&
                console.log("Successful Response: ", JSON.parse(response) || response);
            sessionStorage.removeItem("token");
            window.location.href = ROUTES.LOGIN_PAGE;
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
                window.location.href = ROUTES.LOGIN_PAGE;
        },
    });
});
