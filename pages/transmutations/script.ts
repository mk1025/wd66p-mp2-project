import * as Routes from "../../scripts/routes";
import { LinearScale } from "../../scripts/math";

import { CONSOLE_LOG } from "../../scripts/env";
import * as DOM from "../../scripts/dom";

import {
  DOMLoadResponseData,
  RequestResponse,
  Transmutation,
  Request,
  AJAXMethods,
} from "./script.d";

import {
  PROFILE_FIRSTNAME,
  PROFILE_LASTNAME,
  PROFILE_PHOTO,
  // Buttons
  NEW_TRANSMUTATION_BUTTON,
  LOGOUT_BUTTON,
  // Modals
  TRANSMUTATION_MODAL,
  DELETE_MODAL,
  ERROR_MODAL,
  // Other
  TRANSMUTATION_LIST,
} from "./dom";

// DOM LOAD
document.addEventListener("DOMContentLoaded", function () {
  const data = {
    token: sessionStorage.getItem("token") ?? "",
  };

  $.ajax({
    type: "POST",
    url: Routes.SESSIONS_API,
    data: "session=" + JSON.stringify(data),

    success: function (response) {
      CONSOLE_LOG &&
        console.log("Successful Response: ", JSON.parse(response) || response);
      DOM.SPINNER.classList.add("hidden");

      let data: DOMLoadResponseData = JSON.parse(response).data;
      PROFILE_FIRSTNAME.innerText = data.user.firstName || "???";
      PROFILE_LASTNAME.innerText = data.user.lastName || "???";
      PROFILE_PHOTO.setAttribute("src", "../../api/" + data.user.imagePath);
      getList();
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
      if (xhr.status === 403) window.location.href = Routes.LOGIN_PAGE;
    },
  });
});

// BUTTONS
NEW_TRANSMUTATION_BUTTON.addEventListener("click", NewTransmutationInit);
LOGOUT_BUTTON.addEventListener("click", function () {
  $.ajax({
    type: "POST",
    url: Routes.SESSIONS_API,
    data:
      "logout=" + JSON.stringify({ token: sessionStorage.getItem("token") }),
    success: function (response) {
      CONSOLE_LOG &&
        console.log("Successful Response: ", JSON.parse(response) || response);
      sessionStorage.removeItem("token");
      window.location.href = Routes.LOGIN_PAGE;
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
      if (xhr.status === 403) window.location.href = Routes.LOGIN_PAGE;
    },
  });
});

//
function NewTransmutationInit() {
  CONSOLE_LOG && console.log("New Transmutation Init");
  TRANSMUTATION_MODAL.Title!.innerText = "Add a New Transmutation";

  const Displays = TRANSMUTATION_MODAL.Displays!;
  const Inputs = TRANSMUTATION_MODAL.Inputs!;

  Inputs.Name.value = "";

  Displays.Lowest.innerText = "0";
  Inputs.Lowest.value = "60";

  Displays.Passing.innerText = "50";
  Inputs.Passing.value = "75";

  Displays.Highest.innerText = "100";
  Inputs.Highest.value = "100";

  scaleInputs();

  TRANSMUTATION_MODAL.Button!.onclick = () => {
    TRANSMUTATION_MODAL.Modal.hide();
    SendData("store", "POST", {
      name: Inputs.Name.value,
      lowest: parseInt(Inputs.Lowest.value),
      passing: parseInt(Inputs.Passing.value),
      highest: parseInt(Inputs.Highest.value),
    });
  };

  TRANSMUTATION_MODAL.Modal.show();
}

function EditTransmutationInit(transmutation: Transmutation) {
  CONSOLE_LOG && console.log("Edit Transmutation Init: ", transmutation);

  TRANSMUTATION_MODAL.Title!.innerText = "Edit Transmutation";

  const Displays = TRANSMUTATION_MODAL.Displays!;
  const Inputs = TRANSMUTATION_MODAL.Inputs!;

  Inputs.Name.value = transmutation.name;

  Inputs.Lowest.value = transmutation.lowest.toString();
  Displays.Lowest.innerText = "0";

  Inputs.Passing.value = transmutation.passing.toString();
  Displays.Passing.innerText = LinearScale(
    transmutation.lowest,
    transmutation.highest,
    0,
    100,
    transmutation.passing,
  )
    .toFixed(2)
    .toString();

  Inputs.Highest.value = transmutation.highest.toString();
  Displays.Highest.innerText = "100";

  scaleInputs();

  TRANSMUTATION_MODAL.Button!.onclick = () => {
    TRANSMUTATION_MODAL.Modal.hide();
    SendData("update", "POST", {
      id: transmutation.id,
      name: Inputs.Name.value,
      lowest: parseInt(Inputs.Lowest.value),
      passing: parseInt(Inputs.Passing.value),
      highest: parseInt(Inputs.Highest.value),
    });
  };

  TRANSMUTATION_MODAL.Modal.show();
}

