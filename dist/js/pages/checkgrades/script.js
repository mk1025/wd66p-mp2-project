import * as ROUTES from "../../scripts/routes";
import { CONSOLE_LOG } from "../../scripts/env";
import { DateFormatter } from "../../scripts/functions";
import { LinearScale } from "../../scripts/math";
import { SPINNER_ACTION, SPINNER } from "../../scripts/dom";
import { SEARCH_INPUT, EXIT_BUTTON, SEARCH_BUTTON, CONTENT, STUDENT_NAME, SECTION_NAME, SECTION_SY, TEACHER_PHOTO, TEACHER_FIRSTNAME, TEACHER_LASTNAME, RECORDS_LIST, ERROR_MODAL, ERROR_MODAL_TEXT, } from "./dom";
document.addEventListener("DOMContentLoaded", () => {
    SPINNER_ACTION.classList.add("hidden");
    SPINNER.classList.add("hidden");
});
SEARCH_BUTTON.addEventListener("click", () => {
    sendRequest(SEARCH_INPUT.value.toString());
});
EXIT_BUTTON.addEventListener("click", () => {
    window.location.href = ROUTES.HOME_PAGE;
});
function sendRequest(data) {
    CONTENT.classList.add("invisible");
    SPINNER_ACTION.classList.remove("hidden");
    $.ajax({
        type: "GET",
        url: ROUTES.CHECKGRADES_API,
        data: "index=" + JSON.stringify({ request: data }),
        success: function (response) {
            SPINNER_ACTION.classList.add("hidden");
            CONSOLE_LOG && console.log("Successful Response: ", JSON.parse(response) || response);
            display(JSON.parse(response).data);
        },
        error: function (xhr, status, error) {
            SPINNER_ACTION.classList.add("hidden");
            if (CONSOLE_LOG) {
                console.group("GET Errors:");
                console.error("(Error) XHR Status: ", xhr.status);
                console.error("(Error) XHR Text: ", xhr.responseText);
                console.error("(Error) Status: ", status);
                console.error("Error: ", error);
                console.groupEnd();
            }
            let data = JSON.parse(xhr.responseText);
            ERROR_MODAL_TEXT.innerHTML = `
				<b>Error:</b> ${data.title} <br><br>
				${data.message}
			`;
            ERROR_MODAL.show();
        },
    });
}
function display(data) {
    CONTENT.classList.remove("invisible");
    STUDENT_NAME.innerText = `${data.firstName} ${data.lastName}`;
    SECTION_NAME.innerText = data.section.name;
    SECTION_SY.innerText = `S.Y. ${DateFormatter(new Date(data.section.syStart))} - ${DateFormatter(new Date(data.section.syEnd))}
	`;
    TEACHER_PHOTO.src = "../../api/" + data.instructor.imagePath;
    TEACHER_FIRSTNAME.innerText = data.instructor.firstName;
    TEACHER_LASTNAME.innerText = data.instructor.lastName;
    populate(data.records, data.section.color);
}
function populate(records, color) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    RECORDS_LIST.innerHTML = "";
    for (let record of records) {
        const Table = document.createElement("table");
        Table.classList.add("mt-10", "w-full", "table-auto", "border-2", `border-${color}-500`, "whitespace-nowrap");
        const TableHeader = document.createElement("thead");
        TableHeader.classList.add("text-left", `bg-${color}-500`, "text-white", "font-medium");
        TableHeader.innerHTML = `
			<tr>
				<th
					scope="col"
					class="px-6 py-10 text-xl font-bold"
					colspan="7"
				>
					${record.name}
				</th>
			</tr>
			<tr>
				<th
					scope="col"
					class="px-6 py-2"
				>
					Category
				</th>
				<th
					scope="col"
					class="px-6 py-2"
					
				>
					Activities
				</th>
				<th
					scope="col"
					class="px-6 py-2"
				>
					Type
				</th>
				<th
					scope="col"
					class="px-6 py-2"
				>
					Component
				</th>
				<th
					scope="col"
					class="px-6 py-2"
				>
					Component Type
				</th>
				<th
					scope="col"
					class="px-6 py-2 text-center"
				>
					Score
				</th>
				<th
					scope="col"
					class="px-6 py-2 text-center"
				>
					Max
				</th>
			</tr>
		
		
		`;
        const TableBody = document.createElement("tbody");
        let weightedList = [];
        for (let [r_component_index, r_component] of record.components.entries()) {
            let student_score = 0;
            let max_score = 0;
            for (let [activity_index, activity] of r_component.activities.entries()) {
                for (let [a_component_index, a_component] of activity.components.entries()) {
                    TableBody.innerHTML += `
						<tr>
							<td class='px-6 py-2 font-semibold'>
							${activity_index === 0 && a_component_index === 0 ? r_component.name : ""}
							</td>
							<td class='px-6 py-2'>
							${a_component_index > 0 ? "" : activity.name}
							</td>
							<td class='px-6 py-2'>
							${a_component_index > 0 ? "" : activity.type}
							</td>
							<td class='px-6 py-2'>
							${a_component.name}
							</td>
							<td class='px-6 py-2'>
							${a_component.type}
							</td>
							<td class='px-6 py-2 text-center'>
							${a_component.score}
							</td>
							<td class='px-6 py-2 text-center'>
							${a_component.maxScore}
							</td>
						</tr>
					`;
                    student_score += a_component.score;
                    max_score += a_component.maxScore;
                }
            }
            let percentage = (student_score / max_score) * 100 || 0;
            let weighted = LinearScale(0, 100, 0, r_component.score, percentage) || 0;
            weightedList.push(weighted);
            TableBody.innerHTML += `
				<tr class='bg-${color}-200'>
					<td colspan='5' class='px-6 py-2 text-right uppercase font-medium text-neutral-500'>
					Total Score
					</td>
					<td class='px-6 py-2 text-center'>${student_score}</td>
					<td class='px-6 py-2 text-center'>${max_score}</td>
				</tr>
				<tr class='bg-${color}-200'>
					<td colspan='5' class='px-6 py-2 text-right uppercase font-medium text-neutral-500'>
					Percentage
					</td>
					<td class='px-6 py-2 text-center'>${(_a = percentage.toFixed(2)) !== null && _a !== void 0 ? _a : 0} %</td>
					<td class='px-6 py-2 text-center'>100 %</td>
				</tr>
				<tr class='bg-${color}-200'>
					<td colspan='5' class='px-6 py-2 text-right uppercase font-medium text-neutral-500'>
					Weighted
					</td>
					<td class='px-6 py-2 text-center'>${(_b = weighted.toFixed(2)) !== null && _b !== void 0 ? _b : 0} %</td>
					<td class='px-6 py-2 text-center'>${(_c = r_component.score.toFixed(2)) !== null && _c !== void 0 ? _c : 0} %</td>
				</tr>


			`;
        }
        const TableFooter = document.createElement("tfoot");
        TableFooter.classList.add("bg-neutral-200");
        TableFooter.innerHTML = `
			<tr class='uppercase font-medium text-neutral-500'>
				<td class='px-6 py-2' colspan='4'>Final Grade</td>
				<td class='px-6 py-2 text-center'>Category</td>
				<td class='px-6 py-2 text-center'>Percentage</td>
				<td class='px-6 py-2 text-center'>Weighted</td>
			</tr>
		`;
        let totalComponentScore = 0;
        for (let [index, component] of record.components.entries()) {
            totalComponentScore += component.score;
            TableFooter.innerHTML += `
				<tr>
					<td colspan="5" class='px-6 py-2 text-right'>${component.name}</td>
					<td class='px-6 py-2 text-center'>${(_d = weightedList[index].toFixed(2)) !== null && _d !== void 0 ? _d : 0} %</td>
					<td class='px-6 py-2 text-center'>${(_e = component.score.toFixed(2)) !== null && _e !== void 0 ? _e : 0} %</td>
				</tr>
			`;
        }
        let totalWeighted = weightedList.reduce((a, b) => a + b, 0);
        let transmuted = LinearScale(0, totalComponentScore, record.transmutation.lowest, record.transmutation.highest, totalWeighted);
        TableFooter.innerHTML += `
			<tr class="font-bold">
				<td
					colspan="5"
					class="px-6 py-2 text-right"
				>
					Total Percentage:
				</td>
				<td class="px-6 py-2 text-center">${(_f = totalWeighted.toFixed(2)) !== null && _f !== void 0 ? _f : 0} %</td>
				<td class="px-6 py-2 text-center">${(_g = totalComponentScore.toFixed(2)) !== null && _g !== void 0 ? _g : 0} %</td>
			</tr>
			<tr class="font-bold text-xl">
				<td
					colspan="6"
					class="px-6 py-2 text-right"
				>
					Transmuted to Final Grade:
				</td>

				<td class="px-6 py-2 text-center">
				${(_h = transmuted.toFixed(2)) !== null && _h !== void 0 ? _h : 0} % 
				(${transmuted >= record.transmutation.passing ? "Passed" : "Failed"})</td>
			</tr>
		
		`;
        Table.appendChild(TableHeader);
        Table.appendChild(TableBody);
        Table.appendChild(TableFooter);
        RECORDS_LIST.appendChild(Table);
    }
}
