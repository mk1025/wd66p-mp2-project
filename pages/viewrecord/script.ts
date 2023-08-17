import * as Routes from "../../scripts/routes";
import * as dts from "./script.d";

// @ts-ignore
import { Modal } from "flowbite";

// CONSOLE LOG OPTION
const ENABLE_CONSOLELOG = true;

// ELEMENTS
const ClassRecord_Title = document.getElementById(
  "ClassRecordTitle",
) as HTMLHeadingElement;
const ClassRecord_Section = document.getElementById(
  "ClassRecordSection",
) as HTMLHeadingElement;
const ClassRecord_SY = document.getElementById(
  "ClassRecordSY",
) as HTMLHeadingElement;

// SPINNERS
const SiteSpinner = document.getElementById("Site-Spinner") as HTMLDivElement;
const ActionSpinner = document.getElementById(
  "Action-Spinner",
) as HTMLDivElement;

// BUTTONS
const ExitButton = document.getElementById("ExitButton") as HTMLButtonElement;
ExitButton.onclick = () => (window.location.href = Routes.CLASSRECORDS_PAGE);

const ActivityThemeButton = document.getElementById(
  "ActivityModalThemeButton",
) as HTMLButtonElement;

// INPUT ELEMENTS
const ActivityColorRadio = document.querySelectorAll<HTMLInputElement>(
  'input[type="radio"][name="ActivityColorRadio"]',
);

ActivityColorRadio.forEach((radioButton) => {
  radioButton.addEventListener("change", (event) => {
    const color = (event.target as HTMLInputElement).value;
    ActivityThemeButton.classList.forEach((className) => {
      if (className.startsWith("bg-")) {
        ActivityThemeButton.classList.remove(className);
      }
    });

    ActivityThemeButton.classList.add(`bg-${color}-500`);
  });
});

// MODAL INITS
const ActivityModal = new Modal(document.getElementById("ActivityModal"), {
  closable: false,
  onShow: () => {
    document.getElementById("ActivityModalCloseButton")!.onclick = () => {
      ActivityModal.hide();
    };
    document.getElementById("ActivityModalCancelButton")!.onclick = () => {
      ActivityModal.hide();
    };
  },
});
const ActivityModalTitle = document.getElementById(
  "ActivityModalTitle",
) as HTMLHeadingElement;
const ActivityModal_NameInput = document.getElementById(
  "ActivityModalNameInput",
) as HTMLInputElement;
const ActivityModal_TypeInput = document.getElementById(
  "ActivityModalTypeInput",
) as HTMLInputElement;
const ActivityModalButton = document.getElementById(
  "ActivityModalButton",
) as HTMLButtonElement;
const ActivityModalDeleteButton = document.getElementById(
  "ActivityModalDeleteButton",
) as HTMLButtonElement;
const ActivityModalAddComponentButton = document.getElementById(
  "ActivityModalAddComponentButton",
) as HTMLButtonElement;

const ActivityComponentModal = new Modal(
  document.getElementById("ActivityComponentModal"),
  {
    closable: false,
    onShow: () => {
      document.getElementById("ActivityComponentModalCloseButton")!.onclick =
        () => {
          ActivityComponentModal.hide();
          ActivityModal.show();
        };
      document.getElementById("ActivityComponentModalCancelButton")!.onclick =
        () => {
          ActivityComponentModal.hide();
          ActivityModal.show();
        };
    },
  },
);
const ActivityComponentModalButton = document.getElementById(
  "ActivityComponentModalButton",
) as HTMLButtonElement;

const StudentActivityModal = new Modal(
  document.getElementById("StudentActivityModal"),
  {
    closable: false,
    onShow: () => {
      document.getElementById("StudentActivityModalCloseButton")!.onclick =
        () => {
          StudentActivityModal.hide();
        };
      document.getElementById("StudentActivityModalCancelButton")!.onclick =
        () => {
          StudentActivityModal.hide();
        };
    },
  },
);
const StudentActivityModalTitle = document.getElementById(
  "StudentActivityModalTitle",
) as HTMLHeadingElement;
const StudentActivityModalButton = document.getElementById(
  "StudentActivityModalButton",
) as HTMLButtonElement;

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
const DeleteModalText = document.getElementById(
  "DeleteModalText",
) as HTMLHeadingElement;
const DeleteModalButton = document.getElementById(
  "DeleteModalButton",
) as HTMLButtonElement;

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
const ErrorModalText = document.getElementById(
  "ErrorModalText",
) as HTMLHeadingElement;

// DOM INIT
document.addEventListener("DOMContentLoaded", () => {
  let token = sessionStorage.getItem("token") ?? "";

  const data = {
    request: "login",
    token: token,
  };

  $.ajax({
    type: "POST",
    url: Routes.VIEWRECORD_API,
    data: "session=" + JSON.stringify(data),
    success: function (response) {
      SiteSpinner.classList.add("hidden");
      ENABLE_CONSOLELOG &&
        console.log("Successful Response: ", JSON.parse(response) || response);
      getData();
    },
    error: function (xhr, status, error) {
      SiteSpinner.classList.remove("hidden");
      if (ENABLE_CONSOLELOG) {
        console.group("Token Errors:");
        console.error("(Error) XHR Status: ", xhr.status);
        console.error("(Error) XHR Text: ", xhr.responseText);
        console.error("(Error) Status: ", status);
        console.error("Error: ", error);
        console.groupEnd();
      }
      if (error) window.location.href = Routes.LOGIN_PAGE;
    },
  });
});

