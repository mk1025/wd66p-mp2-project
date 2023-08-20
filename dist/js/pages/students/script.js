var _a;
import * as Routes from "../../scripts/routes";
import { Modal } from "flowbite";
const SectionModal = new Modal(document.getElementById("SectionModal"), {
    closable: false,
});
const DeleteModal = new Modal(document.getElementById("DeleteModal"), {
    closable: false,
});
const StudentModal = new Modal(document.getElementById("StudentModal"), {
    closable: false,
});
const Site_Spinner = document.getElementById("Site-Spinner");
const Action_Spinner = document.getElementById("Action-Spinner");
const SectionsContainer = document.getElementById("Sections");
const AddNewSectionButton = document.getElementById("AddNewSectionButton");
const SectionModalTitle = document.getElementById("SectionModalTitle");
const SectionModalNameInput = document.getElementById("SectionModalNameInput");
const SectionModalSYStartInput = document.getElementById("SectionModalSYStartInput");
const SectionModalSYEndInput = document.getElementById("SectionModalSYEndInput");
const SectionModalButton = document.getElementById("SectionModalButton");
const SectionThemeButton = document.getElementById("SectionModalThemeButton");
const SectionColorRadio = document.querySelectorAll('input[type="radio"][name="SectionColorRadio"]');
const DeleteModalText = document.getElementById("DeleteModalText");
const DeleteModalButton = document.getElementById("DeleteModalButton");
document.addEventListener("DOMContentLoaded", function () {
    populateSections();
});
AddNewSectionButton.addEventListener("click", addSectionInit);
SectionColorRadio.forEach((radioButton) => {
    radioButton.addEventListener("change", (event) => {
        const color = event.target.value;
        SectionThemeButton.classList.forEach((className) => {
            if (className.startsWith("bg-")) {
                SectionThemeButton.classList.remove(className);
            }
        });
        SectionThemeButton.classList.add(`bg-${color}-500`);
    });
});
function addSectionInit() {
    SectionModalTitle.innerText = "Add a New Section";
    SectionModalNameInput.value = "";
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    SectionModalSYStartInput.value = formattedDate;
    SectionModalSYEndInput.value = formattedDate;
    SectionThemeButton.classList.forEach((className) => {
        if (className.startsWith("bg-")) {
            SectionThemeButton.classList.remove(className);
        }
    });
    SectionThemeButton.classList.add(`bg-amber-500`);
    SectionModalButton.onclick = () => {
        SectionModal.hide();
        sendDataSection("addSection", { id: null });
    };
}
function editSectionInit(data) {
    var _a;
    SectionModalTitle.innerText = "Edit Section";
    SectionModalNameInput.value = data.name;
    SectionModalSYStartInput.value = data.syStart;
    SectionModalSYEndInput.value = data.syEnd;
    SectionModalButton.onclick = () => {
        SectionModal.hide();
        sendDataSection("updateSection", data);
    };
    document.getElementById("SectionModalCloseButton").onclick = () => {
        SectionModal.hide();
    };
    document.getElementById("SectionModalCancelButton").onclick = () => {
        SectionModal.hide();
    };
    let pickedColor = data.color;
    SectionColorRadio.forEach((radioButton) => {
        radioButton.checked = false;
        if (data.color === radioButton.value) {
            radioButton.checked = true;
            pickedColor = radioButton.value;
        }
    });
    SectionThemeButton.classList.forEach((className) => {
        if (className.startsWith("bg-")) {
            SectionThemeButton.classList.remove(className);
        }
    });
    SectionThemeButton.classList.add(`bg-${data.color}-500`);
    let display = {
        id: data.id,
        "Modal Title": SectionModalTitle.innerText,
        Name: SectionModalNameInput.value,
        "SY Start": SectionModalSYStartInput.value,
        "SY End": SectionModalSYEndInput.value,
        Color: pickedColor,
        Button: (_a = SectionModalButton.getAttribute("onclick")) === null || _a === void 0 ? void 0 : _a.toString(),
    };
    console.log("Edit Section Init: ", display);
    SectionModal.show();
}
function deleteSectionInit(data) {
    console.log("Delete Section INIT: ", data);
    DeleteModalText.innerText = `Are you sure you want to delete '${data.name}' section? All students and their scores in this section will be deleted also.`;
    DeleteModalButton.onclick = () => {
        DeleteModal.hide();
        sendDataSection("deleteSection", data);
    };
    document.getElementById("DeleteModalCloseButton").onclick = () => {
        DeleteModal.hide();
    };
    document.getElementById("DeleteModalCancelButton").onclick = () => {
        DeleteModal.hide();
    };
    DeleteModal.show();
}
function addStudentInit(data) {
    document.getElementById("StudentModalCloseButton").onclick = () => {
        StudentModal.hide();
    };
    document.getElementById("StudentModalCancelButton").onclick = () => {
        StudentModal.hide();
    };
    let firstNameInput = document.getElementById("first_name");
    let lastNameInput = document.getElementById("last_name");
    let genderInput = document.getElementById("gender");
    let birthdayInput = document.getElementById("birthday");
    firstNameInput.value = "";
    lastNameInput.value = "";
    genderInput.value = "Male";
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    birthdayInput.value = formattedDate;
    document.getElementById("StudentModalButton").onclick = () => {
        StudentModal.hide();
        sendDataStudent("addStudent", {
            section: data.id,
            id: null,
            first_name: firstNameInput.value,
            last_name: lastNameInput.value,
            gender: genderInput.value,
            birthday: birthdayInput.value,
        });
    };
    StudentModal.show();
}
function editStudentInit(section, data) {
    document.getElementById("StudentModalCloseButton").onclick = () => {
        StudentModal.hide();
    };
    document.getElementById("StudentModalCancelButton").onclick = () => {
        StudentModal.hide();
    };
    console.log("Edit Student Init: ", { section, data });
    let firstNameInput = document.getElementById("first_name");
    let lastNameInput = document.getElementById("last_name");
    let genderInput = document.getElementById("gender");
    let birthdayInput = document.getElementById("birthday");
    firstNameInput.value = data.first_name;
    lastNameInput.value = data.last_name;
    genderInput.value = data.gender;
    birthdayInput.value = data.birthday;
    document.getElementById("StudentModalButton").onclick = () => {
        StudentModal.hide();
        sendDataStudent("updateStudent", {
            section: section,
            id: data.id,
            first_name: firstNameInput.value,
            last_name: lastNameInput.value,
            gender: genderInput.value,
            birthday: birthdayInput.value,
        });
    };
    StudentModal.show();
}
function deleteStudentInit(section, data) {
    document.getElementById("DeleteModalCloseButton").onclick = () => {
        DeleteModal.hide();
    };
    document.getElementById("DeleteModalCancelButton").onclick = () => {
        DeleteModal.hide();
    };
    console.log("Delete Student Init: ", { section, data });
    DeleteModalText.innerText = `Are you sure you want to delete '${data.first_name}' student from this section?`;
    DeleteModalButton.onclick = () => {
        DeleteModal.hide();
        sendDataStudent("deleteStudent", {
            section: section,
            id: data.id,
        });
    };
    DeleteModal.show();
}
function sendDataSection(title, data) {
    Action_Spinner.classList.remove("hidden");
    let colorValue;
    SectionColorRadio.forEach((radioButton) => {
        if (radioButton.checked) {
            colorValue = radioButton.value;
        }
    });
    let postData = {
        token: sessionStorage.getItem("token"),
        id: data.id,
        name: SectionModalNameInput.value,
        syStart: SectionModalSYStartInput.value,
        syEnd: SectionModalSYEndInput.value,
        color: colorValue,
    };
    $.ajax({
        type: "POST",
        url: Routes.STUDENTS_API,
        data: `${title}=` + JSON.stringify(postData),
        success: function (response) {
            Action_Spinner.classList.add("hidden");
            console.log("Successful Response: ", JSON.parse(response) || response);
            populateSections();
            handleResponseData(JSON.parse(response));
        },
        error: function (xhr, status, error) {
            Action_Spinner.classList.add("hidden");
            console.log("XHR Status: ", xhr.status);
            console.log("XHR Text: ", xhr.responseText);
            console.log("Status: ", status);
            console.error("Error: ", error);
            handleResponseData(JSON.parse(xhr.responseText));
        },
    });
}
function sendDataStudent(title, data) {
    Action_Spinner.classList.remove("hidden");
    let postData = {
        token: sessionStorage.getItem("token"),
        section_id: data.section,
        student_id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        birthday: data.birthday,
    };
    console.log(postData);
    $.ajax({
        type: "POST",
        url: Routes.STUDENTS_API,
        data: `${title}=` + JSON.stringify(postData),
        success: function (response) {
            Action_Spinner.classList.add("hidden");
            console.log("Successful Response: ", JSON.parse(response) || response);
            populateSections();
            handleResponseData(JSON.parse(response));
        },
        error: function (xhr, status, error) {
            Action_Spinner.classList.add("hidden");
            console.log("XHR Status: ", xhr.status);
            console.log("XHR Text: ", xhr.responseText);
            console.log("Status: ", status);
            console.error("Error: ", error);
            handleResponseData(JSON.parse(xhr.responseText));
        },
    });
    Action_Spinner.classList.add("hidden");
}
function populateSections() {
    Action_Spinner.classList.remove("hidden");
    let data = {
        token: sessionStorage.getItem("token"),
    };
    $.ajax({
        type: "GET",
        url: Routes.STUDENTS_API,
        data: "populate=" + JSON.stringify(data),
        success: function (response) {
            console.log("Successful Response: ", JSON.parse(response) || response);
            if (JSON.parse(response) && JSON.parse(response).data.length !== 0) {
                let data = JSON.parse(response).data;
                SectionsContainer.innerHTML = `
          <div class='w-full text-center font-medium text-neutral-400'>
            Results Total: ${data.length}
          </div>
        `;
                for (let i = 0; i < data.length; i++) {
                    SectionsContainer.appendChild(createSection(data[i]));
                }
            }
            else {
                SectionsContainer.innerText = "You have not created any sections yet.";
            }
            Action_Spinner.classList.add("hidden");
        },
        error: function (xhr, status, error) {
            console.error("(Error) XHR Status: ", xhr.status);
            console.error("(Error) XHR Text: ", xhr.responseText);
            console.error("(Error) Status: ", status);
            console.error("Error: ", error);
            if (xhr.status === 404)
                window.location.href = Routes.LOGIN_PAGE;
            SectionsContainer.innerText = "Error getting Sections...";
            Action_Spinner.classList.add("hidden");
        },
    });
}
function createSection(row) {
    const Section = document.createElement("div");
    Section.classList.add("border-2", `border-${row.color}-500`, "rounded", "whitespace-nowrap");
    Section.id = row.id;
    const DetailsContainer = document.createElement("div");
    DetailsContainer.classList.add("flex", "flex-row", "gap-5", "p-5", "items-end", "text-white", `bg-${row.color}-500`);
    const SectionTitle = document.createElement("span");
    SectionTitle.classList.add("text-2xl", "font-bold");
    SectionTitle.innerText = row.name;
    const SectionSY = document.createElement("span");
    SectionSY.classList.add("text-sm", "font-medium", "text-neutral-100");
    let syStart = new Date(row.syStart);
    let syEnd = new Date(row.syEnd);
    let dateFormatter = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    SectionSY.innerText = `
  S.Y. ${dateFormatter.format(syStart)} - ${dateFormatter.format(syEnd)}`;
    const SectionActions = document.createElement("div");
    SectionActions.classList.add("flex", "flex-row", "flex-grow", "gap-2", "justify-end", "text-sm");
    const SectionAddButton = document.createElement("button");
    SectionAddButton.setAttribute("data-modal-target", "StudentModal");
    SectionAddButton.setAttribute("data-modal-toggle", "StudentModal");
    SectionAddButton.classList.add("rounded", "py-1", "px-2", "font-medium", "border", "border-white", "hover:bg-white", "hover:text-green-400", "focus:ring-4", "focus:ring-green-200");
    SectionAddButton.onclick = () => {
        addStudentInit(row);
    };
    const SectionAddButtonIcon = document.createElement("i");
    SectionAddButtonIcon.classList.add("fa-solid", "fa-square-plus", "mr-1");
    const SectionAddButtonText = document.createElement("span");
    SectionAddButtonText.innerText = "Add New Student";
    const SectionEditButton = document.createElement("button");
    SectionEditButton.setAttribute("data-modal-target", "SectionModal");
    SectionEditButton.setAttribute("data-modal-toggle", "SectionModal");
    SectionEditButton.classList.add("rounded", "py-1", "px-2", "font-medium", "border", "border-white", "hover:bg-white", `hover:text-blue-400`, "focus:ring-4", `focus:ring-blue-200`);
    SectionEditButton.onclick = () => {
        editSectionInit(row);
    };
    const SectionEditButtonIcon = document.createElement("i");
    SectionEditButtonIcon.classList.add("fa-solid", "fa-pencil", "mr-1");
    const SectionEditButtonText = document.createElement("span");
    SectionEditButtonText.innerText = "Edit";
    const SectionDeleteButton = document.createElement("button");
    SectionDeleteButton.setAttribute("data-modal-target", "DeleteModal");
    SectionDeleteButton.setAttribute("data-modal-toggle", "DeleteModal");
    SectionDeleteButton.classList.add("rounded", "py-1", "px-2", "font-medium", "border", "border-white", "hover:bg-white", `hover:text-red-400`, "focus:ring-4", `focus:ring-red-200`);
    const SectionDeleteButtonIcon = document.createElement("i");
    SectionDeleteButtonIcon.classList.add("fa-solid", "fa-trash", "mr-1");
    const SectionDeleteButtonText = document.createElement("span");
    SectionDeleteButtonText.innerText = "Delete";
    SectionDeleteButton.onclick = () => {
        deleteSectionInit(row);
    };
    const SectionHideButton = document.createElement("button");
    SectionHideButton.classList.add("p-2", "font-medium", "hover:text-neutral-100");
    const SectionHideButtonText = document.createElement("span");
    SectionHideButtonText.innerText = "Hide";
    const SectionHideButtonIcon = document.createElement("i");
    SectionHideButtonIcon.classList.add("fa-solid", "fa-folder-open", "ml-2");
    SectionHideButton.addEventListener("click", () => {
        var _a;
        (_a = document.getElementById(row.id + "-TABLE")) === null || _a === void 0 ? void 0 : _a.classList.toggle("hidden");
        SectionHideButtonIcon.classList.toggle("fa-folder-open");
        SectionHideButtonIcon.classList.toggle("fa-folder");
        if (SectionHideButtonIcon.classList.contains("fa-folder-open")) {
            SectionHideButtonText.innerText = "Hide";
        }
        else {
            SectionHideButtonText.innerText = "Show";
        }
    });
    const Table = document.createElement("table");
    Table.classList.add("w-full", "text-left", "text-sm", "table-auto");
    Table.id = row.id + "-TABLE";
    const TableHead = document.createElement("thead");
    TableHead.classList.add("uppercase", `bg-${row.color}-500`, "text-white", "text-lg");
    const TableHeadRow = document.createElement("tr");
    const TableHeadCell_1 = document.createElement("th");
    TableHeadCell_1.setAttribute("scope", "col");
    TableHeadCell_1.classList.add("px-6", "py-3");
    TableHeadCell_1.innerText = "ID";
    const TableHeadCell_2 = document.createElement("th");
    TableHeadCell_2.setAttribute("scope", "col");
    TableHeadCell_2.classList.add("px-6", "py-3");
    TableHeadCell_2.innerHTML = `
    <span>GENDER</span>
    <div class='flex flex-row w-max text-sm'>
      <span class='bg-blue-500 px-1 rounded-s'>
        <span>${row.gender.male}</span>
        <i class='fa-solid fa-mars'></i>
      </span>
      <span class='bg-pink-500 px-1'>
        <span>${row.gender.female}</span>
        <i class='fa-solid fa-venus'></i>
      </span>
      <span class='bg-cyan-500 px-1'>
        <span>${row.gender.other}</span>
        <i class='fa-solid fa-venus-mars'></i>
      </span>
      <span class='bg-neutral-400 px-1 rounded-e'>
        <span>${row.gender.male + row.gender.female + row.gender.other}</span>
        <i class='fa-solid fa-user'></i>
      </span>
    </div>
  `;
    const TableHeadCell_3 = document.createElement("th");
    TableHeadCell_3.setAttribute("scope", "col");
    TableHeadCell_3.classList.add("px-6", "py-3");
    TableHeadCell_3.innerText = "Last Name";
    const TableHeadCell_4 = document.createElement("th");
    TableHeadCell_4.setAttribute("scope", "col");
    TableHeadCell_4.classList.add("px-6", "py-3");
    TableHeadCell_4.innerText = "First Name";
    const TableHeadCell_5 = document.createElement("th");
    TableHeadCell_5.setAttribute("scope", "col");
    TableHeadCell_5.classList.add("px-6", "py-3");
    TableHeadCell_5.innerText = "Birthday";
    const TableHeadCell_6 = document.createElement("th");
    TableHeadCell_6.setAttribute("scope", "col");
    TableHeadCell_6.classList.add("px-6", "py-3");
    TableHeadCell_6.innerText = "Age";
    const TableHeadCell_7 = document.createElement("th");
    TableHeadCell_7.setAttribute("scope", "col");
    TableHeadCell_7.classList.add("px-6", "py-3");
    TableHeadCell_7.innerText = "Actions";
    TableHeadRow.appendChild(TableHeadCell_1);
    TableHeadRow.appendChild(TableHeadCell_2);
    TableHeadRow.appendChild(TableHeadCell_3);
    TableHeadRow.appendChild(TableHeadCell_4);
    TableHeadRow.appendChild(TableHeadCell_5);
    TableHeadRow.appendChild(TableHeadCell_6);
    TableHeadRow.appendChild(TableHeadCell_7);
    const TableBody = document.createElement("tbody");
    for (let student of row.students) {
        const today = new Date();
        const birthday = new Date(student.birthday);
        let age = today.getFullYear() - birthday.getFullYear();
        if (today.getMonth() < birthday.getMonth() ||
            (today.getMonth() === birthday.getMonth() &&
                today.getDate() < birthday.getDate())) {
            age -= 1;
        }
        let genderColor = "text-neutral-500";
        if (student.gender === "Male")
            genderColor = "text-blue-500";
        if (student.gender === "Female")
            genderColor = "text-pink-500";
        let TableBodyRow = document.createElement("tr");
        TableBodyRow.innerHTML = `
    <td class='px-6 py-3 text-neutral-400 text-lg font-mono'>${student.id}</td>
    <td class='px-6 py-3 ${genderColor} uppercase font-semibold'>${student.gender}</td>
    <td class='px-6 py-3 font-bold uppercase'>${student.last_name}</td>
    <td class='px-6 py-3'>${student.first_name}</td>
    <td class='px-6 py-3'>${dateFormatter.format(new Date(student.birthday))}</td>
    <td class='px-6 py-3'>${age}</td>
  `;
        const RowActionButtons = document.createElement("td");
        RowActionButtons.classList.add("px-6", "py-3", "flex", "flex-row", "gap-2");
        const StudentEditButton = document.createElement("button");
        StudentEditButton.setAttribute("data-modal-target", "StudentModal");
        StudentEditButton.setAttribute("data-modal-toggle", "StudentModal");
        StudentEditButton.classList.add("rounded", "py-2", "px-3", "font-medium", "bg-cyan-500", "text-white", "hover:bg-cyan-600", "focus:ring-4", "focus:ring-cyan-200");
        const StudentEditButtonIcon = document.createElement("i");
        StudentEditButtonIcon.classList.add("fa-solid", "fa-pencil", "mr-2");
        const StudentEditButtonText = document.createElement("span");
        StudentEditButtonText.innerText = "Edit";
        StudentEditButton.appendChild(StudentEditButtonIcon);
        StudentEditButton.appendChild(StudentEditButtonText);
        StudentEditButton.onclick = () => {
            editStudentInit(row.id, student);
        };
        const StudentDeleteButton = document.createElement("button");
        StudentDeleteButton.setAttribute("data-modal-target", "DeleteModal");
        StudentDeleteButton.setAttribute("data-modal-toggle", "DeleteModal");
        StudentDeleteButton.classList.add("rounded", "py-2", "px-3", "font-medium", "bg-red-500", "text-white", "hover:bg-red-600", "focus:ring-4", "focus:ring-red-200");
        const StudentDeleteButtonIcon = document.createElement("i");
        StudentDeleteButtonIcon.classList.add("fa-solid", "fa-trash", "mr-2");
        const StudentDeleteButtonText = document.createElement("span");
        StudentDeleteButtonText.innerText = "Delete";
        StudentDeleteButton.appendChild(StudentDeleteButtonIcon);
        StudentDeleteButton.appendChild(StudentDeleteButtonText);
        StudentDeleteButton.onclick = () => {
            deleteStudentInit(row.id, student);
        };
        RowActionButtons.appendChild(StudentEditButton);
        RowActionButtons.appendChild(StudentDeleteButton);
        TableBodyRow.appendChild(RowActionButtons);
        TableBody.appendChild(TableBodyRow);
    }
    TableHead.appendChild(TableHeadRow);
    Table.appendChild(TableHead);
    Table.appendChild(TableBody);
    SectionAddButton.appendChild(SectionAddButtonIcon);
    SectionAddButton.appendChild(SectionAddButtonText);
    SectionEditButton.appendChild(SectionEditButtonIcon);
    SectionEditButton.appendChild(SectionEditButtonText);
    SectionDeleteButton.appendChild(SectionDeleteButtonIcon);
    SectionDeleteButton.appendChild(SectionDeleteButtonText);
    SectionActions.appendChild(SectionAddButton);
    SectionActions.appendChild(SectionEditButton);
    SectionActions.appendChild(SectionDeleteButton);
    SectionHideButton.appendChild(SectionHideButtonText);
    SectionHideButton.appendChild(SectionHideButtonIcon);
    DetailsContainer.appendChild(SectionTitle);
    DetailsContainer.appendChild(SectionSY);
    DetailsContainer.appendChild(SectionActions);
    DetailsContainer.appendChild(SectionHideButton);
    Section.appendChild(DetailsContainer);
    Section.appendChild(Table);
    return Section;
}
export function handleResponseData(data) {
    if (data.status === 400) {
    }
    if (data.status === 403)
        window.location.href = Routes.LOGIN_PAGE;
    if (data.data.user)
        window.location.href = Routes.HOME_PAGE;
    if (data.data.redirect)
        window.location.href = Routes.DASHBOARD_PAGE;
}
function reloadFlowbiteScript() {
    const existingScript = document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.6/flowbite.min.js"]');
    if (existingScript) {
        existingScript.remove();
    }
    const newScript = document.createElement("script");
    newScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.6/flowbite.min.js";
    newScript.defer = true;
    document.body.appendChild(newScript);
}
(_a = document.getElementById("LogoutButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    $.ajax({
        type: "POST",
        url: Routes.SESSIONS_API,
        data: "logout=" + JSON.stringify({ token: sessionStorage.getItem("token") }),
        success: function (response) {
            console.log("Successful Response: ", JSON.parse(response) || response);
            sessionStorage.removeItem("token");
            window.location.href = Routes.LOGIN_PAGE;
        },
        error: function (xhr, status, error) {
            console.group("Logout Errors:");
            console.error("(Error) XHR Status: ", xhr.status);
            console.error("(Error) XHR Text: ", xhr.responseText);
            console.error("(Error) Status: ", status);
            console.error("Error: ", error);
            console.groupEnd();
            sessionStorage.removeItem("token");
            if (xhr.status === 403)
                window.location.href = Routes.LOGIN_PAGE;
        },
    });
});
