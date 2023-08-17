import * as Routes from "../../scripts/routes";
document.addEventListener("DOMContentLoaded", function () {
    var _a;
    let token = (_a = sessionStorage.getItem("token")) !== null && _a !== void 0 ? _a : "";
    const data = {
        request: "login",
        token: token,
    };
    $.ajax({
        type: "POST",
        url: Routes.CLASSRECORDS_API,
        data: "session=" + JSON.stringify(data),
        success: function (response) {
            var _a, _b;
            console.log("Successful Response: ", JSON.parse(response) || response);
            (_a = document.getElementById("Site-Spinner")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            let data = JSON.parse(response);
            document.getElementById("Profile_FirstName").innerText =
                data.data.user.firstName || "???";
            document.getElementById("Profile_LastName").innerText =
                data.data.user.lastName || "???";
            (_b = document
                .getElementById("Profile_Photo")) === null || _b === void 0 ? void 0 : _b.setAttribute("src", "../../api/" + data.data.user.imagePath);
        },
        error: function (xhr, status, error) {
            var _a;
            (_a = document.getElementById("Site-Spinner")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
            console.group("Token Errors:");
            console.error("(Error) XHR Status: ", xhr.status);
            console.error("(Error) XHR Text: ", xhr.responseText);
            console.error("(Error) Status: ", status);
            console.error("Error: ", error);
            console.groupEnd();
            if (error)
                window.location.href = Routes.LOGIN_PAGE;
        },
    });
});