// INITS
function newActivityInit(record_id: string, component_id: string) {
  ENABLE_CONSOLELOG &&
    console.log("New Activity Init: ", { record_id, component_id });

  ActivityModalDeleteButton.classList.add("hidden");

  ActivityModalTitle.innerText = "Add a New Activity";
  ActivityModal_NameInput.value = "";
  ActivityModal_TypeInput.value = "";
  setActivityColor("amber");

  const ComponentList = document.getElementById(
    "ActivityComponentsTableBody",
  ) as HTMLTableSectionElement;

  ComponentList.innerHTML = "";

  ActivityModalAddComponentButton.onclick = () => {
    newActivityComponentInit();
  };

  ActivityModalButton.onclick = () => {
    ActivityModal.show();
    sendData("addActivity", {
      name: ActivityModal_NameInput.value,
      type: ActivityModal_TypeInput.value,
      record_id: record_id,
      component_id: component_id,
      color: getActivityColor(),
      components: getActivityComponents(),
    });
  };

  computeActivityComponents();

  ActivityModal.show();
}

function editActivityInit(
  record_id: string,
  component_id: string,
  activity: dts.InterfaceActivity,
  activity_id: string,
) {
  ENABLE_CONSOLELOG &&
    console.log("Edit Activity Init: ", {
      record_id,
      component_id,
      activity,
      activity_id,
    });

  ActivityModalDeleteButton.classList.add("hidden");

  ActivityModalTitle.innerText = `Edit Activity: ${activity.name}`;
  ActivityModal_NameInput.value = activity.name;
  ActivityModal_TypeInput.value = activity.type;
  setActivityColor(activity.color);

  const ComponentList = document.getElementById(
    "ActivityComponentsTableBody",
  ) as HTMLTableSectionElement;

  ComponentList.innerHTML = "";

  for (let component of activity.components) {
    insertNewActivityComponent(
      component.id,
      component.name,
      component.type,
      component.score,
      component.bonus,
    );
  }

  ActivityModalAddComponentButton.onclick = () => {
    newActivityComponentInit();
  };

  ActivityModalButton.onclick = () => {
    ActivityModal.show();
    sendData("updateActivity", {
      name: ActivityModal_NameInput.value,
      type: ActivityModal_TypeInput.value,
      record_id: record_id,
      component_id: component_id,
      activity_id: activity_id,
      color: getActivityColor(),
      components: getActivityComponents(),
    });
  };

  ActivityModalDeleteButton.onclick = () => {
    deleteActivityInit(component_id, activity_id, activity.name);
  };

  computeActivityComponents();

  ActivityModalDeleteButton.classList.remove("hidden");
  ActivityModal.show();
}

function deleteActivityInit(
  component_id: string,
  activity_id: string,
  activity_name: string,
) {
  ENABLE_CONSOLELOG &&
    console.log("Delete Activity Init: ", {
      component_id,
      activity_id,
      activity_name,
    });

  DeleteModalText.innerHTML = `
    Are you sure you want to delete '${activity_name}' activity from this component?<br>

    All scores of the students that have this activity will be deleted...
    
  `;

  DeleteModalButton.onclick = () => {
    DeleteModal.hide();
    ActivityModal.hide();
    sendData("deleteActivity", {
      component_id: component_id,
      activity_id: activity_id,
    });
  };

  DeleteModal.show();
}

// Activity Component
function newActivityComponentInit() {
  ActivityModal.hide();

  const Title = document.getElementById(
    "ActivityComponentModalTitle",
  ) as HTMLHeadingElement;
  const NameInput = document.getElementById(
    "ACModalNameInput",
  ) as HTMLInputElement;
  const TypeInput = document.getElementById(
    "ACModalTypeInput",
  ) as HTMLInputElement;
  const ScoreInput = document.getElementById(
    "ACModalScoreInput",
  ) as HTMLInputElement;
  const Checkbox = document.getElementById(
    "ACModalBonusCheckbox",
  ) as HTMLInputElement;
  Title.innerText = "Add a New Activity Component";
  NameInput.value = "";
  TypeInput.value = "";
  ScoreInput.value = "0";
  Checkbox.checked = false;

  ActivityComponentModalButton.onclick = () => {
    insertNewActivityComponent(
      null,
      NameInput.value,
      TypeInput.value,
      parseInt(ScoreInput.value),
      Checkbox.checked,
    );
  };
}

function editActivityComponentInit(id: string) {
  ENABLE_CONSOLELOG &&
    console.log("Edit Activity Component Init: ", {
      id,
    });

  ActivityModal.hide();

  const Title = document.getElementById(
    "ActivityComponentModalTitle",
  ) as HTMLHeadingElement;
  const NameInput = document.getElementById(
    "ACModalNameInput",
  ) as HTMLInputElement;
  const TypeInput = document.getElementById(
    "ACModalTypeInput",
  ) as HTMLInputElement;
  const ScoreInput = document.getElementById(
    "ACModalScoreInput",
  ) as HTMLInputElement;
  const Checkbox = document.getElementById(
    "ACModalBonusCheckbox",
  ) as HTMLInputElement;

  const RowData = document.querySelector(`tr[id="${id}"]`);

  Title.innerText = `Edit Activity Component: ${name}`;
  NameInput.value = RowData?.getAttribute("data-name") ?? "";
  TypeInput.value = RowData?.getAttribute("data-type") ?? "";
  ScoreInput.value = RowData?.getAttribute("data-score") ?? "0";
  Checkbox.checked = parseBool(RowData?.getAttribute("data-bonus")!);

  ActivityComponentModalButton.onclick = () => {
    editActivityComponentToTable(id);
  };

  ActivityComponentModal.show();
}

