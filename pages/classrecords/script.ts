import * as Routes from "../../scripts/routes.js";
// @ts-ignore
import { Modal } from "flowbite";

// SPINNERS
const ActionSpinner = document.getElementById(
  "Action-Spinner",
) as HTMLDivElement;

const AddNewRecordButton = document.getElementById(
  "AddNewRecordButton",
) as HTMLButtonElement;
const RecordModalSectionsButton = document.getElementById(
  "RecordModalSectionsButton",
) as HTMLButtonElement;
const SectionListRadio = document.querySelectorAll<HTMLInputElement>(
  'input[type="radio"][name="SectionListRadio"]',
);
const RecordModalAddComponentButton = document.getElementById(
  "RecordModalAddComponentButton",
) as HTMLButtonElement;

const LogoutButton = document.getElementById(
  "LogoutButton",
) as HTMLButtonElement;

// MODAL INITS
const RecordModal = new Modal(document.getElementById("RecordModal"), {
  closable: false,
  onShow: () => {
    document.getElementById("RecordModalCloseButton")!.onclick = () => {
      RecordModal.hide();
    };
    document.getElementById("RecordModalCancelButton")!.onclick = () => {
      RecordModal.hide();
    };
    computeTotalScore();
  },
});

const ComponentModal = new Modal(document.getElementById("ComponentModal"), {
  closable: false,
  onShow: () => {
    RecordModal.hide();
    document.getElementById("ComponentModalCloseButton")!.onclick = () => {
      ComponentModal.hide();
    };
    document.getElementById("ComponentModalCancelButton")!.onclick = () => {
      ComponentModal.hide();
    };
  },
  onHide: () => {
    RecordModal.show();
  },
});

const DeleteModal = new Modal(document.getElementById("DeleteModal"), {
  closable: false,
  onShow: () => {
    document.getElementById("DeleteModalCloseButton")!.onclick = () => {
      DeleteModal.hide();
    };
    document.getElementById("DeleteModalCancelButton")!.onclick = () => {
      DeleteModal.hide();
    };
  },
});

const ErrorModal = new Modal(document.getElementById("ErrorModal"), {
  closable: false,
  onShow: () => {
    document.getElementById("ErrorModalCloseButton")!.onclick = () => {
      ErrorModal.hide();
    };
    document.getElementById("ErrorModalOkayButton")!.onclick = () => {
      ErrorModal.hide();
    };
  },
});

// BUTTONS

AddNewRecordButton.onclick = () => {
  addRecordInit();
};

RecordModalAddComponentButton.onclick = () => {
  addComponentInit();
};

LogoutButton.onclick = () => {
  logout();
};

document.addEventListener("DOMContentLoaded", () => {
  populateRecords();
});

