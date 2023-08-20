import * as ROUTES from "../../scripts/routes";
import * as DOM from "../../scripts/dom";
import { CONSOLE_LOG } from "../../scripts/env";
import { generateElementRandomId } from "../../scripts/functions";
import { PROFILE_FIRSTNAME, PROFILE_LASTNAME, PROFILE_PHOTO, NEW_RECORD_BUTTON, LOGOUT_BUTTON, RECORD_MODAL, DELETE_MODAL, ERROR_MODAL, COMPONENT_MODAL, } from "./dom";
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    CONSOLE_LOG && console.log("New Record Init");
    RECORD_MODAL.Title.innerText = "New Class Record";
    RECORD_MODAL.Inputs.name.value = "";
    let sectionResult = {
        id: "",
        name: "",
        color: "",
        syStart: "",
        syEnd: "",
    };
    for (let [index, section] of SECTION_LIST.Element.entries()) {
        if (index === 0) {
            sectionResult = {
                id: section.value,
                name: (_b = (_a = section.getAttribute("data-name")) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
                color: (_d = (_c = section.getAttribute("data-color")) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "",
                syStart: (_f = (_e = section.getAttribute("data-syStart")) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : "",
                syEnd: (_h = (_g = section.getAttribute("data-syEnd")) === null || _g === void 0 ? void 0 : _g.toString()) !== null && _h !== void 0 ? _h : "",
            };
            break;
        }
    }
    SECTION_LIST.SetValue(sectionResult);
    let transmutationResult = {
        id: "",
        name: "",
        lowest: 0,
        highest: 0,
        passing: 0,
    };
    for (let [index, transmutation] of TRANSMUTATION_LIST.Element.entries()) {
        if (index === 0) {
            transmutationResult = {
                id: transmutation.value,
                name: (_k = (_j = transmutation.getAttribute("data-name")) === null || _j === void 0 ? void 0 : _j.toString()) !== null && _k !== void 0 ? _k : "",
                lowest: parseInt(transmutation.getAttribute("data-lowest")),
                passing: parseInt(transmutation.getAttribute("data-passing")),
                highest: parseInt(transmutation.getAttribute("data-highest")),
            };
            break;
        }
    }
    TRANSMUTATION_LIST.SetValue(transmutationResult);
    RECORD_MODAL.Displays.list.innerHTML = "";
    RECORD_MODAL.Displays.totalscore.innerText = "";
    RECORD_MODAL.Buttons.addComponent.onclick = () => {
        NewComponentInit();
    };
    RECORD_MODAL.Button.onclick = () => {
        RECORD_MODAL.Modal.hide();
        SendRequest("store", "POST", {
            id: "",
            name: RECORD_MODAL.Inputs.name.value,
            section: SECTION_LIST.GetValue(),
            transmutation: TRANSMUTATION_LIST.GetValue(),
            components: RECORD_MODAL.Methods.getComponents(),
        });
    };
    RECORD_MODAL.Modal.show();
}
export function EditRecordInit(record) {
    CONSOLE_LOG && console.log("Edit Record Init: ", record);
    RECORD_MODAL.Title.innerText = "Edit Record";
    RECORD_MODAL.Inputs.name.value = record.name;
    SECTION_LIST.SetValue(record.section);
    TRANSMUTATION_LIST.SetValue(record.transmutation);
    RECORD_MODAL.Methods.populateComponents(record.components);
    RECORD_MODAL.Buttons.addComponent.onclick = () => {
        NewComponentInit();
    };
    RECORD_MODAL.Button.onclick = () => {
        RECORD_MODAL.Modal.hide();
        SendRequest("update", "POST", {
            id: record.id,
            name: RECORD_MODAL.Inputs.name.value,
            section: SECTION_LIST.GetValue(),
            transmutation: TRANSMUTATION_LIST.GetValue(),
            components: RECORD_MODAL.Methods.getComponents(),
        });
    };
    RECORD_MODAL.Modal.show();
}
export function DeleteRecordInit(record) {
    CONSOLE_LOG && console.log("Delete Record Init: ", record);
    DELETE_MODAL.Text.innerHTML = `
    Are you sure you want to delete '${record.name}' Class Record?
  `;
    DELETE_MODAL.Button.onclick = () => {
        DELETE_MODAL.Modal.hide();
        SendRequest("destroy", "POST", record);
    };
    DELETE_MODAL.Modal.show();
}
function NewComponentInit() {
    CONSOLE_LOG && console.log("New Record Component Init");
    COMPONENT_MODAL.Title.innerText = "Add New Component";
    COMPONENT_MODAL.Inputs.name.value = "";
    COMPONENT_MODAL.Inputs.score.value = "0";
    COMPONENT_MODAL.Button.onclick = () => {
        COMPONENT_MODAL.Modal.hide();
        RECORD_MODAL.Methods.insertComponent({
            id: generateElementRandomId(),
            name: COMPONENT_MODAL.Inputs.name.value,
            score: Number(COMPONENT_MODAL.Inputs.score.value),
        });
    };
    COMPONENT_MODAL.Modal.show();
}
export function EditComponentInit(component) {
    CONSOLE_LOG && console.log("Edit Record Component Init: ", component);
    COMPONENT_MODAL.Title.innerText = "Edit Component";
    COMPONENT_MODAL.Inputs.name.value = component.name;
    COMPONENT_MODAL.Inputs.score.value = component.score.toString();
    COMPONENT_MODAL.Button.onclick = () => {
        COMPONENT_MODAL.Modal.hide();
        RECORD_MODAL.Methods.updateComponent({
            id: component.id,
            name: COMPONENT_MODAL.Inputs.name.value,
            score: Number(COMPONENT_MODAL.Inputs.score.value),
        });
    };
    COMPONENT_MODAL.Modal.show();
}
export function DeleteComponentInit(component) {
    CONSOLE_LOG && console.log("Delete Record Component Init: ", component);
    DELETE_MODAL.Text.innerHTML = `
    Are you sure you want to delete '${component.name}' Component?
  `;
    DELETE_MODAL.Button.onclick = () => {
        var _a;
        DELETE_MODAL.Modal.hide();
        (_a = RECORD_MODAL.Methods) === null || _a === void 0 ? void 0 : _a.deleteComponent(component);
    };
    DELETE_MODAL.Modal.show();
}
function SendRequest(title, method, data) {
    var _a;
    DOM.SPINNER_ACTION.classList.remove("hidden");
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
            DOM.SPINNER_ACTION.classList.add("hidden");
            RECORD_MODAL.Modal.hide();
            CONSOLE_LOG &&
                console.log(`Successful (${title}) response: `, (_a = JSON.parse(response)) !== null && _a !== void 0 ? _a : response);
            getSections();
            getTransmutations();
            getRecords();
        },
        error: function (xhr, status, error) {
            DOM.SPINNER_ACTION.classList.add("hidden");
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