function editActivityComponentToTable(id: string) {
  const ComponentList = document.getElementById(
    "ActivityComponentsTableBody",
  ) as HTMLTableSectionElement;

  const Title = document.getElementById(
    "ActivityComponentModalTitle",
  ) as HTMLHeadingElement;
  const NameInput = document.getElementById(
    "ACModalNameInput",
  ) as HTMLInputElement;
  const TypeInput = document.getElementById(
    "ACModalTypeInput",
  ) as HTMLInputElement;
  const ScoreInput = document.getElementById(
    "ACModalScoreInput",
  ) as HTMLInputElement;
  const Checkbox = document.getElementById(
    "ACModalBonusCheckbox",
  ) as HTMLInputElement;

  const RowData = ComponentList.querySelector(`tr[id="${id}"]`);

  RowData?.setAttribute("data-id", id);
  RowData?.setAttribute("data-name", NameInput.value);
  RowData?.setAttribute("data-type", TypeInput.value);
  RowData?.setAttribute("data-score", ScoreInput.value);
  RowData?.setAttribute("data-bonus", Checkbox.checked ? "true" : "false");

  RowData!.querySelectorAll("td")[0].innerText = NameInput.value;
  RowData!.querySelectorAll("td")[1].innerText = TypeInput.value;
  RowData!.querySelectorAll("td")[2].innerText = ScoreInput.value;
  RowData!.querySelectorAll("td")[3].innerText = Checkbox.checked
    ? "Yes"
    : "No";

  computeActivityComponents();
  ActivityComponentModal.hide();
}

function editStudentActivity(
  record_id: string,
  activity: dts.InterfaceActivity,
  student: dts.InterfaceStudent,
  component_id: string,
) {
  ENABLE_CONSOLELOG &&
    console.log("Edit Student Activity Init: ", {
      record_id,
      activity,
      student,
      component_id,
    });

  const ActivityComponentList = document.getElementById(
    "StudentActivityTableBody",
  ) as HTMLTableSectionElement;

  ActivityComponentList.innerHTML = "";

  let componentScoreTotal = 0;
  let componentScoreTotalBonus = 0;
  for (let component of activity.components) {
    const ComponentRow = document.createElement("tr");
    ComponentRow.setAttribute("id", component.id);
    ComponentRow.setAttribute("data-id", component.id);
    ComponentRow.setAttribute("data-name", component.name);
    ComponentRow.setAttribute("data-type", component.type);
    ComponentRow.setAttribute("data-score", component.score.toString());
    ComponentRow.setAttribute(
      "data-bonus",
      parseBool(component.bonus).toString(),
    );

    let findStudentScore = 0;
    for (let activity of student.activities) {
      for (let activityComponents of activity.components) {
        if (activityComponents.id === component.id) {
          findStudentScore = activityComponents.score;
        }
      }
    }
    // console.log(findStudentScore);

    ComponentRow.innerHTML += `
      <td class='px-6 py-2'>${component.name}</td>
      <td class='px-6 py-2'>${component.type}</td>
      <td class='px-6 py-2 text-center'>
        <input 
          class='rounded'
          type='number'
          min='0'
          max='${component.score}'
          step='1'
          value='${findStudentScore}'
          oninput='this.value=Math.abs(this.value)'
        />
      </td>
      <td class='px-6 py-2 text-center'>${component.score}</td>
      <td class='px-6 py-2 text-center'>${
        parseBool(component.bonus.toString()) ? "Yes" : "No"
      }</td>
    `;

    componentScoreTotal += !parseBool(component.bonus.toString())
      ? (component.score as number)
      : 0;
    componentScoreTotalBonus += component.score as number;

    ActivityComponentList.appendChild(ComponentRow);
  }

  ActivityComponentList.querySelectorAll("tr td input").forEach((input) => {
    (input as HTMLInputElement).addEventListener("input", () => {
      let totalscore = 0;
      ActivityComponentList.querySelectorAll("tr td input").forEach((input) => {
        totalscore += parseInt((input as HTMLInputElement).value);
      });
      document.getElementById("StudentActivityStudentTotalScore")!.innerText =
        totalscore.toString();
    });
  });

  document.getElementById(
    "StudentActivityTotalScore",
  )!.innerText = `${componentScoreTotal} / ${componentScoreTotalBonus}`;

  StudentActivityModalButton.onclick = () => {
    StudentActivityModal.hide();

    // ENABLE_CONSOLELOG &&
    //   console.log("TEST: ", {
    //     record_id: record_id,
    //     component_id: component_id,
    //     student_id: student.id,
    //     activity_id: activity.id,
    //     activites: getStudentActivityComponentScores(),
    //   });

    sendData("updateStudentActivity", {
      record_id: record_id,
      component_id: component_id,
      student_id: student.id,
      activity_id: activity.id,
      activities: getStudentActivityComponentScores(),
    });
  };

  StudentActivityModal.show();
}

