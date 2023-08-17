import * as Routes from "../../scripts/routes";

document.addEventListener("DOMContentLoaded", function () {
  let token = sessionStorage.getItem("token") ?? "";

  const data = {
    request: "login",
    token: token,
  };

  $.ajax({
    type: "POST",
    url: Routes.STUDENTS_API,
    data: "session=" + JSON.stringify(data),
    success: function (response) {
      console.log("Successful Response: ", JSON.parse(response) || response);
      document.getElementById("Site-Spinner")?.classList.add("hidden");
    },
    error: function (xhr, status, error) {
      document.getElementById("Site-Spinner")?.classList.remove("hidden");
      console.error("(Error) XHR Status: ", xhr.status);
      console.error("(Error) XHR Text: ", xhr.responseText);
      console.error("(Error) Status: ", status);
      console.error("Error: ", error);
      if (error) window.location.href = Routes.LOGIN_PAGE;
    },
  });
});
