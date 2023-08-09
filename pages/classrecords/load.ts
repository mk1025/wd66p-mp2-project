import * as Routes from "../../scripts/routes.js";

document.addEventListener("DOMContentLoaded", function () {
  let token = sessionStorage.getItem("token") ?? "";

  const data = {
    request: "login",
    token: token,
  };

  $.ajax({
    type: "POST",
    url: Routes.CLASSRECORDS_API,
    data: "session=" + JSON.stringify(data),
    success: function (response) {
      console.log("Successful Response: ", JSON.parse(response) || response);
      document.getElementById("Site-Spinner")?.classList.add("hidden");

      let data = JSON.parse(response);
      document.getElementById("Profile_FirstName")!.innerText =
        data.data.user.firstName || "???";
      document.getElementById("Profile_LastName")!.innerText =
        data.data.user.lastName || "???";
      document
        .getElementById("Profile_Photo")
        ?.setAttribute("src", "../../api/" + data.data.user.imagePath);
    },
    error: function (xhr, status, error) {
      document.getElementById("Site-Spinner")?.classList.remove("hidden");
      console.group("Token Errors:");
      console.error("(Error) XHR Status: ", xhr.status);
      console.error("(Error) XHR Text: ", xhr.responseText);
      console.error("(Error) Status: ", status);
      console.error("Error: ", error);
      console.groupEnd();
      if (error) window.location.href = Routes.LOGIN_PAGE;
    },
  });
});