// RECORD FUNCTIONS
function addRecordInit() {
  const RecordModalTitle = document.getElementById(
    "RecordModalTitle",
  ) as HTMLElement;
  const RecordModalNameInput = document.getElementById(
    "RecordModalNameInput",
  ) as HTMLInputElement;
  const Alert = document.getElementById("RecordModalAlert") as HTMLDivElement;
  const AlertText = document.getElementById(
    "RecordModalAlertText",
  ) as HTMLSpanElement;

  Alert?.classList.add("hidden");

  RecordModalTitle.innerText = "Add New Class Record";

  RecordModalNameInput.value = "";

  sectionListDropdown(getSections());

  const SectionListRadio = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"][name="SectionListRadio"]',
  );

  SectionListRadio.forEach((radioButton) => {
    radioButton.addEventListener("change", (event) => {
      const color = (event.target as HTMLInputElement).getAttribute(
        "data-color",
      );
      const name = (event.target as HTMLInputElement).getAttribute("data-name");

      //   console.log(color, name);

      RecordModalSectionsButton.classList.forEach((className) => {
        if (className.startsWith("bg-")) {
          RecordModalSectionsButton.classList.remove(className);
        }
      });

      RecordModalSectionsButton.classList.add(`bg-${color}-500`);
      RecordModalSectionsButton.innerHTML = `
            ${name}
            <i class='fa-solid fa-caret-down ml-2'></i>
        `;
    });
  });

  SectionListRadio.forEach((radioButton) => {
    if (radioButton.checked) {
      RecordModalSectionsButton.classList.forEach((className) => {
        if (className.startsWith("bg-")) {
          RecordModalSectionsButton.classList.remove(className);
        }
      });

      RecordModalSectionsButton.classList.add(
        `bg-${radioButton.getAttribute("data-color")}-500`,
      );
    }
  });

  const ComponentsTableBody = document.getElementById(
    "ComponentsTableBody",
  ) as HTMLTableSectionElement;

  ComponentsTableBody.innerHTML = "";

  const RecordModalButton = document.getElementById(
    "RecordModalButton",
  ) as HTMLButtonElement;

  RecordModalButton.onclick = () => {
    if (SectionListRadio.length === 0) {
      RecordModal.show();
      Alert.classList.remove("hidden");
      AlertText.innerText = "You must create a section first.";
      return;
    }

    const ComponentsTableBody = document.getElementById(
      "ComponentsTableBody",
    ) as HTMLTableSectionElement;

    let section;

    SectionListRadio.forEach((radioButton) => {
      if (radioButton.checked) {
        section = radioButton.value;
      }
    });

    let components: any = [];

    ComponentsTableBody.querySelectorAll("tr").forEach((row, index) => {
      components.push({
        order: index + 1,
        name: row.getAttribute("data-name"),
        score: row.getAttribute("data-score"),
      });
    });

    // console.log({
    //   name: RecordModalNameInput.value,
    //   section: section,
    //   components: components,
    // });
    ComponentModal.hide();
    // RecordModal.hide();
    sendDataRecord("addRecord", {
      token: sessionStorage.getItem("token"),
      name: RecordModalNameInput.value,
      section: section,
      components: components,
    });
  };

  RecordModal.show();
}

function editRecordInit(record: any) {
  sectionListDropdown(getSections());

  console.log("Edit Record Init: ", record);
  /*
    Data Schema
    {

      "id": string,
      "record_name": string,
      "section_id": string,
      "section_name": string,
      "syStart": string,
      "syEnd": string,
      "transmutation": {
        "id": string,
        "name": string,
        "lowest": number,
        "passing": number,
        "highest": number
      }
      "color": string,
      "components": [{
        "id": string,
        "component_name": string,
        "component_score": number,
        "activities": number,
      }]

    }
  */

  const RecordModalTitle = document.getElementById(
    "RecordModalTitle",
  ) as HTMLElement;
  const RecordModalNameInput = document.getElementById(
    "RecordModalNameInput",
  ) as HTMLInputElement;

  RecordModalTitle.innerText = "Edit Class Record: " + record.record_name;
  RecordModalNameInput.value = record.record_name;

  const SectionListRadio = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"][name="SectionListRadio"]',
  );

  SectionListRadio.forEach((radioButton) => {
    if (radioButton.value === record.section_id) {
      radioButton.checked = true;
      RecordModalSectionsButton.classList.forEach((className) => {
        if (className.startsWith("bg-")) {
          RecordModalSectionsButton.classList.remove(className);
        }
      });
      RecordModalSectionsButton.classList.add(`bg-${record.color}-500`);
      RecordModalSectionsButton.innerHTML = `
            ${record.section_name}
            <i class='fa-solid fa-caret-down ml-2'></i>
        `;
    }
  });

  const ComponentsTableBody = document.getElementById(
    "ComponentsTableBody",
  ) as HTMLTableSectionElement;

  ComponentsTableBody.innerHTML = "";

  let rowLength = 1;
  for (const component of record.components) {
    const row = document.createElement("tr");
    row.id = component.id;
    row.setAttribute("data-name", component.component_name);
    row.setAttribute("data-score", component.component_score);

    row.innerHTML = `<td class='p-2 font-bold text-lg text-center'>${rowLength}</td>`;
    row.innerHTML += `<td class='p-2'>${component.component_name}</td>`;
    row.innerHTML += `<td class='p-2 font-semibold text-right'>${component.component_score}%</td>`;

    const rowActions = document.createElement("td");
    rowActions.classList.add(
      "p-2",
      "flex",
      "flex-row",
      "gap-2",
      "justify-end",
      "text-white",
    );

    const settingButton = document.createElement("button");
    settingButton.classList.add(
      "py-2",
      "px-3",
      "bg-blue-400",
      "hover:bg-blue-600",
      "rounded",
    );

    settingButton.innerHTML = `<i class='fa-sold fas fa-cog'></i>`;

    settingButton.onclick = () => {
      editComponentInit({
        id: row.id,
        name: row.getAttribute("data-name"),
        score: row.getAttribute("data-score"),
      });
    };

    const deleteButton = document.createElement("button");
    deleteButton.classList.add(
      "py-2",
      "px-3",
      "bg-red-400",
      "hover:bg-red-600",
      "rounded",
    );

    deleteButton.innerHTML = `<i class='fa-solid fa-trash-can'></i>`;

    deleteButton.onclick = () => {
      deleteComponentInit({
        id: row.id,
        name: row.getAttribute("data-name"),
        score: row.getAttribute("data-score"),
      });
    };

    rowActions.appendChild(settingButton);
    rowActions.appendChild(deleteButton);
    row.appendChild(rowActions);

    ComponentsTableBody.appendChild(row);
    rowLength++;
  }

  computeTotalScore();

  const RecordModalButton = document.getElementById(
    "RecordModalButton",
  ) as HTMLButtonElement;

  RecordModalButton.onclick = () => {
    const Alert = document.getElementById("RecordModalAlert") as HTMLDivElement;
    const AlertText = document.getElementById(
      "RecordModalAlertText",
    ) as HTMLDivElement;
    const ComponentsTableBody = document.getElementById(
      "ComponentsTableBody",
    ) as HTMLTableSectionElement;
    if (SectionListRadio.length === 0) {
      RecordModal.show();
      Alert.classList.remove("hidden");
      AlertText.innerText = "You must create a section first.";
      return;
    }

    if (ComponentsTableBody.querySelectorAll("tr").length === 0) {
      RecordModal.show();
      Alert.classList.remove("hidden");
      AlertText.innerText = "You must create a component first.";
      return;
    }

    let section;

    SectionListRadio.forEach((radioButton) => {
      if (radioButton.checked) {
        section = radioButton.value;
      }
    });

    let components: any = [];

    ComponentsTableBody.querySelectorAll("tr").forEach((row, index) => {
      components.push({
        order: index + 1,
        id: row.id,
        name: row.getAttribute("data-name"),
        score: row.getAttribute("data-score"),
      });
    });

    // console.log({
    //   id: record.id,
    //   name: RecordModalNameInput.value,
    //   section: section,
    //   components: components,
    // });
    ComponentModal.hide();
    // RecordModal.hide();
    sendDataRecord("updateRecord", {
      token: sessionStorage.getItem("token"),
      id: record.id,
      name: RecordModalNameInput.value,
      section: section,
      components: components,
    });
  };
}