// AJAX
function sendData(title: string, data: any) {
  ActionSpinner.classList.remove("hidden");

  let sendData = {
    token: sessionStorage.getItem("token"),
    data: data,
  };

  ENABLE_CONSOLELOG && console.log(`Send Data (${title}): `, sendData);

  $.ajax({
    type: "POST",
    url: Routes.VIEWRECORD_API,
    data: `${title}=` + JSON.stringify(sendData),
    success: function (response) {
      ActionSpinner.classList.add("hidden");
      ENABLE_CONSOLELOG &&
        console.log(
          `Successful '${title}' response: `,
          JSON.parse(response) || response,
        );
      ActivityComponentModal.hide();
      ActivityModal.hide();
      getData();
    },
    error: function (xhr, status, error) {
      ActionSpinner.classList.add("hidden");
      if (ENABLE_CONSOLELOG) {
        console.group("Send Data Error:");
        console.error("(Error) XHR Status: ", xhr.status);
        console.error("(Error) XHR Text: ", xhr.responseText);
        console.error("(Error) Status: ", status);
        console.error("Error: ", error);
        console.groupEnd();
      }
      if (xhr.status === 403) window.location.href = Routes.LOGIN_PAGE;

      let data = JSON.parse(xhr.responseText);
      ErrorModalText.innerHTML = `Error:<br> ${data.title}<br><br> ${
        data.message || "Internal Server Error"
      }`;
      ErrorModal.show();
    },
  });
}

function getData() {
  ActionSpinner.classList.remove("hidden");

  let components: any = [];

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const id = params.get("v");

  ENABLE_CONSOLELOG && console.log("URL 'v': ", id);

  let data = {
    token: sessionStorage.getItem("token"),
    id: id?.toUpperCase().replace(/_/g, "-"),
  };

  $.ajax({
    type: "GET",
    url: Routes.VIEWRECORD_API,
    data: "getData=" + JSON.stringify(data),
    success: function (response) {
      ENABLE_CONSOLELOG &&
        console.log(
          "Successful GET DATA Response: ",
          JSON.parse(response) || response,
        );
      ClassRecord_Title.innerText = JSON.parse(response).data.name;
      ClassRecord_Title.classList.add(
        `text-${JSON.parse(response).data.color}-500`,
      );
      ClassRecord_Section.innerText = JSON.parse(response).data.section_name;
      ClassRecord_Section.classList.add(
        `text-${JSON.parse(response).data.color}-400`,
      );

      ClassRecord_SY.innerText = `S.Y. ${dateFormatter(
        JSON.parse(response).data.syStart,
      )} - ${dateFormatter(JSON.parse(response).data.syEnd)}`;
      populateComponentList(JSON.parse(response).data);
    },
    error: function (xhr, status, error) {
      if (ENABLE_CONSOLELOG) {
        console.group("Get Data Error:");
        console.error("(Error) XHR Status: ", xhr.status);
        console.error("(Error) XHR Text: ", xhr.responseText);
        console.error("(Error) Status: ", status);
        console.error("Error: ", error);
        console.groupEnd();
      }
      if (xhr.status === 403) window.location.href = Routes.LOGIN_PAGE;
    },
  });

  ENABLE_CONSOLELOG && console.log("GET Components Data: ", data);

  ActionSpinner.classList.add("hidden");
  return components;
}

// DOM CREATION
function insertNewActivityComponent(
  id: string | null,
  name: string,
  type: string,
  score: number | string,
  bonus: boolean,
) {
  if (!ActivityModal.isVisible()) ActivityModal.show();

  ENABLE_CONSOLELOG &&
    console.log("Insert New Activity Component: ", {
      id,
      name,
      type,
      score,
      bonus,
    });

  const TableBody = document.getElementById(
    "ActivityComponentsTableBody",
  ) as HTMLTableSectionElement;

  const Row = document.createElement("tr");

  Row.id = id || generateElementRandomId();
  Row.setAttribute("data-id", Row.id);
  Row.setAttribute("data-name", name);
  Row.setAttribute("data-type", type);
  Row.setAttribute("data-score", score.toString());
  Row.setAttribute("data-bonus", parseBool(bonus.toString()).toString());

  Row.innerHTML = `
    <td class='p-2'>${name}</td>
    <td class='p-2'>${type}</td>
    <td class='p-2 text-center'>${score}</td>
    <td class='p-2 text-center'>${
      parseBool(bonus.toString()) ? "Yes" : "No"
    }</td>
  `;

  const RowButtons = document.createElement("td");
  RowButtons.classList.add("p-2", "flex", "flex-row", "gap-2", "justify-end");

  const EditButton = document.createElement("button");
  EditButton.classList.add(
    "px-3",
    "py-2",
    "text-white",
    "bg-blue-400",
    "hover:bg-blue-600",
    "rounded",
  );
  EditButton.innerHTML = "<i class='fa-solid fas fa-cog'></i>";

  EditButton.onclick = () => {
    editActivityComponentInit(Row.id);
  };

  const DeleteButton = document.createElement("button");
  DeleteButton.classList.add(
    "px-3",
    "py-2",
    "text-white",
    "bg-red-400",
    "hover:bg-red-600",
    "rounded",
  );
  DeleteButton.innerHTML = "<i class='fa-solid fas fa-trash'></i>";

  DeleteButton.onclick = () => {
    deleteActivityComponent(Row.id, name);
  };

  RowButtons.appendChild(EditButton);
  RowButtons.appendChild(DeleteButton);

  Row.appendChild(RowButtons);
  TableBody.appendChild(Row);

  computeActivityComponents();
}

function deleteActivityComponent(id: string, name: string) {
  const TableBody = document.getElementById(
    "ActivityComponentsTableBody",
  ) as HTMLTableSectionElement;

  DeleteModalText.innerText = `Are you sure you want to delete '${name}' component?`;

  DeleteModalButton.onclick = () => {
    TableBody.querySelectorAll("tr").forEach((row) => {
      if (row.getAttribute("data-id") === id) {
        row.remove();
      }
    });
    DeleteModal.hide();
    computeActivityComponents();
  };

  DeleteModal.show();
}

