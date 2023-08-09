import * as Routes from "../../scripts/routes.js";
// @ts-ignore
import { Modal } from "flowbite";

// CONSOLE LOG OPTION
const ENABLE_CONSOLELOG = true;

// SPINNERS
const SiteSpinner = document.getElementById("Site-Spinner") as HTMLDivElement;
const ActionSpinner = document.getElementById(
  "Action-Spinner",
) as HTMLDivElement;

// BUTTONS
const ExitButton = document.getElementById("ExitButton") as HTMLButtonElement;
ExitButton.onclick = () => (window.location.href = Routes.CLASSRECORDS_PAGE);

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
const ErrorModal = new Modal(document.getElementById("ErrorModal"), {
  closable: false,
  onShow: () => {
    document.getElementById("ErrorModalCloseButton")!.onclick = () => {
      ErrorModal.hide();
    };
    document.getElementById("ErrorModalCancelButton")!.onclick = () => {
      ErrorModal.hide();
    };
  },
});

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
    console.log("New Activity Init: ", record_id, component_id);

  ActivityModal.show();
}

interface InterfaceActivity {
  id: string;
  name: string;
  type: string;
  color: string;
  components: [
    {
      id: string;
      name: string;
      type: string;
      score: number;
      bonus: boolean;
    },
  ];
}
function editActivityInit(
  record_id: string,
  component_id: string,
  activity: InterfaceActivity,
) {
  ENABLE_CONSOLELOG &&
    console.log("Edit Activity Init: ", { record_id, component_id, activity });
}

interface InterfaceStudent {
  id: string;
  gender: string;
  last_name: string;
  first_name: string;
  activities: [
    {
      id: string;
      component_id: string;
      score: number;
    },
  ];
}
function editStudentActivity(
  record_id: string,
  activity: InterfaceActivity,
  student: InterfaceStudent,
  component_id: string,
) {
  ENABLE_CONSOLELOG &&
    console.log("Edit Student Activity Init: ", {
      record_id,
      activity,
      student,
      component_id,
    });
}

// AJAX
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
        console.log("Successful Response: ", JSON.parse(response) || response);

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
interface InterfaceRecord {
  id: string;
  name: string;
  section_id: string;
  section_name: string;
  syStart: string;
  syEnd: string;
  color: string;
  transmutation: {
    id: string;
    name: string;
    lowest: number;
    passing: number;
    highest: number;
  };
  components: [
    {
      id: string;
      name: string;
      order_no: number;
      score: number;
      activities: [
        {
          id: string;
          name: string;
          type: string;
          color: string;
          components: [
            {
              id: string;
              name: string;
              type: string;
              score: number;
              bonus: boolean;
            },
          ];
        },
      ];
    },
  ];
  students: [
    {
      id: string;
      gender: string;
      last_name: string;
      first_name: string;
      activities: [
        {
          id: string;
          component_id: string;
          score: number;
        },
      ];
    },
  ];
}
function populateComponentList(record: InterfaceRecord) {
  const ComponentsList = document.getElementById(
    "ComponentsList",
  ) as HTMLElement;

  ComponentsList.innerHTML = "";

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
      "border",
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
        ${activity.components.reduce(
          (sum, component) => sum + component.score,
          0,
        )}</span>
        <span class='hidden group-hover:inline'>
          <i class='fa-solid fa-pen'></i>
        </span>
      `;

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
      "text-green-400",
      "hover:text-white",
      "hover:bg-green-400",
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
      totalScore += activity.components.reduce(
        (sum, component) => sum + component.score,
        0,
      );
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
        for (let studentActivity of student.activities) {
          if (studentActivity.id === activity.id) {
            studentScore += studentActivity.score;
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
          editStudentActivity(record.id, activity, student, activity.id);
        };

        TableData.appendChild(TableDataButton);
        TableBodyRow.appendChild(TableData);
        studentTotalScore += studentScore;
      }
      let getActivityTotalScore = component.activities.reduce(
        (sum, activity) =>
          sum +
          activity.components.reduce(
            (sum, component) => sum + component.score,
            0,
          ),
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
            component.score,
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
}

// OTHER FUNCTIONS

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
