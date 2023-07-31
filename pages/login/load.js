import * as Routes from "../../scripts/routes.js";
import handleResponseData from "./script.js";
document.addEventListener("DOMContentLoaded", function () {
    var _a;
    let token = (_a = sessionStorage.getItem("token")) !== null && _a !== void 0 ? _a : "";
    const data = {
        request: "login",
        token: token,
    };
    $.ajax({
        type: "POST",
        url: Routes.LOGIN_API,
        data: "session=" + JSON.stringify(data),
        success: function (response) {
            console.log("Successful Response: ", response);
            let postResponse = JSON.parse(response);
            if (postResponse.data.redirect) {
                window.location.href = Routes.CLASSRECORDS_PAGE;
            }
        },
        error: function (xhr, status, error) {
            console.log("XHR Status: ", xhr.status);
            console.log("XHR Text: ", xhr.responseText);
            console.log("Status: ", status);
            console.error("Error: ", error);
            handleResponseData(JSON.parse(xhr.responseText));
        },
    });
});
