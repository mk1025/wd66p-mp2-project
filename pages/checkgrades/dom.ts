import { Modal } from "flowbite";

export const SEARCH_INPUT = document.getElementById("search") as HTMLInputElement;

// Buttons
export const SEARCH_BUTTON = document.getElementById("SearchButton") as HTMLButtonElement;

export const EXIT_BUTTON = document.getElementById("ExitButton") as HTMLButtonElement;

// Displays
export const TEACHER_PHOTO = document.getElementById("teacherPhoto") as HTMLImageElement;

export const TEACHER_FIRSTNAME = document.getElementById("teacherFirstName") as HTMLSpanElement;
export const TEACHER_LASTNAME = document.getElementById("teacherLastName") as HTMLSpanElement;

export const STUDENT_NAME = document.getElementById("StudentName") as HTMLSpanElement;

export const SECTION_NAME = document.getElementById("SectionName") as HTMLSpanElement;

export const SECTION_SY = document.getElementById("SectionSY") as HTMLSpanElement;

export const CONTENT = document.getElementById("Content") as HTMLDivElement;

export const RECORDS_LIST = document.getElementById("RecordsList") as HTMLDivElement;

// MODAL

export const ERROR_MODAL = new Modal(document.getElementById("ErrorModal") as HTMLDivElement, {
	closable: false,
	onShow: () => {
		document.getElementById("ErrorModalOkayButton")!.onclick = () => {
			ERROR_MODAL.hide();
		};
		document.getElementById("ErrorModalCloseButton")!.onclick = () => {
			ERROR_MODAL.hide();
		};
	},
});

export const ERROR_MODAL_TEXT = document.getElementById("ErrorModalText") as HTMLHeadingElement;