function populateComponentList(record: dts.InterfaceRecord) {
  const ComponentsList = document.getElementById(
    "ComponentsList",
  ) as HTMLElement;

  ComponentsList.innerHTML = "";

  // Components
  for (let component of record.components) {
    const NewComponent = document.createElement("div");
    NewComponent.classList.add("w-max");
    const Header = document.createElement("header");
    Header.classList.add(
      "w-full",
      `bg-${record.color}-500`,
      "text-white",
      "p-5",
      "flex",
      "flex-row",
      "gap-2",
      "items-center",
      "rounded-t",
    );

    Header.innerHTML = `
      <div class='w-max px-2 text-md text-${record.color}-500 text-center bg-white rounded-full font-medium'>
        ${component.score}%
      </div>
      <h1 class='font-bold flex-grow'>${component.name}</h1>
    `;

    const ViewTableButton = document.createElement("button");
    ViewTableButton.classList.add(
      "px-3",
      "py-1",
      "font-medium",
      "text-sm",
      "bg-inherit",
      "hover:bg-white",
      `hover:text-${record.color}-500`,
      "rounded",
      "whitespace-nowrap",
    );
    ViewTableButton.innerHTML = `
      Hide Table <i class='fa-solid fa-table-columns ml-2'></li>
    `;

    const Table = document.createElement("table");
    Table.classList.add(
      "w-full",
      "border-2",
      `border-${record.color}-500`,
      "rounded-b",
      "bg-white",
      "whitespace-nowrap",
    );
    const TableHeader = document.createElement("thead");
    TableHeader.innerHTML = `
      <tr class='uppercase bg-${record.color}-500 font-semibold text-white'>
        <th rowspan='2' scope='col' class='px-6 py-3 align-bottom'>ID</th>
        <th rowspan='2' scope='col' class='px-6 py-3 align-bottom'>Gender</th>
        <th rowspan='2' scope='col' class='px-6 py-3 align-bottom'>Last Name</th>
        <th rowspan='2' scope='col' class='px-6 py-3 align-bottom'>First Name</th>
        <th colspan='${
          component.activities.length + 1
        }' scope='col' class='px-6 py-3 align-bottom'>Activities</th>
        <th scope='col' class='px-6 py-3 text-center'>Total Score</th>
        <th scope='col' class='px-6 py-3 text-center'>Percentage Score</th>
        <th scope='col' class='px-6 py-3 text-center'>Weighted Score</th>
      </tr>
     `;
    const TableHeaderRow = document.createElement("tr");
    TableHeaderRow.classList.add(
      "font-medium",
      "text-center",
      `bg-${record.color}-100`,
    );
    for (let activity of component.activities) {
      const TableHead = document.createElement("th");
      TableHead.classList.add(
        "px-6",
        "py-3",
        "border-x",
        "border-x-neutral-400",
      );
      TableHead.setAttribute("scope", "col");

      const Button = document.createElement("button");
      Button.classList.add(
        "group",
        "w-11",
        "h-11",
        "border",
        `border-${activity.color}-400`,
        "text-white",
        `bg-${activity.color}-400`,
        `hover:bg-${activity.color}-500`,
        "rounded",
      );
      Button.innerHTML = `
        <span class='group-hover:hidden'>
        ${activity.components.reduce((sum, component) => {
          if (parseBool(component.bonus.toString())) {
            return sum + 0;
          }
          return sum + parseInt(component.score as string) || 0;
        }, 0)}</span>
        <span class='hidden group-hover:inline'>
          <i class='fa-solid fa-pen'></i>
        </span>
      `;

      Button.onclick = () => {
        editActivityInit(record.id, component.id, activity, activity.id);
      };

      TableHead.appendChild(Button);
      TableHeaderRow.appendChild(TableHead);
    }

    const NewActivityHead = document.createElement("th");
    NewActivityHead.setAttribute("scope", "col");
    NewActivityHead.classList.add(
      "px-6",
      "py-3",
      "border-x",
      "border-x-neutral-400",
    );

    const NewActivityButton = document.createElement("button");
    NewActivityButton.classList.add(
      "border-2",
      "border-green-400",
      "text-white",
      "bg-green-400",
      "hover:bg-green-600",
      "hover:border-green-600",
      "rounded",
      "py-2",
      "px-3",
    );

    NewActivityButton.innerHTML = `<i class='fa-solid fa-plus'></i>`;

    NewActivityButton.onclick = () => {
      newActivityInit(record.id, component.id);
    };

    NewActivityHead.appendChild(NewActivityButton);
    TableHeaderRow.appendChild(NewActivityHead);

    let totalScore = 0;
    for (let activity of component.activities) {
      totalScore += activity.components.reduce((sum, component) => {
        if (parseBool(component.bonus.toString())) {
          return sum + 0;
        }
        return sum + parseInt(component.score as string) || 0;
      }, 0);
    }

    TableHeaderRow.insertAdjacentHTML(
      "beforeend",
      `
        <th scope='col' class='px-6 py-3 border-x border-x-neutral-400 font-bold text-lg'>
          ${totalScore}
        </th>
        <th scope="col" class="py-3 border-x border-x-neutral-400 font-bold text-lg">
          100 %
        </th>
        <th scope="col" class="py-3 border-x border-x-neutral-400 font-bold text-lg">
          ${component.score} %
        </th>
      `,
    );

    TableHeader.appendChild(TableHeaderRow);

    const TableBody = document.createElement("tbody");
    TableBody.classList.add("text-md", "text-neutral-500", "font-medium");

    let change_bg = false;
    for (let student of record.students) {
      const TableBodyRow = document.createElement("tr");
      change_bg && TableBodyRow.classList.add(`bg-${record.color}-100`);

      let genderData =
        "<td class='px-6 py-3 text-neutral-500'><i class='fa-solid fa-venus-mars'></i> Other </td>";
      if (student.gender.toUpperCase() === "MALE")
        genderData =
          "<td class='px-6 py-3 text-blue-500'><i class='fa-solid fa-mars'></i> Male </td>";
      if (student.gender.toUpperCase() === "FEMALE")
        genderData =
          "<td class='px-6 py-3 text-pink-500'><i class='fa-solid fa-venus'></i> Female </td>";

      TableBodyRow.innerHTML = `
        <td class='px-6 py-3 font-mono text-neutral-400'>${student.id}</td>
        ${genderData}
        <td class='px-6 py-3 uppercase font-medium text-black'>${student.last_name}</td>
        <td class='px-6 py-3'>${student.first_name}</td>
      `;

      let studentTotalScore = 0;
      for (let activity of component.activities) {
        const TableData = document.createElement("td");
        TableData.classList.add(
          "px-6",
          "py-3",
          "border-x",
          "border-x-neutral-400",
          "justify-center",
        );

        const TableDataButton = document.createElement("button");
        TableDataButton.classList.add(
          "group",
          "w-11",
          "h-11",
          "border",
          `border-neutral-400`,
          `text-neutral-400`,
          "rounded",
          `hover:bg-neutral-400`,
          "hover:text-white",
        );

        let studentScore = 0;
        // for (let studentActivity of student.activities) {
        //   if (studentActivity.id === activity.id) {
        //     studentScore += parseInt(studentActivity.score as string) || 0;
        //   }
        // }

        for (let studentActivity of student.activities) {
          if (studentActivity.id === activity.id) {
            studentActivity.components.forEach((component) => {
              studentScore += (component.score as number) || 0;
            });
          }
        }

        TableDataButton.insertAdjacentHTML(
          "beforeend",
          `
              <span class='group-hover:hidden'>${studentScore}</span>
              <span class='hidden group-hover:inline'><i class='fa-solid fa-pen'></i></span>
          `,
        );

        TableDataButton.onclick = () => {
          editStudentActivity(record.id, activity, student, component.id);
        };

        TableData.appendChild(TableDataButton);
        TableBodyRow.appendChild(TableData);
        studentTotalScore += studentScore;
      }
      let getActivityTotalScore = component.activities.reduce(
        (sum, activity) =>
          sum +
          activity.components.reduce((sum, component) => {
            if (parseBool(component.bonus.toString())) {
              return sum + 0;
            }
            return sum + parseInt(component.score as string) || 0;
          }, 0),
        0,
      );

      TableBodyRow.insertAdjacentHTML(
        "beforeend",
        `
        <td class='px-6 py-3 text-center border-x border-x-neutral-400'></td>
        <td class='px-6 py-3 text-center border-x border-x-neutral-400 font-semibold'>
        ${studentTotalScore} / ${getActivityTotalScore}
        </td>
        <td class='px-6 py-3 text-center border-x border-x-neutral-400 font-semibold'>
        ${(studentTotalScore / getActivityTotalScore) * 100 || 0} %
        </td>
        <td class='px-6 py-3 text-center border-x border-x-neutral-400 font-semibold'>
        ${
          LinearScale(
            0,
            100,
            0,
            parseInt(component.score as string) || 0,
            (studentTotalScore / getActivityTotalScore) * 100 || 0,
          ) || 0
        } %
        </td>
      `,
      );

      TableBody.appendChild(TableBodyRow);
      change_bg = !change_bg;
    }

    // APPEND
    ViewTableButton.onclick = () => {
      Table.classList.toggle("hidden");
      if (Table.classList.contains("hidden")) {
        ViewTableButton.innerHTML = `
         Show Table <i class='fa-solid fa-table-columns ml-2'></li>
         `;
      } else {
        ViewTableButton.innerHTML = `
         Hide Table <i class='fa-solid fa-table-columns ml-2'></li>
         `;
      }
    };

    Header.appendChild(ViewTableButton);
    Table.appendChild(TableHeader);
    Table.appendChild(TableBody);
    NewComponent.appendChild(Header);
    NewComponent.appendChild(Table);

    ComponentsList.appendChild(NewComponent);
  }

  // Create Final Grade Component

  let FinalGradeTotal = 0;

  for (let component of record.components) {
    FinalGradeTotal += parseInt(component.score as string) || 0;
  }

  const FG_Component = document.createElement("div");
  FG_Component.classList.add("w-max");

  const FG_Header = document.createElement("header");
  FG_Header.classList.add(
    "w-full",
    "bg-gray-500",
    "text-white",
    "p-5",
    "flex",
    "flex-row",
    "gap-2",
    "items-center",
    "rounded-t",
  );

  FG_Header.innerHTML = `
    <div class='w-max px-2 text-md text-gray-500 text-center bg-white rounded-full font-medium'>
      ${FinalGradeTotal} %
    </div>
    <h1 class='font-bold flex-grow'>Final Grade</h1>
  `;

  const FG_HeaderButton = document.createElement("button");
  FG_HeaderButton.classList.add(
    "px-3",
    "py-1",
    "font-medium",
    "text-sm",
    "bg-inherit",
    "hover:bg-white",
    "hover:text-gray-500",
    "rounded",
    "whitespace-nowrap",
  );
  FG_HeaderButton.innerHTML = `
    Hide Table <i class='fa-solid fa-table-columns ml-2'></li>
  `;

  const FG_Table = document.createElement("table");
  FG_Table.classList.add(
    "w-full",
    "table-auto",
    "border-2",
    "border-gray-500",
    "rounded",
    "bg-white",
    "whitespace-nowrap",
  );

  const FG_TableHeader = document.createElement("thead");
  FG_TableHeader.innerHTML = `
    <tr class='bg-gray-500 text-white uppercase'>
      <th rowspan='3' scope='col' class='px-6 py-3 align-bottom text-center'>ID</th>
      <th rowspan='3' scope='col' class='px-6 py-3 align-bottom'>Gender</th>
      <th rowspan='3' scope='col' class='px-6 py-3 align-bottom'>Last Name</th>
      <th rowspan='3' scope='col' class='px-6 py-3 align-bottom'>First Name</th>
      <th colspan='${record.components.length}' scope='col' class='px-6 py-3 align-bottom'>Components</th>
      <th colspan='3' scope='col' class='px-6 py-3 align-bottom'></th>
    </tr>
    
  `;
  let FG_TableHeaderRow = document.createElement("tr");
  FG_TableHeaderRow.classList.add(
    "bg-gray-100",
    "text-gray-500",
    "text-center",
  );

  for (let component of record.components) {
    FG_TableHeaderRow.innerHTML += `
      <th scope='col' class='px-6 py-2 border-x border-x-neutral-400'>${component.name}</th>
    `;
  }

  FG_TableHeaderRow.innerHTML += `
      <th scope='col' class='px-6 py-2 bg-gray-500 text-white uppercase'>Total Percentage</th>
      <th scope='col' class='px-6 py-2 bg-gray-500 text-white uppercase'>Transmutated</th>
      <th scope='col' class='px-6 py-2 bg-gray-500 text-white uppercase'></th>
  `;

  FG_TableHeader.appendChild(FG_TableHeaderRow);

  FG_TableHeaderRow = document.createElement("tr");

  for (let component of record.components) {
    FG_TableHeaderRow.innerHTML += `
      <th scope='col' class='px-6 py-2 border-x border-x-neutral-400'>${component.score} %</th>
    `;
  }

  FG_TableHeaderRow.innerHTML += `
      <th scope='col' class='px-6 py-2 border-x border-x-neutral-400 text-black text-xl'>
      ${FinalGradeTotal} %
      </th>
      <th scope='col' class='px-6 py-2 border-x border-x-neutral-400 text-black text-2xl'>
        <span class='text-red-400'>${record.transmutation.lowest}% </span>
        <i class='fa-solid fa-right-long'></i>
        <span class='text-green-400'>${record.transmutation.passing}% </span>
        <i class='fa-solid fa-right-long'></i>
        <span class='text-blue-400'>${record.transmutation.highest}% </span>
      </th>
      <th scope='col' class='px-6 py-2 bg-gray-500 text-white uppercase'>Remarks</th>
  `;

  FG_TableHeader.appendChild(FG_TableHeaderRow);

  FG_HeaderButton.onclick = () => {
    FG_Table.classList.toggle("hidden");
    if (FG_Table.classList.contains("hidden")) {
      FG_HeaderButton.innerHTML = `
         Show Table <i class='fa-solid fa-table-columns ml-2'></li>
         `;
    } else {
      FG_HeaderButton.innerHTML = `
         Hide Table <i class='fa-solid fa-table-columns ml-2'></li>
         `;
    }
  };

  const FG_TableBody = document.createElement("tbody");
  FG_TableBody.classList.add("text-md", "text-neutral-500", "font-medium");

  let change_bg = true;
  for (let student of record.students) {
    const FG_TableBodyRow = document.createElement("tr");
    change_bg && FG_TableBodyRow.classList.add(`bg-gray-100`);

    let genderDisplay =
      "<td class='px-6 py-3 text-neutral-500'><i class='fa-solid fa-venus-mars'></i> Other </td>";
    if (student.gender.toUpperCase() === "MALE")
      genderDisplay =
        "<td class='px-6 py-3 text-blue-500'><i class='fa-solid fa-mars'></i> Male </td>";
    if (student.gender.toUpperCase() === "FEMALE")
      genderDisplay =
        "<td class='px-6 py-3 text-pink-500'><i class='fa-solid fa-venus'></i> Female </td>";

    FG_TableBodyRow.innerHTML = `
      <td class='px-6 py-3 font-mono text-neutral-400'>${student.id}</td>
      ${genderDisplay}
      <td class='px-6 py-3 uppercase font-medium text-black'>${student.last_name}</td>
      <td class='px-6 py-3'>${student.first_name}</td>
    `;

    let componentScoreList = [];

    for (let component of record.components) {
      let componentSum = 0;

      for (let activity of component.activities) {
        for (let activityComponent of activity.components) {
          if (!activityComponent.bonus)
            componentSum += parseInt(activityComponent.score as string) || 0;
        }
      }

      let studentSum = 0;
      let collectRecordActivities: Array<string> = [];
      component.activities.forEach((activity) => {
        activity.components.forEach((component) => {
          collectRecordActivities.push(component.id);
        });
      });
      for (let activity of student.activities) {
        for (let activityComponent of activity.components) {
          if (collectRecordActivities.includes(activityComponent.id)) {
            studentSum += activityComponent.score || 0;
          }
        }
      }

      let totalWeighted =
        LinearScale(
          0,
          100,
          0,
          parseInt(component.score as string) || 0,
          (studentSum / componentSum) * 100,
        ) || 0;

      componentScoreList.push(totalWeighted);
    }

    for (let score of componentScoreList) {
      FG_TableBodyRow.innerHTML += `
        <td class='px-6 py-3 border-x border-x-neutral-400 text-center text-gray-400'>${score.toFixed(
          2,
        )}%</td>
      `;
    }

    // ENABLE_CONSOLELOG && console.log(componentScoreList);

    let totalStudentPercentage = componentScoreList.reduce(
      (sum, score) => sum + score,
      0,
    );

    let componentTotalPercentage = record.components.reduce(
      (sum, component) => sum + parseInt(component.score as string) || 0,
      0,
    );
    let percentageTransmutated =
      LinearScale(
        0,
        componentTotalPercentage,
        record.transmutation.lowest,
        record.transmutation.highest,
        totalStudentPercentage,
      ) || 0;

    let studentRemark = "<span class='text-red-400 uppercase'>Failed</span>";
    if (percentageTransmutated >= record.transmutation.passing) {
      studentRemark = "<span class='text-green-400 uppercase'>Passed</span>";
    }

    FG_TableBodyRow.innerHTML += `
      <td class='px-6 py-3 border-x border-x-neutral-400 text-center text-gray-400 text-lg'>
        ${totalStudentPercentage.toFixed(2)} %
      </td>
      <td class='px-6 py-3 border-x border-x-neutral-400 text-center text-gray-400 text-xl'>
        ${percentageTransmutated.toFixed(2)} %
      </td>
      <td class='px-6 py-3 border-x border-x-neutral-400 text-center  text-xl'>
        ${studentRemark}
      </td>
    `;

    FG_TableBody.appendChild(FG_TableBodyRow);

    change_bg = !change_bg;
  }

  FG_Header.appendChild(FG_HeaderButton);

  FG_Component.appendChild(FG_Header);

  FG_Table.appendChild(FG_TableHeader);
  FG_Table.appendChild(FG_TableBody);
  FG_Component.appendChild(FG_Table);

  ComponentsList.appendChild(FG_Component);
}