function deleteRecordInit(record: any) {
  console.log("Delete Record Init: ", record);

  const DeleteModalText = document.getElementById(
    "DeleteModalText",
  ) as HTMLDivElement;

  DeleteModalText.innerText = `Are you sure you want to delete '${record.record_name}' record? All of its components and associated activities will also be deleted.`;

  const DeleteModalButton = document.getElementById(
    "DeleteModalButton",
  ) as HTMLButtonElement;

  DeleteModalButton.onclick = () => {
    sendDataRecord("deleteRecord", {
      token: sessionStorage.getItem("token"),
      id: record.id,
    });
    DeleteModal.hide();
  };

  DeleteModal.show();
}

// COMPONENT FUNCTIONS
function addComponentInit() {
  const ComponentModalTitle = document.getElementById(
    "ComponentModalTitle",
  ) as HTMLElement;
  const ComponentNameInput = document.getElementById(
    "ComponentNameInput",
  ) as HTMLInputElement;
  const ComponentScoreInput = document.getElementById(
    "ComponentScoreInput",
  ) as HTMLInputElement;
  const ComponentModalButton = document.getElementById(
    "ComponentModalButton",
  ) as HTMLButtonElement;

  ComponentModalTitle.innerText = "Add New Component";
  ComponentNameInput.value = "";
  ComponentScoreInput.value = "0";

  ComponentModalButton.onclick = () => {
    addComponentToTable();
  };

  ComponentModal.show();
}