function DeleteTransmutationInit(transmutation: Transmutation) {
  CONSOLE_LOG && console.log("Delete Transmutation Init: ", transmutation);

  DELETE_MODAL.Text!.innerHTML = `Are you sure you want to delete "${transmutation.name}"?`;

  DELETE_MODAL.Button!.onclick = () => {
    DELETE_MODAL.Modal.hide();
    SendData("destroy", "POST", transmutation);
  };

  DELETE_MODAL.Modal.show();
}
// AJAX
function SendData(
  title: string,
  method: AJAXMethods,
  data: Transmutation | null,
) {
  let request: Request = {
    token: sessionStorage.getItem("token") ?? "",
    data: data,
  };

  CONSOLE_LOG && console.log("Send Request Data: ", request);

  $.ajax({
    url: Routes.TRANSMUTATIONS_API,
    type: method,
    data: `${title}=` + JSON.stringify(request),
    success: function (response) {
      CONSOLE_LOG &&
        console.log(
          "Successful Request Response: ",
          JSON.parse(response) || response,
        );

      getList();
    },
    error: function (xhr, status, error) {
      if (CONSOLE_LOG) {
        console.group("Request Errors:");
        console.error("(Error) XHR Status: ", xhr.status);
        console.error("(Error) XHR Text: ", xhr.responseText);
        console.error("(Error) Status: ", status);
        console.error("Error: ", error);
        console.groupEnd();
      }
      let data: RequestResponse = JSON.parse(xhr.responseText);
      ERROR_MODAL.Text!.innerHTML = `
        <b>Error:</b> <br>${data.title || "Internal Server Error"}
        <br><br>
        <b>${data.message || "Internal Server Error"}</b>
      `;
      ERROR_MODAL.Modal.show();
      if (xhr.status === 403) window.location.href = Routes.LOGIN_PAGE;
    },
  });
}
function getList() {
  $.ajax({
    url: Routes.TRANSMUTATIONS_API,
    type: "GET",
    data:
      `index=` +
      JSON.stringify({ token: sessionStorage.getItem("token") || "" }),
    success: function (response) {
      CONSOLE_LOG &&
        console.log(
          "Successful Request Response: ",
          JSON.parse(response) || response,
        );
      populateList(JSON.parse(response).data);
    },
    error: function (xhr, status, error) {
      if (CONSOLE_LOG) {
        console.group("Request Errors:");
        console.error("(Error) XHR Status: ", xhr.status);
        console.error("(Error) XHR Text: ", xhr.responseText);
        console.error("(Error) Status: ", status);
        console.error("Error: ", error);
        console.groupEnd();
      }
      let data: RequestResponse = JSON.parse(xhr.responseText);
      ERROR_MODAL.Text!.innerHTML = `
        <b>Error:</b> <br>${data.title || "Internal Server Error"}
        <br><br>
        <b>${data.message || "Internal Server Error"}</b>
      `;
      if (xhr.status === 403) window.location.href = Routes.LOGIN_PAGE;
    },
  });
}