// OTHER FUNCTIONS

function computeActivityComponents() {
  const AC_TableBody = document.getElementById(
    "ActivityComponentsTableBody",
  ) as HTMLTableSectionElement;
  const AC_TotalScore = document.getElementById(
    "ActivityComponentsTotalScore",
  ) as HTMLTableCellElement;

  let sum = 0;
  let sumbonus = 0;
  AC_TableBody.querySelectorAll("tr").forEach((row) => {
    if (row.getAttribute("data-score")) {
      sumbonus += parseInt(row.getAttribute("data-score") as string);
      if (!parseBool(row.getAttribute("data-bonus") as string)) {
        sum += parseInt(row.getAttribute("data-score") as string);
      }
    }
  });

  AC_TotalScore.innerText = `${sumbonus} / ${sum}`;
}

function getActivityComponents() {
  const AC_TableBody = document.getElementById(
    "ActivityComponentsTableBody",
  ) as HTMLTableSectionElement;
  let data: Array<{
    id: string;
    name: string;
    type: string;
    score: number;
    bonus: boolean;
  }> = [];
  AC_TableBody.querySelectorAll("tr").forEach((row) => {
    data.push({
      id: row.getAttribute("data-id") as string,
      name: row.getAttribute("data-name") as string,
      type: row.getAttribute("data-type") as string,
      score: parseInt(row.getAttribute("data-score")!),
      bonus: parseBool(row.getAttribute("data-bonus")!),
    });
  });

  return data;
}

