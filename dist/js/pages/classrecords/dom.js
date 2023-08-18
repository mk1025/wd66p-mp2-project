import { Modal } from "flowbite";
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
            RECORD_MODAL_INIT.hide();
        };
        document.getElementById("RecordModalCancelButton").onclick = () => {
            RECORD_MODAL_INIT.hide();
        };
    },
});
const RECORD_MODAL_TITLE = document.getElementById("RecordModalTitle");
const RECORD_MODAL_NAME_INPUT = document.getElementById("RecordModalNameInput");
const RECORD_MODAL_COMPONENTS_SCORE = document.getElementById("ComponentsTotalScore");
export const RECORD_MODAL = {
    Modal: RECORD_MODAL_INIT,
    Element: RECORD_MODAL_DIV,
    Title: RECORD_MODAL_TITLE,
    Inputs: {
        name: RECORD_MODAL_NAME_INPUT,
    },
    Displays: {
        totalscore: RECORD_MODAL_COMPONENTS_SCORE,
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