// DOM
function populateList(transmutations: Transmutation[]) {
  DOM.SPINNER_ACTION.classList.remove("hidden");

  const List = TRANSMUTATION_LIST;

  transmutations
    ? (List.innerHTML = "")
    : (List.innerText = "You have not created any transmutations yet.");

  for (let transmutation of transmutations) {
    const Card = document.createElement("div");
    Card.classList.add(
      "w-max",
      "shadow-lg",
      "rounded",
      "bg-white",
      "border-2",
      "border-neutral-400",
      "p-3",
    );

    const CardHeader = document.createElement("div");
    CardHeader.classList.add(
      "w-full",
      "px-3",
      "mb-6",
      "text-lg",
      "font-semibold",
    );

    CardHeader.innerText = transmutation.name;

    const Table = document.createElement("table");
    Table.classList.add("w-full", "table-auto", "whitespace-nowrap");

    const TableHeader = document.createElement("thead");
    TableHeader.classList.add(
      "uppercase",
      "text-neutral-400",
      "text-md",
      "text-left",
    );

    TableHeader.innerHTML = `
      <tr>
        <th scope='col' class='p-3'>Scope</th>
        <th scope='col' class='p-3'>Percentage</th>
        <th scope='col' class='p-3'>Transmuted</th>
      </tr>
    `;

    const TableBody = document.createElement("tbody");
    TableBody.classList.add("text-md");

    TableBody.innerHTML = `
      <tr>
          <td class='p-3'>Lowest</td>
          <td class='p-3 text-center font-mono'>0 %</td>
          <td class='p-3 text-center font-mono'>${transmutation.lowest} %</td>
      </tr>
      <tr>
          <td class='p-3'>Passing</td>
          <td class='p-3 text-center font-mono'>${LinearScale(
            transmutation.lowest,
            transmutation.highest,
            0,
            100,
            transmutation.passing,
          ).toFixed(2)} %</td>
          <td class='p-3 text-center font-mono'>${transmutation.passing} %</td>
      </tr>
      <tr>
          <td class='p-3'>Highest</td>
          <td class='p-3 text-center font-mono'>100 %</td>
          <td class='p-3 text-center font-mono'>${transmutation.highest} %</td>
      </tr>
    `;

    const CardButtons = document.createElement("div");
    CardButtons.classList.add(
      "mt-5",
      "w-full",
      "flex",
      "flex-row",
      "justify-end",
      "text-white",
      "gap-2",
    );

    const EditButton = document.createElement("button");
    EditButton.classList.add(
      "rounded",
      "px-3",
      "py-2",
      "rounded",
      "shadow",
      "bg-blue-400",
      "hover:bg-blue-500",
    );
    EditButton.innerHTML = "<i class='fa-solid fa-gear'></i>";

    EditButton.onclick = () => {
      EditTransmutationInit(transmutation);
    };

    const DeleteButton = document.createElement("button");
    DeleteButton.classList.add(
      "rounded",
      "px-3",
      "py-2",
      "rounded",
      "shadow",
      "bg-red-400",
      "hover:bg-red-500",
    );
    DeleteButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>";

    DeleteButton.onclick = () => {
      DeleteTransmutationInit(transmutation);
    };

    CardButtons.appendChild(EditButton);
    CardButtons.appendChild(DeleteButton);

    Table.appendChild(TableHeader);
    Table.appendChild(TableBody);

    Card.appendChild(CardHeader);
    Card.appendChild(Table);

    !transmutation.is_default && Card.appendChild(CardButtons);

    TRANSMUTATION_LIST.appendChild(Card);
  }

  DOM.SPINNER_ACTION.classList.add("hidden");
}

function scaleInputs() {
  const Inputs = TRANSMUTATION_MODAL.Inputs!;
  const Displays = TRANSMUTATION_MODAL.Displays!;

  Inputs.Lowest.oninput = () => {
    Inputs.Lowest.max = Inputs.Passing.value;
    Displays.Passing.innerText = LinearScale(
      parseInt(Inputs.Lowest.value),
      parseInt(Inputs.Highest.value),
      0,
      100,
      parseInt(Inputs.Passing.value),
    )
      .toFixed(2)
      .toString();
  };

  Inputs.Passing.oninput = () => {
    Inputs.Passing.min = Inputs.Lowest.value;
    Inputs.Passing.max = Inputs.Highest.value;
    Displays.Passing.innerText = LinearScale(
      parseInt(Inputs.Lowest.value),
      parseInt(Inputs.Highest.value),
      0,
      100,
      parseInt(Inputs.Passing.value),
    )
      .toFixed(2)
      .toString();
  };

  Inputs.Highest.oninput = () => {
    Inputs.Highest.min = Inputs.Passing.value;
    Displays.Passing.innerText = LinearScale(
      parseInt(Inputs.Lowest.value),
      parseInt(Inputs.Highest.value),
      0,
      100,
      parseInt(Inputs.Passing.value),
    )
      .toFixed(2)
      .toString();
  };
}