function addComponentToTable() {
  const ComponentNameInput = document.getElementById(
    "ComponentNameInput",
  ) as HTMLInputElement;
  const ComponentScoreInput = document.getElementById(
    "ComponentScoreInput",
  ) as HTMLInputElement;
  const ComponentsTableBody = document.getElementById(
    "ComponentsTableBody",
  ) as HTMLTableSectionElement;

  const row = document.createElement("tr");

  let rowLength = ComponentsTableBody.querySelectorAll("tr").length + 1;

  row.id = generateElementRandomId();

  row.innerHTML = `
    <td class='p-2 font-bold text-lg text-center'>${rowLength}</td>
  `;
  row.innerHTML += `
    <td class='p-2'>${ComponentNameInput.value}</td>
  `;
  row.innerHTML += `
    <td class='p-2 font-semibold text-right'>${ComponentScoreInput.value}%</td>
  `;
  const rowActions = document.createElement("td");
  rowActions.classList.add(
    "p-2",
    "flex",
    "flex-row",
    "gap-2",
    "justify-end",
    "text-white",
  );

  const settingButton = document.createElement("button");
  settingButton.classList.add(
    "py-2",
    "px-3",
    "bg-blue-400",
    "hover:bg-blue-600",
    "rounded",
  );

  settingButton.innerHTML = `<i class='fa-sold fas fa-cog'></i>`;

  settingButton.onclick = () => {
    editComponentInit({
      id: row.id,
      name: row.getAttribute("data-name"),
      score: row.getAttribute("data-score"),
    });
  };

  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "py-2",
    "px-3",
    "bg-red-400",
    "hover:bg-red-600",
    "rounded",
  );

  deleteButton.innerHTML = `<i class='fa-solid fa-trash-can'></i>`;

  deleteButton.onclick = () => {
    deleteComponentInit({
      id: row.id,
      name: row.getAttribute("data-name"),
      score: row.getAttribute("data-score"),
    });
  };

  rowActions.appendChild(settingButton);
  rowActions.appendChild(deleteButton);
  row.appendChild(rowActions);

  row.setAttribute("data-name", ComponentNameInput.value);
  row.setAttribute("data-score", ComponentScoreInput.value);

  ComponentsTableBody.appendChild(row);
  computeTotalScore();
}

function editComponentToTable(component: any) {
  const ComponentTableBody = document.getElementById(
    "ComponentsTableBody",
  ) as HTMLTableSectionElement;

  const row = ComponentTableBody.querySelector(`tr[id="${component.id}"]`);

  row?.setAttribute("data-name", component.name);
  row?.setAttribute("data-score", component.score);

  row!.querySelectorAll("td")[1].innerText = component.name;
  row!.querySelectorAll("td")[2].innerText = component.score + "%";

  computeTotalScore();
  ComponentModal.hide();
}

function editComponentInit(component: any) {
  console.log("Edit Component Init: ", component);

  const ComponentModalTitle = document.getElementById(
    "ComponentModalTitle",
  ) as HTMLElement;
  const ComponentNameInput = document.getElementById(
    "ComponentNameInput",
  ) as HTMLInputElement;
  const ComponentScoreInput = document.getElementById(
    "ComponentScoreInput",
  ) as HTMLInputElement;
  const ComponentModalButton = document.getElementById(
    "ComponentModalButton",
  ) as HTMLButtonElement;

  ComponentModalTitle.innerText = "Edit a Component";

  ComponentNameInput.value = component.name;
  ComponentScoreInput.value = component.score;

  ComponentModalButton.onclick = () => {
    editComponentToTable({
      id: component.id,
      name: ComponentNameInput.value,
      score: ComponentScoreInput.value,
    });
  };

  ComponentModal.show();
}

function deleteComponentInit(component: any) {
  console.log("Delete Component Init: ", component);

  const DeleteModalText = document.getElementById(
    "DeleteModalText",
  ) as HTMLElement;
  const DeleteModalButton = document.getElementById(
    "DeleteModalButton",
  ) as HTMLButtonElement;

  DeleteModalText.innerText = `
  Are you sure you want to delete '${component.name}'  component? 
  All activities and students that have them will be deleted also...`;

  DeleteModalButton.onclick = () => {
    document.getElementById(component.id)!.remove();
    DeleteModal.hide();
  };

  DeleteModal.show();
}

