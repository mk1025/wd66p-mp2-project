import * as ROUTES from "../../scripts/routes";

import * as DOM from "../../scripts/dom";

import { CONSOLE_LOG } from "../../scripts/env";

import { generateElementRandomId } from "../../scripts/functions";

import {
	PROFILE_FIRSTNAME,
	PROFILE_LASTNAME,
	PROFILE_PHOTO,
	// BUTTONS
	NEW_RECORD_BUTTON,
	LOGOUT_BUTTON,

	// MODALS
	RECORD_MODAL,
	DELETE_MODAL,
	ERROR_MODAL,
	COMPONENT_MODAL,
} from "./dom";

import {
	RECORDS_LIST,
	// LIST
	SECTION_LIST,
	TRANSMUTATION_LIST,
} from "./dom_lists";

import {
	DOMLoadResponseData,
	RequestResponse,
	AJAXMethods,
	Section,
	Transmutation,
	ClassRecord,
	ClassRecordComponent,
} from "./script.d";

// DOM LOAD
document.addEventListener("DOMContentLoaded", function () {
	$.ajax({
		type: "POST",
		url: ROUTES.SESSIONS_API,
		data:
			"session=" +
			JSON.stringify({ token: sessionStorage.getItem("token") ?? "" }),

		success: function (response) {
			CONSOLE_LOG &&
				console.log("Successful Response: ", JSON.parse(response) || response);
			DOM.SPINNER.classList.add("hidden");

			let data: DOMLoadResponseData = JSON.parse(response).data;
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
			if (xhr.status === 403) window.location.href = ROUTES.LOGIN_PAGE;
		},
	});
});

// INITS
function NewRecordInit() {
	CONSOLE_LOG && console.log("New Record Init");

	RECORD_MODAL.Title!.innerText = "New Class Record";

	RECORD_MODAL.Inputs!.name.value = "";

	let sectionResult: Section = {
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
				name: section.getAttribute("data-name")?.toString() ?? "",
				color: section.getAttribute("data-color")?.toString() ?? "",
				syStart: section.getAttribute("data-syStart")?.toString() ?? "",
				syEnd: section.getAttribute("data-syEnd")?.toString() ?? "",
			};
			break;
		}
	}

	SECTION_LIST.SetValue(sectionResult);

	let transmutationResult: Transmutation = {
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
				name: transmutation.getAttribute("data-name")?.toString() ?? "",
				lowest: parseInt(transmutation.getAttribute("data-lowest") as string),
				passing: parseInt(transmutation.getAttribute("data-passing") as string),
				highest: parseInt(transmutation.getAttribute("data-highest") as string),
			};
			break;
		}
	}

	TRANSMUTATION_LIST.SetValue(transmutationResult);

	RECORD_MODAL.Displays!.list.innerHTML = "";

	RECORD_MODAL.Displays!.totalscore.innerText = "";

	RECORD_MODAL.Buttons!.addComponent!.onclick = () => {
		NewComponentInit();
	};

	RECORD_MODAL.Button!.onclick = () => {
		RECORD_MODAL.Modal.hide();
		SendRequest("store", "POST", {
			id: "",
			name: RECORD_MODAL.Inputs!.name.value,
			section: SECTION_LIST.GetValue(),
			transmutation: TRANSMUTATION_LIST.GetValue(),
			components: RECORD_MODAL.Methods!.getComponents(),
		});
	};

	RECORD_MODAL.Modal.show();
}

export function EditRecordInit(record: ClassRecord) {
	CONSOLE_LOG && console.log("Edit Record Init: ", record);

	RECORD_MODAL.Title!.innerText = "Edit Record";

	RECORD_MODAL.Inputs!.name.value = record.name;

	SECTION_LIST.SetValue(record.section);

	TRANSMUTATION_LIST.SetValue(record.transmutation);

	RECORD_MODAL.Methods!.populateComponents(record.components);

	RECORD_MODAL.Buttons!.addComponent!.onclick = () => {
		NewComponentInit();
	};

	RECORD_MODAL.Button!.onclick = () => {
		RECORD_MODAL.Modal.hide();
		SendRequest("update", "POST", {
			id: record.id,
			name: RECORD_MODAL.Inputs!.name.value,
			section: SECTION_LIST.GetValue(),
			transmutation: TRANSMUTATION_LIST.GetValue(),
			components: RECORD_MODAL.Methods!.getComponents(),
		});
	};

	RECORD_MODAL.Modal.show();
}

export function DeleteRecordInit(record: ClassRecord) {
	CONSOLE_LOG && console.log("Delete Record Init: ", record);

	DELETE_MODAL.Text!.innerHTML = `
    Are you sure you want to delete '${record.name}' Class Record?
  `;

	DELETE_MODAL.Button!.onclick = () => {
		DELETE_MODAL.Modal.hide();
		SendRequest("destroy", "POST", record);
	};

	DELETE_MODAL.Modal.show();
}

