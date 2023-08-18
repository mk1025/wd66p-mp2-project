import { Modal } from "flowbite";
export const PROFILE_FIRSTNAME = document.getElementById("Profile_FirstName");
export const PROFILE_LASTNAME = document.getElementById("Profile_LastName");
export const PROFILE_PHOTO = document.getElementById("Profile_Photo");
export const NEW_TRANSMUTATION_BUTTON = document.getElementById("AddNewTransmutationButton");
export const LOGOUT_BUTTON = document.getElementById("LogoutButton");
const TRANSMUTATION_MODAL_DIV = document.getElementById("TransmutationModal");
const TRANSMUTATION_MODAL_INIT = new Modal(TRANSMUTATION_MODAL_DIV, {
    closable: false,
    onShow: () => {
        document.getElementById("TransmutationModalCloseButton").onclick = () => {
            TRANSMUTATION_MODAL_INIT.hide();
        };
        document.getElementById("TransmutationModalCancelButton").onclick = () => {
            TRANSMUTATION_MODAL_INIT.hide();
        };
    },
});
const TRANSMUTATION_MODAL_TITLE = document.getElementById("TransmutationModalTitle");
const TRANSMUTATION_MODAL_BUTTON = document.getElementById("TransmutationModalButton");
const TRANSMUTATION_MODAL_NAME_INPUT = document.getElementById("TransmutationModalNameInput");
const TRANSMUTATION_MODAL_LOWEST = document.getElementById("TM_Lowest");
const TRANSMUTATION_MODAL_LOWEST_INPUT = document.getElementById("TM_LowestInput");
const TRANSMUTATION_MODAL_PASSING = document.getElementById("TM_Passing");
const TRANSMUTATION_MODAL_PASSING_INPUT = document.getElementById("TM_PassingInput");
const TRANSMUTATION_MODAL_HIGHEST = document.getElementById("TM_Highest");
const TRANSMUTATION_MODAL_HIGHEST_INPUT = document.getElementById("TM_HighestInput");
export const TRANSMUTATION_MODAL = {
    Modal: TRANSMUTATION_MODAL_INIT,
    Element: TRANSMUTATION_MODAL_DIV,
    Title: TRANSMUTATION_MODAL_TITLE,
    Button: TRANSMUTATION_MODAL_BUTTON,
    Inputs: {
        Name: TRANSMUTATION_MODAL_NAME_INPUT,
        Lowest: TRANSMUTATION_MODAL_LOWEST_INPUT,
        Passing: TRANSMUTATION_MODAL_PASSING_INPUT,
        Highest: TRANSMUTATION_MODAL_HIGHEST_INPUT,
    },
    Displays: {
        Lowest: TRANSMUTATION_MODAL_LOWEST,
        Passing: TRANSMUTATION_MODAL_PASSING,
        Highest: TRANSMUTATION_MODAL_HIGHEST,
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
const DELETE_MODAL_TEXT = document.getElementById("DeleteModalText");
const DELETE_MODAL_BUTTON = document.getElementById("DeleteModalButton");
export const DELETE_MODAL = {
    Modal: DELETE_MODAL_INIT,
    Element: DELETE_MODAL_DIV,
    Text: DELETE_MODAL_TEXT,
    Button: DELETE_MODAL_BUTTON,
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