// AJAX
function sendDataRecord(title: string, data: any) {
  const ErrorModalText = document.getElementById(
    "ErrorModalText",
  ) as HTMLHeadingElement;
  ActionSpinner.classList.remove("hidden");

  $.ajax({
    type: "POST",
    url: Routes.CLASSRECORDS_API,
    data: `${title}=` + JSON.stringify(data),
    async: false,
    success: function (response) {
      ActionSpinner.classList.add("hidden");
      console.log(
        `Successful '${title}' response: `,
        JSON.parse(response) || response,
      );
      DeleteModal.hide();
      ComponentModal.hide();
      RecordModal.hide();
      populateRecords();
    },
    error: function (xhr, status, error) {
      ActionSpinner.classList.add("hidden");
      console.group(`'(${title})' Errors:`);
      console.error("(Error) XHR Status: ", xhr.status);
      console.error("(Error) XHR Text: ", xhr.responseText);
      console.error("(Error) Status: ", status);
      console.error("Error: ", error);
      console.groupEnd();
      if (xhr.status === 403) window.location.href = Routes.LOGIN_PAGE;

      let data = JSON.parse(xhr.responseText);
      ErrorModalText.innerHTML = `
        <b>Error:</b> <br>${data.title || "Internal Server Error"}
        <br><br>
        ${data.message || "Internal Server Error"}
        `;

      ErrorModal.show();

      DeleteModal.hide();
      if (RecordModal.isVisible()) {
        ComponentModal.hide();
        return;
      }
      RecordModal.hide();

      // if (document.querySelectorAll("div[modal-backdrop]").length > 0) {
      //   document.querySelectorAll("div[modal-backdrop]").forEach((element) => {
      //     element.remove();
      //   });
      // }
    },
  });
}

function sectionListDropdown(sections: any) {
  const DropdownContainer = document.getElementById(
    "RecordModalSectionDropdown",
  ) as HTMLDivElement;

  DropdownContainer.innerHTML = "";

  //   console.log(sections);

  if (sections.length > 0) {
    const ul = document.createElement("ul");
    ul.classList.add("py-2", "text-sm", "text-gray-700");
    ul.setAttribute("aria-labelledby", "RecordModalSectionsButton");

    for (const section of sections) {
      let syStart = new Date(section.syStart);
      let syEnd = new Date(section.syEnd);
      let dateFormatter = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      ul.innerHTML += `
        <li>
            <label 
                class='text-${
                  section.color
                }-500 flex flex-row whitespace-nowrap items-center gap-5 w-full px-4 py-2 text-md font-medium hover:bg-gray-100 cursor-pointer'>
                
                <input  
                    name='SectionListRadio'
                    value='${section.id}'
                    type='radio'
                    data-name='${section.name}'
                    data-color='${section.color}'
                    ${sections.indexOf(section) === 0 ? "checked" : ""}
                    class='text-${
                      section.color
                    }-500 bg-gray-100 border-gray-300 focus:ring-${
        section.color
      }-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <span>${section.name}</span>
                <span class='text-sm text-gray-500'>S.Y. ${dateFormatter.format(
                  syStart,
                )} - ${dateFormatter.format(syEnd)}</span>
                
            </label>
        </li>
      `;
    }

    DropdownContainer.appendChild(ul);
  }

  RecordModalSectionsButton.innerHTML = `
    ${
      sections.length > 0 && sections[0].name
        ? sections[0].name
        : "No Sections Found"
    }
    <i class='fa-solid fa-caret-down ml-2'></i>
  `;
}

function getSections() {
  let data = {
    token: sessionStorage.getItem("token"),
  };

  let sections: any = [];

  $.ajax({
    type: "GET",
    url: Routes.CLASSRECORDS_API,
    data: "getSections=" + JSON.stringify(data),
    async: false,
    success: function (response) {
      console.log("Successful Response: ", JSON.parse(response) || response);
      sections = JSON.parse(response).data;
    },
    error: function (xhr, status, error) {
      console.error("Response Error: ", {
        status: xhr.status || status,
        text: xhr.responseText,
        error: error,
      });
    },
  });

  return sections;
}