function NewComponentInit() {
	CONSOLE_LOG && console.log("New Record Component Init");

	COMPONENT_MODAL.Title!.innerText = "Add New Component";

	COMPONENT_MODAL.Inputs!.name.value = "";

	COMPONENT_MODAL.Inputs!.score.value = "0";

	COMPONENT_MODAL.Button!.onclick = () => {
		COMPONENT_MODAL.Modal.hide();
		RECORD_MODAL.Methods!.insertComponent({
			id: generateElementRandomId(),
			name: COMPONENT_MODAL.Inputs!.name.value,
			score: Number(COMPONENT_MODAL.Inputs!.score.value),
		});
	};

	COMPONENT_MODAL.Modal.show();
}

export function EditComponentInit(component: ClassRecordComponent) {
	CONSOLE_LOG && console.log("Edit Record Component Init: ", component);

	COMPONENT_MODAL.Title!.innerText = "Edit Component";

	COMPONENT_MODAL.Inputs!.name.value = component.name;

	COMPONENT_MODAL.Inputs!.score.value = component.score.toString();

	COMPONENT_MODAL.Button!.onclick = () => {
		COMPONENT_MODAL.Modal.hide();
		RECORD_MODAL.Methods!.updateComponent({
			id: component.id,
			name: COMPONENT_MODAL.Inputs!.name.value,
			score: Number(COMPONENT_MODAL.Inputs!.score.value),
		});
	};

	COMPONENT_MODAL.Modal.show();
}

export function DeleteComponentInit(component: ClassRecordComponent) {
	CONSOLE_LOG && console.log("Delete Record Component Init: ", component);

	DELETE_MODAL.Text!.innerHTML = `
    Are you sure you want to delete '${component.name}' Component?
  `;

	DELETE_MODAL.Button!.onclick = () => {
		DELETE_MODAL.Modal.hide();
		RECORD_MODAL.Methods?.deleteComponent(component);
	};

	DELETE_MODAL.Modal.show();
}

// AJAX
function SendRequest(title: string, method: AJAXMethods, data: ClassRecord) {
	DOM.SPINNER_ACTION.classList.remove("hidden");

	let request = {
		token: sessionStorage.getItem("token") ?? "",
		data: data,
	};

	$.ajax({
		type: method,
		url: ROUTES.CLASSRECORDS_API,
		data: `${title}=` + JSON.stringify(request),
		success: function (response) {
			DOM.SPINNER_ACTION.classList.add("hidden");
			RECORD_MODAL.Modal.hide();
			CONSOLE_LOG &&
				console.log(
					`Successful (${title}) response: `,
					JSON.parse(response) ?? response,
				);
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
			let data: RequestResponse = JSON.parse(xhr.responseText);
			ERROR_MODAL.Text!.innerHTML = `
        <b>Error:</b> ${data.title}
        <br><br>
        ${data.message}  
      `;
			ERROR_MODAL.Modal.show();
			if (xhr.status === 403) window.location.href = ROUTES.LOGIN_PAGE;
		},
	});
}

function getSections() {
	$.ajax({
		type: "GET",
		url: ROUTES.CLASSRECORDS_API,
		data:
			"sections=" + JSON.stringify({ token: sessionStorage.getItem("token") }),
		success: function (response) {
			CONSOLE_LOG &&
				console.log(
					"Successful GET SECTIONS Response: ",
					JSON.parse(response) || response,
				);

			let data: Section[] = JSON.parse(response).data;
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
			if (xhr.status === 403) window.location.href = ROUTES.LOGIN_PAGE;
		},
	});
}

function getTransmutations() {
	$.ajax({
		type: "GET",
		url: ROUTES.CLASSRECORDS_API,
		data:
			"transmutations=" +
			JSON.stringify({ token: sessionStorage.getItem("token") }),
		success: function (response) {
			CONSOLE_LOG &&
				console.log(
					"Successful GET TRANSMUTATIONS Response: ",
					JSON.parse(response) || response,
				);

			let data: Transmutation[] = JSON.parse(response).data;
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
			if (xhr.status === 403) window.location.href = ROUTES.LOGIN_PAGE;
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
				console.log(
					"Successful GET RECORDS Response: ",
					JSON.parse(response) || response,
				);
			let data: ClassRecord[] = JSON.parse(response).data;
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
			if (xhr.status === 403) window.location.href = ROUTES.LOGIN_PAGE;
		},
	});
}

// BUTTONS
NEW_RECORD_BUTTON.addEventListener("click", NewRecordInit);

LOGOUT_BUTTON.addEventListener("click", function () {
	$.ajax({
		type: "POST",
		url: ROUTES.SESSIONS_API,
		data:
			"logout=" + JSON.stringify({ token: sessionStorage.getItem("token") }),
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
			if (xhr.status === 403) window.location.href = ROUTES.LOGIN_PAGE;
		},
	});
});
