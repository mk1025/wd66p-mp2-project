import { DefaultModalInterface } from "./script.d";
import { Modal } from "flowbite";

// PROFILE
export const PROFILE_FIRSTNAME = document.getElementById(
  "Profile_FirstName",
) as HTMLSpanElement;
export const PROFILE_LASTNAME = document.getElementById(
  "Profile_LastName",
) as HTMLSpanElement;
export const PROFILE_PHOTO = document.getElementById(
  "Profile_Photo",
) as HTMLImageElement;

// BUTTONS
export const NEW_TRANSMUTATION_BUTTON = document.getElementById(
  "AddNewTransmutationButton",
) as HTMLButtonElement;
export const LOGOUT_BUTTON = document.getElementById(
  "LogoutButton",
) as HTMLButtonElement;

// OTHER ELEMENTS
export const TRANSMUTATION_LIST = document.getElementById(
  "TransmutationList",
) as HTMLElement;

// MODALS
const TRANSMUTATION_MODAL_DIV = document.getElementById(
  "TransmutationModal",
) as HTMLDivElement;
const TRANSMUTATION_MODAL_INIT = new Modal(TRANSMUTATION_MODAL_DIV, {
  closable: false,
  onShow: () => {
    document.getElementById("TransmutationModalCloseButton")!.onclick = () => {
      TRANSMUTATION_MODAL_INIT.hide();
    };
    document.getElementById("TransmutationModalCancelButton")!.onclick = () => {
      TRANSMUTATION_MODAL_INIT.hide();
    };
  },
});
const TRANSMUTATION_MODAL_TITLE = document.getElementById(
  "TransmutationModalTitle",
) as HTMLHeadingElement;
const TRANSMUTATION_MODAL_BUTTON = document.getElementById(
  "TransmutationModalButton",
) as HTMLButtonElement;

const TRANSMUTATION_MODAL_NAME_INPUT = document.getElementById(
  "TransmutationModalNameInput",
) as HTMLInputElement;
const TRANSMUTATION_MODAL_LOWEST = document.getElementById(
  "TM_Lowest",
) as HTMLTableCellElement;
const TRANSMUTATION_MODAL_LOWEST_INPUT = document.getElementById(
  "TM_LowestInput",
) as HTMLInputElement;
const TRANSMUTATION_MODAL_PASSING = document.getElementById(
  "TM_Passing",
) as HTMLTableCellElement;
const TRANSMUTATION_MODAL_PASSING_INPUT = document.getElementById(
  "TM_PassingInput",
) as HTMLInputElement;
const TRANSMUTATION_MODAL_HIGHEST = document.getElementById(
  "TM_Highest",
) as HTMLTableCellElement;
const TRANSMUTATION_MODAL_HIGHEST_INPUT = document.getElementById(
  "TM_HighestInput",
) as HTMLInputElement;

export const TRANSMUTATION_MODAL: DefaultModalInterface = {
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

const DELETE_MODAL_DIV = document.getElementById(
  "DeleteModal",
) as HTMLDivElement;
const DELETE_MODAL_INIT = new Modal(DELETE_MODAL_DIV, {
  closable: false,
  onShow: () => {
    document.getElementById("DeleteModalCloseButton")!.onclick = () => {
      DELETE_MODAL_INIT.hide();
    };
    document.getElementById("DeleteModalCancelButton")!.onclick = () => {
      DELETE_MODAL_INIT.hide();
    };
  },
});
const DELETE_MODAL_TEXT = document.getElementById(
  "DeleteModalText",
) as HTMLHeadingElement;
const DELETE_MODAL_BUTTON = document.getElementById(
  "DeleteModalButton",
) as HTMLButtonElement;

export const DELETE_MODAL: DefaultModalInterface = {
  Modal: DELETE_MODAL_INIT,
  Element: DELETE_MODAL_DIV,
  Text: DELETE_MODAL_TEXT,
  Button: DELETE_MODAL_BUTTON,
};

const ERROR_MODAL_DIV = document.getElementById("ErrorModal") as HTMLDivElement;
const ERROR_MODAL_INIT = new Modal(ERROR_MODAL_DIV, {
  closable: false,
  onShow: () => {
    document.getElementById("ErrorModalCloseButton")!.onclick = () => {
      ERROR_MODAL_INIT.hide();
    };
    document.getElementById("ErrorModalOkayButton")!.onclick = () => {
      ERROR_MODAL_INIT.hide();
    };
  },
});
const ERROR_MODAL_TEXT = document.getElementById(
  "ErrorModalText",
) as HTMLHeadingElement;

export const ERROR_MODAL: DefaultModalInterface = {
  Modal: ERROR_MODAL_INIT,
  Element: ERROR_MODAL_DIV,
  Text: ERROR_MODAL_TEXT,
};