function createRecord(record: any) {
  /*
    Data Schema
    {
      "data": [{
        "id": string,
        "record_name": string,
        "section_id": string,
        "section_name": string,
        "syStart": string,
        "syEnd": string,
        "transmutation": {
          "id": string,
          "name": string,
          "lowest": number,
          "passing": number,
          "highest": number
        }
        "color": string,
        "components": [{
          "id": string,
          "component_name": string,
          "component_score": number,
          "activities": number,
        }]
      }]
    }
  */
  const Record = document.createElement("div");

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  Record.classList.add(
    "w-max",
    "h-max",
    "shadow-xl",
    "rounded",
    "bg-white",
    "border-2",
    `border-${record.color}-500`,
  );

  const Header = document.createElement("div");
  Header.classList.add(
    "flex",
    "flex-row",
    "justify-between",
    "items-center",
    "gap-5",
    "w-full",
    "p-2",
    `bg-${record.color}-500`,
    "text-white",
  );

  const HeaderTitleContainer = document.createElement("div");

  HeaderTitleContainer.innerHTML = `
    <h1 class='text-2xl font-bold'>${record.record_name}</h1>
    <h2 class='text-neutral-100 text-lg'>${record.section_name}</h2>
    <h3 class='text-neutral-100 text-sm'>
    S.Y. ${dateFormatter.format(
      new Date(record.syStart),
    )} - ${dateFormatter.format(new Date(record.syEnd))}
    </h3>
  `;

  const HeaderButton = document.createElement("button");
  HeaderButton.classList.add("p-2", "hover:text-neutral-200", "font-medium");
  HeaderButton.innerHTML = `
      <span>Hide</span>
      <i class='fa-solid fa-folder-open ml-2'></i>
  `;

  const Content = document.createElement("div");
  Content.classList.add("flex", "flex-col", "w-full", "p-2", "gap-2");

  const Table = document.createElement("table");
  Table.classList.add("w-full");

  const TableHead = document.createElement("thead");
  TableHead.classList.add("text-neutral", "font-medium", "text-left");
  TableHead.innerHTML = `
      <tr>
        <th scope='col' class='px-6 py-2'>COMPONENT</th>
        <th scope='col' class='px-6 py-2 text-center'>ACTIVITIES</th>
        <th scope='col' class='px-6 py-2 text-center'>
          <i class='fa-solid fa-percent'></li>
        </th>
      </tr>
  `;

  const TableBody = document.createElement("tbody");
  TableBody.classList.add("text-sm");

  TableBody.innerHTML = "";

  if (record.components.length === 0) {
    TableBody.innerHTML = `
    <tr>
      <td class='px-6 py-2' colspan='3'>
        No Components
      </td>
    </tr>
  `;
  }
  let TotalScore = 0;

  for (const [index, component] of record.components.entries()) {
    TableBody.innerHTML += `
      <tr>
        <td class='px-6 py-2'>${index + 1}. ${component.component_name}</td>
        <td class='px-6 py-2 text-center'>${component.activities}</td>
        <td class='px-6 py-2 font-semibold text-right'>${
          component.component_score
        }%</td>
      </tr>
    `;
    TotalScore += component.component_score;
  }

  const ActionsContainer = document.createElement("div");
  ActionsContainer.classList.add(
    "flex",
    "flex-row",
    "gap-2",
    "w-full",
    "justify-end",
    "text-white",
    "mt-5",
    "p-2",
    "items-center",
  );

  const ViewButton = document.createElement("button");
  ViewButton.classList.add(
    "p-2",
    "w-[3rem]",
    "rounded",
    "shadow",
    "bg-amber-400",
    "hover:bg-amber-600",
  );
  ViewButton.innerHTML = `<i class="fa-solid fas fa-folder-open"></i>`;
  ViewButton.onclick = () => {
    const recordId = record.id.toString().toLowerCase().replace(/-/g, "_");
    window.location.href = Routes.VIEWRECORD_PAGE + "/?v=" + recordId;
  };

  const SettingsButton = document.createElement("button");
  SettingsButton.classList.add(
    "p-2",
    "w-[3rem]",
    "rounded",
    "shadow",
    "bg-blue-400",
    "hover:bg-blue-600",
  );
  SettingsButton.innerHTML = `<i class="fa-solid fa-gear"></i>`;
  SettingsButton.onclick = () => {
    editRecordInit(record);
    RecordModal.show();
  };

  const DeleteButton = document.createElement("button");
  DeleteButton.classList.add(
    "p-2",
    "w-[3rem]",
    "rounded",
    "shadow",
    "bg-red-400",
    "hover:bg-red-600",
  );
  DeleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  DeleteButton.onclick = () => {
    deleteRecordInit(record);
  };

  // APPENDED

  Header.appendChild(HeaderTitleContainer);
  HeaderButton.onclick = () => {
    Content.classList.toggle("hidden");
    if (Content.classList.contains("hidden")) {
      HeaderButton.innerHTML = `
        <span>Show</span>
        <i class='fa-solid fa-folder ml-2'></i>
      `;
    } else {
      HeaderButton.innerHTML = `
        <span>Hide</span>
        <i class='fa-solid fa-folder-open ml-2'></i>
      `;
    }
  };
  Header.appendChild(HeaderButton);

  Table.appendChild(TableHead);
  Table.appendChild(TableBody);

  Content.appendChild(Table);
  Content.innerHTML += `
    <hr class='mx-5' />
    <div class='w-full text-right px-6 py-2 text-neutral-400 font-bold'>
    TOTAL PERCENTAGE SCORE: ${TotalScore}%
    </div>
    <div>
        <h1 class="font-bold text-neutral-400">TRANSMUTATION:</h1>
        <span>${record.transmutation.name} (${record.transmutation.lowest}% - ${record.transmutation.passing}% - ${record.transmutation.highest}%)</span>
    </div>
  `;

  ActionsContainer.appendChild(ViewButton);
  ActionsContainer.appendChild(SettingsButton);
  ActionsContainer.appendChild(DeleteButton);

  Content.appendChild(ActionsContainer);

  Record.appendChild(Header);
  Record.appendChild(Content);

  return Record;
}

