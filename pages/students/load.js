import * as Routes from "../../scripts/routes.js";
document.addEventListener("DOMContentLoaded", function () {
    var _a;
    let token = (_a = sessionStorage.getItem("token")) !== null && _a !== void 0 ? _a : "";
    const data = {
        request: "login",
        token: token,
    };
    $.ajax({
        type: "POST",
        url: Routes.STUDENTS_API,
        data: "session=" + JSON.stringify(data),
        success: function (response) {
            var _a;
            console.log("Successful Response: ", JSON.parse(response) || response);
            (_a = document.getElementById("Site-Spinner")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        },
        error: function (xhr, status, error) {
            var _a;
            (_a = document.getElementById("Site-Spinner")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
            console.error("(Error) XHR Status: ", xhr.status);
            console.error("(Error) XHR Text: ", xhr.responseText);
            console.error("(Error) Status: ", status);
            console.error("Error: ", error);
            if (error)
                window.location.href = Routes.LOGIN_PAGE;
        },
    });
});
