import { Modal } from "flowbite";

import {
	ClassRecordComponent,
	DefaultModalInterface,
	Section,
	Transmutation,
	ClassRecord,
} from "./script.d";

import { SECTION_LIST, TRANSMUTATION_LIST } from "./dom_lists";

import { DateFormatter } from "../../scripts/functions";
import { DeleteComponentInit, EditComponentInit } from "./script";

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
			COMPONENT_MODAL.Modal.hide();
			RECORD_MODAL.Modal.hide();
		};
		document.getElementById("RecordModalCancelButton")!.onclick = () => {
			COMPONENT_MODAL.Modal.hide();
			RECORD_MODAL.Modal.hide();
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
const RECORD_MODAL_BUTTON = document.getElementById(
	"RecordModalButton",
) as HTMLButtonElement;
const RECORD_MODAL_COMPONENTS_BUTTON = document.getElementById(
	"RecordModalAddComponentButton",
) as HTMLButtonElement;
let RECORD_MODAL_COMPONENTS_CONTAINER = document.getElementById(
	"ComponentsTableBody",
) as HTMLTableSectionElement;

export const RECORD_MODAL: DefaultModalInterface = {
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
			const components =
				RECORD_MODAL_COMPONENTS_CONTAINER.querySelectorAll("tr");

			let totalScore = 0;

			for (let [index, component] of components.entries()) {
				const score = Number(component.getAttribute("data-score"));
				totalScore += score;
			}

			RECORD_MODAL_COMPONENTS_SCORE.innerText = totalScore.toString();
		},
		populateComponents: function (components: ClassRecordComponent[]): void {
			let list = RECORD_MODAL_COMPONENTS_CONTAINER;

			list.innerHTML = "";

			for (let component of components) {
				this.insertComponent(component);
			}
		},
		insertComponent: function (component: ClassRecordComponent): void {
			const Row = document.createElement("tr");
			Row.id = component.id;
			Row.setAttribute("data-id", component.id);
			Row.setAttribute("data-name", component.name);
			Row.setAttribute("data-score", component.score.toString());

			Row.innerHTML = `
					<td class='p-2 font-bold text-lg text-center'>${
						RECORD_MODAL.Displays!.list.children.length + 1
					}</td>
					<td class='p-2'>${component.name}</td>
					<td class='p-2 font-semibold text-right'>${component.score}%</td>
				`;

			const RowActions = document.createElement("td");
			RowActions.classList.add(
				"p-2",
				"flex",
				"flex-row",
				"gap-2",
				"justify-end",
				"text-white",
			);

			const SettingsButton = document.createElement("button");
			SettingsButton.classList.add(
				"py-2",
				"px-3",
				"bg-blue-400",
				"hover:bg-blue-500",
				"rounded",
			);
			SettingsButton.innerHTML = `<i class='fa-solid fa-gear'></i>`;
			SettingsButton.onclick = () => {
				EditComponentInit({
					id: component.id,
					name: component.name,
					score: component.score,
				});
			};

			const DeleteButton = document.createElement("button");
			DeleteButton.classList.add(
				"py-2",
				"px-3",
				"bg-red-400",
				"hover:bg-red-500",
				"rounded",
			);
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

			RECORD_MODAL.Displays!.list.appendChild(Row);

			this.computeTotalScore();
		},
		updateComponent: function (component: ClassRecordComponent): void {
			let list = RECORD_MODAL.Displays!.list.children;

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
		deleteComponent: function (component: ClassRecordComponent): void {
			RECORD_MODAL_COMPONENTS_CONTAINER.querySelector(
				`#${component.id}`,
			)!.remove();

			let list = RECORD_MODAL.Displays!.list;

			for (let [index, row] of Array.from(list.children).entries()) {
				row.querySelectorAll("td")[0].innerText = (index + 1).toString();
			}

			this.computeTotalScore();
		},
		getComponents: function (): ClassRecordComponent[] {
			let list = RECORD_MODAL.Displays!.list.children;

			let components: ClassRecordComponent[] = [];

			for (let row of list) {
				components.push({
					id: row.getAttribute("data-id")!,
					name: row.getAttribute("data-name")!,
					score: Number(row.getAttribute("data-score")!),
					order_no: Number(row.querySelectorAll("td")[0].innerText),
				});
			}

			return components;
		},
	},
};

const COMPONENT_MODAL_DIV = document.getElementById(
	"ComponentModal",
) as HTMLDivElement;
const COMPONENT_MODAL_TITLE = document.getElementById(
	"ComponentModalTitle",
) as HTMLHeadingElement;
const COMPONENT_MODAL_NAME_INPUT = document.getElementById(
	"ComponentNameInput",
) as HTMLInputElement;
const COMPONENT_MODAL_SCORE_INPUT = document.getElementById(
	"ComponentScoreInput",
) as HTMLInputElement;
const COMPONENT_MODAL_BUTTON = document.getElementById(
	"ComponentModalButton",
) as HTMLButtonElement;
const COMPONENT_MODAL_INIT = new Modal(COMPONENT_MODAL_DIV, {
	closable: false,
	onShow: () => {
		document.getElementById("ComponentModalCloseButton")!.onclick = () => {
			COMPONENT_MODAL_INIT.hide();
		};
		document.getElementById("ComponentModalCancelButton")!.onclick = () => {
			COMPONENT_MODAL_INIT.hide();
		};
		RECORD_MODAL.Modal.hide();
	},
	onHide: () => {
		RECORD_MODAL.Modal.show();
	},
});

export const COMPONENT_MODAL: DefaultModalInterface = {
	Modal: COMPONENT_MODAL_INIT,
	Element: COMPONENT_MODAL_DIV,
	Title: COMPONENT_MODAL_TITLE,
	Button: COMPONENT_MODAL_BUTTON,
	Inputs: {
		name: COMPONENT_MODAL_NAME_INPUT,
		score: COMPONENT_MODAL_SCORE_INPUT,
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