function populateRecords() {
  ActionSpinner.classList.remove("hidden");

  $.ajax({
    type: "GET",
    url: Routes.CLASSRECORDS_API,
    data:
      "populateRecords=" +
      JSON.stringify({ token: sessionStorage.getItem("token") }),
    success: function (response) {
      ActionSpinner.classList.add("hidden");
      const RecordsList = document.getElementById("RecordsList") as HTMLElement;

      console.log("GET Records Response: ", JSON.parse(response) || response);
      RecordsList.innerText = "No Records Found";
      if (JSON.parse(response).data && JSON.parse(response).data.length > 0) {
        RecordsList.innerHTML = "";
        for (const record of JSON.parse(response).data) {
          RecordsList.appendChild(createRecord(record));
        }
      }
    },
    error: function (xhr, status, error) {
      ActionSpinner.classList.add("hidden");
      console.group(`Populate Records - Errors:`);
      console.error("(Error) XHR Status: ", xhr.status);
      console.error("(Error) XHR Text: ", xhr.responseText);
      console.error("(Error) Status: ", status);
      console.error("Error: ", error);
      console.groupEnd();
      if (xhr.status === 401 || xhr.status === 403) {
        logout();
      }
    },
  });
}

function computeTotalScore() {
  const ComponentsTableBody = document.getElementById(
    "ComponentsTableBody",
  ) as HTMLTableSectionElement;

  const ComponentsTotalScore = document.getElementById(
    "ComponentsTotalScore",
  ) as HTMLTableCellElement;

  let totalScore = 0;

  ComponentsTableBody.querySelectorAll("tr").forEach((row) => {
    const score = parseInt(row.getAttribute("data-score")!);
    totalScore += score;
  });

  ComponentsTotalScore.innerText = `${totalScore}%`;
}

function logout() {
  ActionSpinner.classList.remove("hidden");
  $.ajax({
    type: "POST",
    data:
      "logout=" + JSON.stringify({ token: sessionStorage.getItem("token") }),
    url: Routes.CLASSRECORDS_API,
    success: function (response) {
      ActionSpinner.classList.add("hidden");
      console.log(
        "Successful logout response: ",
        JSON.parse(response) || response,
      );
      sessionStorage.removeItem("token");
      window.location.href = Routes.LOGIN_PAGE;
    },
    error: function (xhr, status, error) {
      ActionSpinner.classList.add("hidden");
      console.group(`Logout - Errors:`);
      console.error("(Error) XHR Status: ", xhr.status);
      console.error("(Error) XHR Text: ", xhr.responseText);
      console.error("(Error) Status: ", status);
      console.error("Error: ", error);
      console.groupEnd();
    },
  });
}

// OTHER FUNCTIONS
function generateElementRandomId() {
  const prefix = "element";
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${randomString}`;
}
