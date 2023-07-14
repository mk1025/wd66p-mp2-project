import * as Routes from "../../scripts/routes.js";

const login_ExitButton = document.getElementById(
  "Homepage_Button",
) as HTMLButtonElement;

const credentialInput = document.getElementById(
  "email_username",
) as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;

const loginButton = document.getElementById(
  "login_button",
) as HTMLButtonElement;

const login_alert = document.getElementById("alert") as HTMLDivElement;

const spinner = document.getElementById("spinner") as HTMLDivElement;

loginButton.addEventListener("click", login);

$(function () {
  let token = sessionStorage.getItem("token") ?? "";

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
        window.location.href = Routes.DASHBOARD_PAGE;
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

function login() {
  const credential = credentialInput.value;
  const password = passwordInput.value;

  if (!credential.length || !password.length) {
    return alertMessage(true, "Please enter the missing fields");
  }
  alertMessage(false, "");
  return sendRequest();
}

function alertMessage(appearance: boolean, message: string) {
  if (appearance) {
    login_alert.classList.remove("hidden");
    login_alert.querySelector("span")!.innerText = message;
  } else {
    login_alert.classList.add("hidden");
    spinner.classList.add("hidden");
  }
}

function sendRequest() {
  spinner.classList.remove("hidden");

  let data = {
    credential: credentialInput.value.toLowerCase(),
    password: passwordInput.value,
  };

  $.ajax({
    type: "POST",
    url: Routes.LOGIN_API,
    data: "login=" + JSON.stringify(data),
    success: function (response) {
      console.log("Successful Response: ", response);
      handleResponseData(JSON.parse(response));
    },
    error: function (xhr, status, error) {
      console.log("XHR Status: ", xhr.status);
      console.log("XHR Text: ", xhr.responseText);
      console.log("Status: ", status);
      console.error("Error: ", error);
      handleResponseData(JSON.parse(xhr.responseText));
    },
  });

  spinner.classList.add("hidden");
}

function handleResponseData(data: any) {
  sessionStorage.setItem("token", data.data.token ?? "");
  if (data.status === 400) {
    alertMessage(true, data.message);
  }
  if (data.data.user) {
    window.location.href = Routes.HOME_PAGE;
  }
  if (data.data.redirect) {
    window.location.href = Routes.DASHBOARD_PAGE;
  }
}

login_ExitButton.addEventListener("click", () => {
  window.location.href = Routes.HOME_PAGE;
});
