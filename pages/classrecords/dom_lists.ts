import * as ROUTES from "../../scripts/routes";
import { EditRecordInit, DeleteRecordInit } from "./script";
import { Section, Transmutation, ClassRecord } from "./script.d";

import { DateFormatter } from "../../scripts/functions";

// SECTION LISTS CONFIG
const SECTION_BUTTON = document.getElementById(
  "SectionsButton",
) as HTMLButtonElement;
const SECTION_DROPDOWN_INIT = document.getElementById(
  "SectionsDropdown",
) as HTMLDivElement;
let SECTION_LIST_INIT =
  SECTION_DROPDOWN_INIT.querySelectorAll<HTMLInputElement>(
    'input[type="radio"][name="SectionListRadio"]',
  );

export const SECTION_LIST = {
  Element: SECTION_LIST_INIT,
  Button: SECTION_BUTTON,
  Dropdown: SECTION_DROPDOWN_INIT,
  Populate: function (sections: Section[]): void {
    SECTION_DROPDOWN_INIT.innerHTML = "";
    const UL = document.createElement("ul");
    UL.classList.add("py-2", "text-sm", "text-gray-700");
    UL.setAttribute("aria-labelledby", "SectionButton");

    for (let section of sections) {
      UL.innerHTML += `
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
                        data-syStart='${section.syStart}'
                        data-syEnd='${section.syEnd}'
                        ${sections.indexOf(section) === 0 ? "checked" : ""}
                        class='text-${
                          section.color
                        }-500 bg-gray-100 border-gray-300 focus:ring-${
        section.color
      }-500 focus:ring-2 '
                        />
                        <span>${section.name}</span>
                        <span class='text-sm text-gray-500'>S.Y. ${DateFormatter(
                          new Date(section.syStart),
                        )} - ${DateFormatter(new Date(section.syEnd))}</span>
                        
                    </label>
                </li>
            `;
    }
    SECTION_DROPDOWN_INIT.appendChild(UL);

    SECTION_LIST_INIT =
      SECTION_DROPDOWN_INIT.querySelectorAll<HTMLInputElement>(
        'input[type="radio"][name="SectionListRadio"]',
      );

    if (sections.length > 0 && sections[0].name) {
      this.SetValue(sections[0]);
    } else {
      SECTION_BUTTON.innerHTML = "No Sections Available";
    }

    SECTION_LIST_INIT.forEach((radioButton) => {
      radioButton.addEventListener("change", (event) => {
        let target = event.target as HTMLInputElement;
        this.SetValue({
          id: target.value,
          name: target.getAttribute("data-name")?.toString() ?? "",
          color: target.getAttribute("data-color")?.toString() ?? "",
          syStart: target.getAttribute("data-syStart")?.toString() ?? "",
          syEnd: target.getAttribute("data-syEnd")?.toString() ?? "",
        });
      });
    });
  },
  SetValue: function (section: Section): void {
    SECTION_LIST_INIT.forEach((radioButton: HTMLInputElement) => {
      radioButton.checked = false;
      if (radioButton.value == section.id) {
        radioButton.checked = true;

        let color = radioButton.getAttribute("data-color");
        let name = radioButton.getAttribute("data-name");

        SECTION_BUTTON.classList.forEach((className) => {
          if (className.startsWith("bg-")) {
            SECTION_BUTTON.classList.remove(className);
          }
        });

        SECTION_BUTTON.classList.add(`bg-${color}-500`);
        SECTION_BUTTON.innerHTML = `${name} <i class='fa-solid fa-caret-down ml-2'></i>`;
      }
    });
  },
  GetValue: () => {
    let result: Section = {
      id: "",
      name: "",
      color: "",
      syStart: "",
      syEnd: "",
    };
    SECTION_LIST_INIT.forEach((radioButton) => {
      if (radioButton.checked) {
        result = {
          id: radioButton.value ?? radioButton.getAttribute("data-id") ?? "",
          name: radioButton.getAttribute("data-name")?.toString() ?? "",
          color: radioButton.getAttribute("data-color")?.toString() ?? "",
          syStart: radioButton.getAttribute("data-syStart")?.toString() ?? "",
          syEnd: radioButton.getAttribute("data-syEnd")?.toString() ?? "",
        };
      }
    });
    return result;
  },
};

