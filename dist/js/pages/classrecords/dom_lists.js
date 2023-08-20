import * as ROUTES from "../../scripts/routes";
import { EditRecordInit, DeleteRecordInit } from "./script";
import { DateFormatter } from "../../scripts/functions";
const SECTION_BUTTON = document.getElementById("SectionsButton");
const SECTION_DROPDOWN_INIT = document.getElementById("SectionsDropdown");
let SECTION_LIST_INIT = SECTION_DROPDOWN_INIT.querySelectorAll('input[type="radio"][name="SectionListRadio"]');
export const SECTION_LIST = {
    Element: SECTION_LIST_INIT,
    Button: SECTION_BUTTON,
    Dropdown: SECTION_DROPDOWN_INIT,
    Populate: function (sections) {
        SECTION_DROPDOWN_INIT.innerHTML = "";
        const UL = document.createElement("ul");
        UL.classList.add("py-2", "text-sm", "text-gray-700");
        UL.setAttribute("aria-labelledby", "SectionButton");
        for (let section of sections) {
            UL.innerHTML += `
            <li>
                <label 
                    class='text-${section.color}-500 flex flex-row whitespace-nowrap items-center gap-5 w-full px-4 py-2 text-md font-medium hover:bg-gray-100 cursor-pointer'>
                        
                    <input  
                        name='SectionListRadio'
                        value='${section.id}'
                        type='radio'
                        data-name='${section.name}'
                        data-color='${section.color}'
                        data-syStart='${section.syStart}'
                        data-syEnd='${section.syEnd}'
                        ${sections.indexOf(section) === 0 ? "checked" : ""}
                        class='text-${section.color}-500 bg-gray-100 border-gray-300 focus:ring-${section.color}-500 focus:ring-2 '
                        />
                        <span>${section.name}</span>
                        <span class='text-sm text-gray-500'>S.Y. ${DateFormatter(new Date(section.syStart))} - ${DateFormatter(new Date(section.syEnd))}</span>
                        
                    </label>
                </li>
            `;
        }
        SECTION_DROPDOWN_INIT.appendChild(UL);
        SECTION_LIST_INIT =
            SECTION_DROPDOWN_INIT.querySelectorAll('input[type="radio"][name="SectionListRadio"]');
        this.Element = SECTION_LIST_INIT;
        if (sections.length > 0 && sections[0].name) {
            this.SetValue(sections[0]);
        }
        else {
            SECTION_BUTTON.innerHTML = "No Sections Available";
        }
        SECTION_LIST_INIT.forEach((radioButton) => {
            radioButton.addEventListener("change", (event) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                let target = event.target;
                this.SetValue({
                    id: target.value,
                    name: (_b = (_a = target.getAttribute("data-name")) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
                    color: (_d = (_c = target.getAttribute("data-color")) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "",
                    syStart: (_f = (_e = target.getAttribute("data-syStart")) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : "",
                    syEnd: (_h = (_g = target.getAttribute("data-syEnd")) === null || _g === void 0 ? void 0 : _g.toString()) !== null && _h !== void 0 ? _h : "",
                });
            });
        });
    },
    SetValue: function (section) {
        SECTION_LIST_INIT.forEach((radioButton) => {
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
        let result = {
            id: "",
            name: "",
            color: "",
            syStart: "",
            syEnd: "",
        };
        SECTION_LIST_INIT.forEach((radioButton) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            if (radioButton.checked) {
                result = {
                    id: (_b = (_a = radioButton.value) !== null && _a !== void 0 ? _a : radioButton.getAttribute("data-id")) !== null && _b !== void 0 ? _b : "",
                    name: (_d = (_c = radioButton.getAttribute("data-name")) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "",
                    color: (_f = (_e = radioButton.getAttribute("data-color")) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : "",
                    syStart: (_h = (_g = radioButton.getAttribute("data-syStart")) === null || _g === void 0 ? void 0 : _g.toString()) !== null && _h !== void 0 ? _h : "",
                    syEnd: (_k = (_j = radioButton.getAttribute("data-syEnd")) === null || _j === void 0 ? void 0 : _j.toString()) !== null && _k !== void 0 ? _k : "",
                };
            }
        });
        return result;
    },
};
const TRANSMUTATION_BUTTON = document.getElementById("TransmutationsButton");
const TRANSMUTATION_DROPDOWN_INIT = document.getElementById("TransmutationsDropdown");
let TRANSMUTATION_LIST_INIT = TRANSMUTATION_DROPDOWN_INIT.querySelectorAll('input[type="radio"][name="TransmutationListRadio"]');
export const TRANSMUTATION_LIST = {
    Element: TRANSMUTATION_LIST_INIT,
    Button: TRANSMUTATION_BUTTON,
    Dropdown: TRANSMUTATION_DROPDOWN_INIT,
    Populate: function (transmutations) {
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
            TRANSMUTATION_DROPDOWN_INIT.querySelectorAll('input[type="radio"][name="TransmutationListRadio"]');
        this.Element = TRANSMUTATION_LIST_INIT;
        if (transmutations.length > 0 && transmutations[0].name) {
            this.SetValue(transmutations[0]);
        }
        else {
            TRANSMUTATION_BUTTON.innerHTML = "No Transmutations Available";
        }
        TRANSMUTATION_LIST_INIT.forEach((radioButton) => {
            radioButton.addEventListener("change", (event) => {
                var _a, _b, _c, _d;
                let target = event.target;
                this.SetValue({
                    id: (_b = (_a = target.value) !== null && _a !== void 0 ? _a : target.getAttribute("data-id")) !== null && _b !== void 0 ? _b : "",
                    name: (_d = (_c = target.getAttribute("data-name")) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "",
                    lowest: parseInt(target.getAttribute("data-lowest")),
                    passing: parseInt(target.getAttribute("data-passing")),
                    highest: parseInt(target.getAttribute("data-highest")),
                });
            });
        });
    },
    SetValue: function (transmutation) {
        TRANSMUTATION_LIST_INIT.forEach((radioButton) => {
            radioButton.checked = false;
            if (radioButton.value === transmutation.id) {
                radioButton.checked = true;
                TRANSMUTATION_BUTTON.innerHTML = `${transmutation.name} <i class='fa-solid fa-caret-down ml-2'></i>`;
            }
        });
    },
    GetValue: () => {
        let result = {
            id: "",
            name: "",
            lowest: 0,
            passing: 0,
            highest: 0,
        };
        TRANSMUTATION_LIST_INIT.forEach((radioButton) => {
            var _a, _b, _c, _d;
            if (radioButton.checked) {
                result = {
                    id: (_b = (_a = radioButton.value) !== null && _a !== void 0 ? _a : radioButton.getAttribute("data-id")) !== null && _b !== void 0 ? _b : "",
                    name: (_d = (_c = radioButton.getAttribute("data-name")) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "",
                    lowest: parseInt(radioButton.getAttribute("data-lowest")),
                    passing: parseInt(radioButton.getAttribute("data-passing")),
                    highest: parseInt(radioButton.getAttribute("data-highest")),
                };
            }
        });
        return result;
    },
};
const RECORDS_CONTAINER = document.getElementById("RecordsList");
export const RECORDS_LIST = {
    Element: RECORDS_CONTAINER,
    Populate: function (records) {
        this.Element.innerHTML = "";
        for (let record of records) {
            const Card = document.createElement("div");
            Card.classList.add("w-max", "h-max", "shadow-xl", "rounded", "bg-white", "border-2", `border-${record.section.color}-500`);
            const Header = document.createElement("div");
            Header.classList.add("flex", "flex-row", "justify-between", "items-center", "gap-5", "w-full", "p-2", `bg-${record.section.color}-500`, "text-white");
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
            HeaderButton.classList.add("p-2", "hover:text-neutral-200", "font-medium");
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
            ActionsContainer.classList.add("flex", "flex-row", "gap-2", "w-full", "justify-end", "text-white", "mt-5", "p-2", "items-center");
            const ViewButton = document.createElement("button");
            ViewButton.classList.add("p-2", "w-[3rem]", "rounded", "shadow", "bg-amber-400", "hover:bg-amber-600");
            ViewButton.innerHTML = `<i class="fa-solid fas fa-folder-open"></i>`;
            ViewButton.onclick = () => {
                const recordId = record.id.toString().toLowerCase().replace(/-/g, "_");
                window.location.href = ROUTES.VIEWRECORD_PAGE + "/?v=" + recordId;
            };
            const SettingsButton = document.createElement("button");
            SettingsButton.classList.add("p-2", "w-[3rem]", "rounded", "shadow", "bg-blue-400", "hover:bg-blue-600");
            SettingsButton.innerHTML = `<i class="fa-solid fa-gear"></i>`;
            SettingsButton.onclick = () => {
                EditRecordInit(record);
            };
            const DeleteButton = document.createElement("button");
            DeleteButton.classList.add("p-2", "w-[3rem]", "rounded", "shadow", "bg-red-400", "hover:bg-red-600");
            DeleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
            DeleteButton.onclick = () => {
                DeleteRecordInit(record);
            };
            Header.appendChild(HeaderTitle);
            HeaderButton.onclick = () => {
                Content.classList.toggle("hidden");
                if (Content.classList.contains("hidden")) {
                    HeaderButton.innerHTML = `
        <span>Show</span>
        <i class='fa-solid fa-folder ml-2'></i>
      `;
                }
                else {
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
        TOTAL PERCENTAGE SCORE: ${record.components.reduce((total, component) => {
                return total + component.score;
            }, 0)}%
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
        if (records.length == 0) {
            this.Element.innerHTML = "You have not created any Class Records yet...";
        }
    },
};
