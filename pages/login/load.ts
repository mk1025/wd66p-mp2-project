import * as Routes from "../../scripts/routes";
// import handleResponseData from "./script";

// document.addEventListener("DOMContentLoaded", function () {
//   const data = {
//     request: "login",
//     token: sessionStorage.getItem("token") || "",
//   };
//   $.ajax({
//     type: "POST",
//     url: Routes.SESSIONS_API,
//     data: "session=" + JSON.stringify(data),
//     success: function (response) {
//       console.log("Successful Response: ", response);
//       let data = JSON.parse(response);
//       if (data.data.redirect) {
//         window.location.href = Routes.CLASSRECORDS_PAGE;
//       }
//     },
//     error: function (xhr, status, error) {
//       console.log("XHR Status: ", xhr.status);
//       console.log("XHR Text: ", xhr.responseText);
//       console.log("Status: ", status);
//       console.error("Error: ", error);
//       handleResponseData(JSON.parse(xhr.responseText));
//     },
//   });
// });
