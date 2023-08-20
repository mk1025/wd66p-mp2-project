import { Modal } from "flowbite";
import { DeleteComponentInit, EditComponentInit } from "./script";
export const PROFILE_FIRSTNAME = document.getElementById("Profile_FirstName");
export const PROFILE_LASTNAME = document.getElementById("Profile_LastName");
export const PROFILE_PHOTO = document.getElementById("Profile_Photo");
export const NEW_RECORD_BUTTON = document.getElementById("AddNewRecordButton");
export const LOGOUT_BUTTON = document.getElementById("LogoutButton");
const RECORD_MODAL_DIV = document.getElementById("RecordModal");
const RECORD_MODAL_INIT = new Modal(RECORD_MODAL_DIV, {
    closable: false,
    onShow: () => {
        document.getElementById("RecordModalCloseButton").onclick = () => {
            COMPONENT_MODAL.Modal.hide();
            RECORD_MODAL.Modal.hide();
        };
        document.getElementById("RecordModalCancelButton").onclick = () => {
            COMPONENT_MODAL.Modal.hide();
            RECORD_MODAL.Modal.hide();
        };
    },
});
const RECORD_MODAL_TITLE = document.getElementById("RecordModalTitle");
const RECORD_MODAL_NAME_INPUT = document.getElementById("RecordModalNameInput");
const RECORD_MODAL_COMPONENTS_SCORE = document.getElementById("ComponentsTotalScore");
const RECORD_MODAL_BUTTON = document.getElementById("RecordModalButton");
const RECORD_MODAL_COMPONENTS_BUTTON = document.getElementById("RecordModalAddComponentButton");
let RECORD_MODAL_COMPONENTS_CONTAINER = document.getElementById("ComponentsTableBody");
export const RECORD_MODAL = {
    Modal: RECORD_MODAL_INIT,
    Element: RECORD_MODAL_DIV,
    Title: RECORD_MODAL_TITLE,
    Button: RECORD_MODAL_BUTTON,
    Buttons: {
        addComponent: RECORD_MODAL_COMPONENTS_BUTTON,
    },
    Inputs: {
        name: RECORD_MODAL_NAME_INPUT,
    },
    Displays: {
        list: RECORD_MODAL_COMPONENTS_CONTAINER,
        totalscore: RECORD_MODAL_COMPONENTS_SCORE,
    },
    Methods: {
        computeTotalScore: () => {
            const components = RECORD_MODAL_COMPONENTS_CONTAINER.querySelectorAll("tr");
            let totalScore = 0;
            for (let [index, component] of components.entries()) {
                const score = Number(component.getAttribute("data-score"));
                totalScore += score;
            }
            RECORD_MODAL_COMPONENTS_SCORE.innerText = totalScore.toString();
        },
        populateComponents: function (components) {
            let list = RECORD_MODAL_COMPONENTS_CONTAINER;
            list.innerHTML = "";
            for (let component of components) {
                this.insertComponent(component);
            }
        },
        insertComponent: function (component) {
            const Row = document.createElement("tr");
            Row.id = component.id;
            Row.setAttribute("data-id", component.id);
            Row.setAttribute("data-name", component.name);
            Row.setAttribute("data-score", component.score.toString());
            Row.innerHTML = `
					<td class='p-2 font-bold text-lg text-center'>${RECORD_MODAL.Displays.list.children.length + 1}</td>
					<td class='p-2'>${component.name}</td>
					<td class='p-2 font-semibold text-right'>${component.score}%</td>
				`;
            const RowActions = document.createElement("td");
            RowActions.classList.add("p-2", "flex", "flex-row", "gap-2", "justify-end", "text-white");
            const SettingsButton = document.createElement("button");
            SettingsButton.classList.add("py-2", "px-3", "bg-blue-400", "hover:bg-blue-500", "rounded");
            SettingsButton.innerHTML = `<i class='fa-solid fa-gear'></i>`;
            SettingsButton.onclick = () => {
                EditComponentInit({
                    id: component.id,
                    name: component.name,
                    score: component.score,
                });
            };
            const DeleteButton = document.createElement("button");
            DeleteButton.classList.add("py-2", "px-3", "bg-red-400", "hover:bg-red-500", "rounded");
            DeleteButton.innerHTML = `<i class='fa-solid fa-trash-can'></i>`;
            DeleteButton.onclick = () => {
                DeleteComponentInit({
                    id: component.id,
                    name: component.name,
                    score: component.score,
                });
            };
            RowActions.appendChild(SettingsButton);
            RowActions.appendChild(DeleteButton);
            Row.appendChild(RowActions);
            RECORD_MODAL.Displays.list.appendChild(Row);
            this.computeTotalScore();
        },
        updateComponent: function (component) {
            let list = RECORD_MODAL.Displays.list.children;
            for (let row of list) {
                if (row.id == component.id) {
                    row.id = component.id;
                    row.setAttribute("data-id", component.id);
                    row.setAttribute("data-name", component.name);
                    row.setAttribute("data-score", component.score.toString());
                    row.querySelectorAll("td")[1].innerText = component.name;
                    row.querySelectorAll("td")[2].innerText =
                        component.score.toString() + "%";
                    break;
                }
            }
            this.computeTotalScore();
        },
        deleteComponent: function (component) {
            RECORD_MODAL_COMPONENTS_CONTAINER.querySelector(`#${component.id}`).remove();
            let list = RECORD_MODAL.Displays.list;
            for (let [index, row] of Array.from(list.children).entries()) {
                row.querySelectorAll("td")[0].innerText = (index + 1).toString();
            }
            this.computeTotalScore();
        },
        getComponents: function () {
            let list = RECORD_MODAL.Displays.list.children;
            let components = [];
            for (let row of list) {
                components.push({
                    id: row.getAttribute("data-id"),
                    name: row.getAttribute("data-name"),
                    score: Number(row.getAttribute("data-score")),
                    order_no: Number(row.querySelectorAll("td")[0].innerText),
                });
            }
            return components;
        },
    },
};
const COMPONENT_MODAL_DIV = document.getElementById("ComponentModal");
const COMPONENT_MODAL_TITLE = document.getElementById("ComponentModalTitle");
const COMPONENT_MODAL_NAME_INPUT = document.getElementById("ComponentNameInput");
const COMPONENT_MODAL_SCORE_INPUT = document.getElementById("ComponentScoreInput");
const COMPONENT_MODAL_BUTTON = document.getElementById("ComponentModalButton");
const COMPONENT_MODAL_INIT = new Modal(COMPONENT_MODAL_DIV, {
    closable: false,
    onShow: () => {
        document.getElementById("ComponentModalCloseButton").onclick = () => {
            COMPONENT_MODAL_INIT.hide();
        };
        document.getElementById("ComponentModalCancelButton").onclick = () => {
            COMPONENT_MODAL_INIT.hide();
        };
        RECORD_MODAL.Modal.hide();
    },
    onHide: () => {
        RECORD_MODAL.Modal.show();
    },
});
export const COMPONENT_MODAL = {
    Modal: COMPONENT_MODAL_INIT,
    Element: COMPONENT_MODAL_DIV,
    Title: COMPONENT_MODAL_TITLE,
    Button: COMPONENT_MODAL_BUTTON,
    Inputs: {
        name: COMPONENT_MODAL_NAME_INPUT,
        score: COMPONENT_MODAL_SCORE_INPUT,
    },
};
const DELETE_MODAL_DIV = document.getElementById("DeleteModal");
const DELETE_MODAL_INIT = new Modal(DELETE_MODAL_DIV, {
    closable: false,
    onShow: () => {
        document.getElementById("DeleteModalCloseButton").onclick = () => {
            DELETE_MODAL_INIT.hide();
        };
        document.getElementById("DeleteModalCancelButton").onclick = () => {
            DELETE_MODAL_INIT.hide();
        };
    },
});
const DELETE_MODAL_TITLE = document.getElementById("DeleteModalTitle");
const DELETE_MODAL_TEXT = document.getElementById("DeleteModalText");
const DELETE_MODAL_BUTTON = document.getElementById("DeleteModalButton");
export const DELETE_MODAL = {
    Modal: DELETE_MODAL_INIT,
    Element: DELETE_MODAL_DIV,
    Button: DELETE_MODAL_BUTTON,
    Title: DELETE_MODAL_TITLE,
    Text: DELETE_MODAL_TEXT,
};
const ERROR_MODAL_DIV = document.getElementById("ErrorModal");
const ERROR_MODAL_INIT = new Modal(ERROR_MODAL_DIV, {
    closable: false,
    onShow: () => {
        document.getElementById("ErrorModalCloseButton").onclick = () => {
            ERROR_MODAL_INIT.hide();
        };
        document.getElementById("ErrorModalOkayButton").onclick = () => {
            ERROR_MODAL_INIT.hide();
        };
    },
});
const ERROR_MODAL_TEXT = document.getElementById("ErrorModalText");
export const ERROR_MODAL = {
    Modal: ERROR_MODAL_INIT,
    Element: ERROR_MODAL_DIV,
    Text: ERROR_MODAL_TEXT,
};
