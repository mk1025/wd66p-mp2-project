import * as Routes from "../../scripts/routes";
import * as Env from "../../scripts/env";
document.addEventListener("DOMContentLoaded", function () {
    var _a;
    let token = (_a = sessionStorage.getItem("token")) !== null && _a !== void 0 ? _a : "";
    const data = {
        request: "login",
        token: token,
    };
    $.ajax({
        type: "POST",
        url: Routes.SESSIONS_API,
        data: "session=" + JSON.stringify(data),
        success: function (response) {
            var _a, _b;
            Env.CONSOLE_LOG && console.log("Successful Response: ", JSON.parse(response) || response);
            (_a = document.getElementById("Site-Spinner")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            let data = JSON.parse(response).data;
            document.getElementById("Profile_FirstName").innerText = data.user.firstName;
            document.getElementById("Profile_LastName").innerText = data.user.lastName;
            (_b = document.getElementById("Profile_Photo")) === null || _b === void 0 ? void 0 : _b.setAttribute("src", "../../api/" + data.user.imagePath);
        },
        error: function (xhr, status, error) {
            var _a;
            (_a = document.getElementById("Site-Spinner")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
            Env.CONSOLE_LOG && console.error("(Error) XHR Status: ", xhr.status);
            Env.CONSOLE_LOG && console.error("(Error) XHR Text: ", xhr.responseText);
            Env.CONSOLE_LOG && console.error("(Error) Status: ", status);
            Env.CONSOLE_LOG && console.error("Error: ", error);
            if (error)
                window.location.href = Routes.LOGIN_PAGE;
        },
    });
});