// TRANSMUTATION LISTS CONFIG
const TRANSMUTATION_BUTTON = document.getElementById(
  "TransmutationsButton",
) as HTMLButtonElement;
const TRANSMUTATION_DROPDOWN_INIT = document.getElementById(
  "TransmutationsDropdown",
) as HTMLDivElement;
let TRANSMUTATION_LIST_INIT =
  TRANSMUTATION_DROPDOWN_INIT.querySelectorAll<HTMLInputElement>(
    'input[type="radio"][name="TransmutationListRadio"]',
  ) as NodeListOf<HTMLInputElement>;

export const TRANSMUTATION_LIST = {
  Element: TRANSMUTATION_LIST_INIT,
  Button: TRANSMUTATION_BUTTON,
  Dropdown: TRANSMUTATION_DROPDOWN_INIT,
  Populate: function (transmutations: Transmutation[]): void {
    TRANSMUTATION_DROPDOWN_INIT.innerHTML = "";

    const UL = document.createElement("ul");
    UL.classList.add("py-2", "text-sm", "text-gray-700");
    UL.setAttribute("aria-labelledby", "TransmutationButton");

    for (let transmutation of transmutations) {
      UL.innerHTML += `
            <li>
                <label 
                    class='text-neutral-500 flex flex-row whitespace-nowrap items-center gap-5 w-full px-4 py-2 text-md font-medium hover:bg-gray-100 cursor-pointer'>
                        
                    <input  
                        name='TransmutationListRadio'
                        value='${transmutation.id}'
                        type='radio'
                        data-name='${transmutation.name}'
                        data-lowest='${transmutation.lowest}'
                        data-passing='${transmutation.passing}'
                        data-highest='${transmutation.highest}'

                        class='text-neutral-500 bg-gray-100 border-gray-300 focus:ring-neutral-500 focus:ring-2 '
                        />
                        <span>${transmutation.name}</span>
                        <span class='text-sm text-gray-500'>
                            ${transmutation.lowest}% - ${transmutation.passing}% - ${transmutation.highest}%
                        </span>
                </label>
            </li>   
        `;
    }

    TRANSMUTATION_DROPDOWN_INIT.appendChild(UL);

    TRANSMUTATION_LIST_INIT =
      TRANSMUTATION_DROPDOWN_INIT.querySelectorAll<HTMLInputElement>(
        'input[type="radio"][name="TransmutationListRadio"]',
      );

    if (transmutations.length > 0 && transmutations[0].name) {
      this.SetValue(transmutations[0]);
    } else {
      TRANSMUTATION_BUTTON.innerHTML = "No Transmutations Available";
    }

    TRANSMUTATION_LIST_INIT.forEach((radioButton) => {
      radioButton.addEventListener("change", (event) => {
        let target = event.target as HTMLInputElement;
        this.SetValue({
          id: target.value ?? target.getAttribute("data-id") ?? "",
          name: target.getAttribute("data-name")?.toString() ?? "",
          lowest: parseInt(target.getAttribute("data-lowest") as string),
          passing: parseInt(target.getAttribute("data-passing") as string),
          highest: parseInt(target.getAttribute("data-highest") as string),
        });
      });
    });
  },
  SetValue: function (transmutation: Transmutation): void {
    TRANSMUTATION_LIST_INIT.forEach((radioButton: HTMLInputElement) => {
      radioButton.checked = false;
      if (radioButton.value === transmutation.id) {
        radioButton.checked = true;
        TRANSMUTATION_BUTTON.innerHTML = `${transmutation.name} <i class='fa-solid fa-caret-down ml-2'></i>`;
      }
    });
  },
  GetValue: () => {
    let result: Transmutation = {
      id: "",
      name: "",
      lowest: 0,
      passing: 0,
      highest: 0,
    };
    TRANSMUTATION_LIST_INIT.forEach((radioButton) => {
      if (radioButton.checked) {
        result = {
          id: radioButton.value ?? radioButton.getAttribute("data-id") ?? "",
          name: radioButton.getAttribute("data-name")?.toString() ?? "",
          lowest: parseInt(radioButton.getAttribute("data-lowest") as string),
          passing: parseInt(radioButton.getAttribute("data-passing") as string),
          highest: parseInt(radioButton.getAttribute("data-highest") as string),
        };
      }
    });
    return result;
  },
};

