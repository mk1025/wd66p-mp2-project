import { Modal } from "flowbite";
export const SEARCH_INPUT = document.getElementById("search");
export const SEARCH_BUTTON = document.getElementById("SearchButton");
export const EXIT_BUTTON = document.getElementById("ExitButton");
export const TEACHER_PHOTO = document.getElementById("teacherPhoto");
export const TEACHER_FIRSTNAME = document.getElementById("teacherFirstName");
export const TEACHER_LASTNAME = document.getElementById("teacherLastName");
export const STUDENT_NAME = document.getElementById("StudentName");
export const SECTION_NAME = document.getElementById("SectionName");
export const SECTION_SY = document.getElementById("SectionSY");
export const CONTENT = document.getElementById("Content");
export const RECORDS_LIST = document.getElementById("RecordsList");
export const ERROR_MODAL = new Modal(document.getElementById("ErrorModal"), {
    closable: false,
    onShow: () => {
        document.getElementById("ErrorModalOkayButton").onclick = () => {
            ERROR_MODAL.hide();
        };
        document.getElementById("ErrorModalCloseButton").onclick = () => {
            ERROR_MODAL.hide();
        };
    },
});
export const ERROR_MODAL_TEXT = document.getElementById("ErrorModalText");