function getStudentActivityComponentScores() {
  const TableBody = document.getElementById(
    "StudentActivityTableBody",
  ) as HTMLTableSectionElement;

  let data: Array<{
    component_id: string;
    student_score: number;
  }> = [];

  TableBody.querySelectorAll("tr").forEach((row) => {
    let findInput = row.querySelectorAll("td input");
    let score = 0;
    findInput.forEach((input) => {
      score = parseInt((input as HTMLInputElement).value);
    });
    data.push({
      component_id: row.getAttribute("data-id") as string,
      student_score: score,
    });
  });

  return data;
}

function LinearScale(
  min: number,
  max: number,
  start: number,
  end: number,
  x: number,
) {
  return start + (end - start) * ((x - min) / (max - min));
}

function dateFormatter(newdate: Date) {
  newdate = new Date(newdate);
  let dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return dateFormatter.format(newdate);
}

function setActivityColor(color: string) {
  ActivityColorRadio.forEach((radioButton) => {
    radioButton.checked = false;

    if (radioButton.value === color) {
      radioButton.checked = true;

      ActivityThemeButton.classList.forEach((className) => {
        if (className.startsWith("bg-")) {
          ActivityThemeButton.classList.remove(className);
        }
      });

      ActivityThemeButton.classList.add(`bg-${color}-500`);
    }
  });
}

function getActivityColor() {
  let color = "";
  ActivityColorRadio.forEach((radioButton) => {
    if (radioButton.checked) {
      color = radioButton.value;
    }
  });

  return color;
}

function generateElementRandomId() {
  const prefix = "element";
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${randomString}`;
}

function parseBool(value: string | boolean) {
  if (typeof value === "boolean") {
    return value; // If the value is already a boolean, return it as is
  }
  if (typeof value === "string") {
    // Convert common string representations of boolean values
    const lowerCaseValue = value.toLowerCase();
    if (
      lowerCaseValue === "true" ||
      lowerCaseValue === "1" ||
      lowerCaseValue === "yes"
    ) {
      return true;
    }
    if (
      lowerCaseValue === "false" ||
      lowerCaseValue === "0" ||
      lowerCaseValue === "no"
    ) {
      return false;
    }
  }
  // Return false for any other non-boolean values
  return false;
}