// RECORDS LIST CONFIG
const RECORDS_CONTAINER = document.getElementById("RecordsList") as HTMLElement;

export const RECORDS_LIST = {
  Element: RECORDS_CONTAINER,
  Populate: function (records: ClassRecord[]): void {
    this.Element.innerHTML = "";

    for (let record of records) {
      const Card = document.createElement("div");
      Card.classList.add(
        "w-max",
        "h-max",
        "shadow-xl",
        "rounded",
        "bg-white",
        "border-2",
        `border-${record.section.color}-500`,
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
        `bg-${record.section.color}-500`,
        "text-white",
      );

      const HeaderTitle = document.createElement("div");
      HeaderTitle.innerHTML = `
        <h1 class='text-2xl font-bold'>${record.name}</h1>
        <h2 class='text-neutral-100 text-lg'>${record.section.name}</h2>
        <h3 class='text-neutral-100 text-sm'>
        S.Y. 
        ${DateFormatter(new Date(record.section.syStart))} 
        - 
        ${DateFormatter(new Date(record.section.syEnd))}
        </h3>
      `;

      const HeaderButton = document.createElement("button");
      HeaderButton.classList.add(
        "p-2",
        "hover:text-neutral-200",
        "font-medium",
      );
      HeaderButton.innerHTML = `
        <span>Hide</span>
        <i class='fa-solid fa-folder-open ml-2'></i>
        `;

      const Content = document.createElement("div");
      Content.classList.add("flex", "flex-col", "w-full", "p-2", "gap-2");

      const Table = document.createElement("table");
      Table.classList.add("w-full");

      const TableHeader = document.createElement("thead");
      TableHeader.classList.add("text-neutral", "font-medium", "text-left");
      TableHeader.innerHTML = `
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
                <td colspan='3' class='px-6 py-2'>No Components</td>
            </tr>
          `;
      }

      for (const [index, component] of record.components.entries()) {
        TableBody.innerHTML += `
            <tr>
                <td class='px-6 py-2'>${index + 1}. ${component.name}</td>
                <td class='px-6 py-2 text-center'>
                ${component.activities}
                </td>
                <td class='px-6 py-2 text-center'>
                ${component.score}%
                </td>
            </tr>
        `;
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
        window.location.href = ROUTES.VIEWRECORD_PAGE + "/?v=" + recordId;
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
        EditRecordInit(record);
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
        DeleteRecordInit(record);
      };

      // APPENDED

      Header.appendChild(HeaderTitle);
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

      Table.appendChild(TableHeader);
      Table.appendChild(TableBody);

      Content.appendChild(Table);
      Content.innerHTML += `
        <hr class='mx-5' />
        <div class='w-full text-right px-6 py-2 text-neutral-400 font-bold'>
        TOTAL PERCENTAGE SCORE: ${record.components.reduce(
          (total, component) => {
            return total + component.score;
          },
          0,
        )}%
        </div>
        <div>
            <h1 class="font-bold text-neutral-400">TRANSMUTATION:</h1>
            <span>
            ${record.transmutation.name} (
                ${record.transmutation.lowest}% 
                - 
                ${record.transmutation.passing}% 
                - 
                ${record.transmutation.highest}%
            )</span>
        </div>
        `;

      ActionsContainer.appendChild(ViewButton);
      ActionsContainer.appendChild(SettingsButton);
      ActionsContainer.appendChild(DeleteButton);

      Content.appendChild(ActionsContainer);

      Card.appendChild(Header);
      Card.appendChild(Content);

      RECORDS_CONTAINER.appendChild(Card);
    }
  },
};
