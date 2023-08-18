import { DefaultModalInterface, Section, Transmutation } from "./script.d";
import { Modal } from "flowbite";

import { DateFormatter } from "../../scripts/functions";

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
export const NEW_RECORD_BUTTON = document.getElementById(
	"AddNewRecordButton",
) as HTMLButtonElement;
export const LOGOUT_BUTTON = document.getElementById(
	"LogoutButton",
) as HTMLButtonElement;

// MODALS
const RECORD_MODAL_DIV = document.getElementById(
	"RecordModal",
) as HTMLDivElement;
const RECORD_MODAL_INIT = new Modal(RECORD_MODAL_DIV, {
	closable: false,
	onShow: () => {
		document.getElementById("RecordModalCloseButton")!.onclick = () => {
			RECORD_MODAL_INIT.hide();
		};
		document.getElementById("RecordModalCancelButton")!.onclick = () => {
			RECORD_MODAL_INIT.hide();
		};
	},
});

const RECORD_MODAL_TITLE = document.getElementById(
	"RecordModalTitle",
) as HTMLHeadingElement;

const RECORD_MODAL_NAME_INPUT = document.getElementById(
	"RecordModalNameInput",
) as HTMLInputElement;
const RECORD_MODAL_COMPONENTS_SCORE = document.getElementById(
	"ComponentsTotalScore",
) as HTMLSpanElement;

export const RECORD_MODAL: DefaultModalInterface = {
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
const DELETE_MODAL_TITLE = document.getElementById(
	"DeleteModalTitle",
) as HTMLHeadingElement;
const DELETE_MODAL_TEXT = document.getElementById(
	"DeleteModalText",
) as HTMLHeadingElement;
const DELETE_MODAL_BUTTON = document.getElementById(
	"DeleteModalButton",
) as HTMLButtonElement;

export const DELETE_MODAL: DefaultModalInterface = {
	Modal: DELETE_MODAL_INIT,
	Element: DELETE_MODAL_DIV,
	Button: DELETE_MODAL_BUTTON,
	Title: DELETE_MODAL_TITLE,
	Text: DELETE_MODAL_TEXT,
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
