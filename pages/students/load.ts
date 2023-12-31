import * as Routes from "../../scripts/routes";

import * as Env from "../../scripts/env";

document.addEventListener("DOMContentLoaded", function () {
	let token = sessionStorage.getItem("token") ?? "";

	const data = {
		request: "login",
		token: token,
	};

	$.ajax({
		type: "POST",
		url: Routes.SESSIONS_API,
		data: "session=" + JSON.stringify(data),
		success: function (response) {
			Env.CONSOLE_LOG && console.log("Successful Response: ", JSON.parse(response) || response);
			document.getElementById("Site-Spinner")?.classList.add("hidden");
			let data = JSON.parse(response).data;
			document.getElementById("Profile_FirstName")!.innerText = data.user.firstName;
			document.getElementById("Profile_LastName")!.innerText = data.user.lastName;
			document.getElementById("Profile_Photo")?.setAttribute("src", "../../api/" + data.user.imagePath);
		},
		error: function (xhr, status, error) {
			document.getElementById("Site-Spinner")?.classList.remove("hidden");
			Env.CONSOLE_LOG && console.error("(Error) XHR Status: ", xhr.status);
			Env.CONSOLE_LOG && console.error("(Error) XHR Text: ", xhr.responseText);
			Env.CONSOLE_LOG && console.error("(Error) Status: ", status);
			Env.CONSOLE_LOG && console.error("Error: ", error);
			if (error) window.location.href = Routes.LOGIN_PAGE;
		},
	});
});
