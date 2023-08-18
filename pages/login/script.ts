import * as Routes from "../../scripts/routes";
import { CONSOLE_LOG } from "../../scripts/env";

import { DOMLoadResponse, LoginResponse } from "./script.d";

import {
  CREDENTIAL_INPUT,
  PASSWORD_INPUT,
  LOGIN_BUTTON,
  ALERT_DIV,
  SPINNER_DIV,
} from "./dom";

// DOM LOAD
document.addEventListener("DOMContentLoaded", function () {
  const data = {
    token: sessionStorage.getItem("token") ?? "",
  };

  $.ajax({
    type: "POST",
    url: Routes.SESSIONS_API,
    data: "session=" + JSON.stringify(data),

    success: function (response) {
      CONSOLE_LOG && console.log("Token Response: ", response);

      let data: DOMLoadResponse = JSON.parse(response);
      if (data.data.redirect) {
        window.location.href = Routes.CLASSRECORDS_PAGE;
      }
    },
    error: function (xhr, status, error) {
      if (CONSOLE_LOG) {
        console.group(`DOM Load - Errors:`);
        console.error("XHR Status: ", xhr.status);
        console.error("XHR Text: ", xhr.responseText);
        console.error("Status: ", status);
        console.error("Error: ", error);
        console.groupEnd();
      }
    },
  });
});

LOGIN_BUTTON.addEventListener("click", login);

function login() {
  if (!CREDENTIAL_INPUT.value.length || !PASSWORD_INPUT.value.length) {
    return alertMessage(true, "Please enter the missing fields.");
  }
  alertMessage(false, "");
  return sendRequest();
}

function alertMessage(appearance: boolean, message: string) {
  if (appearance) {
    ALERT_DIV.classList.remove("hidden");
    ALERT_DIV.querySelector("span")!.innerText = message;
  } else {
    ALERT_DIV.classList.add("hidden");
    SPINNER_DIV.classList.add("hidden");
  }
}

function sendRequest() {
  SPINNER_DIV.classList.remove("hidden");

  let data = {
    credential: CREDENTIAL_INPUT.value.toLowerCase(),
    password: PASSWORD_INPUT.value,
  };

  $.ajax({
    type: "POST",
    url: Routes.LOGIN_API,
    data: "login=" + JSON.stringify(data),
    success: function (response) {
      CONSOLE_LOG && console.log("Successful Login Response: ", response);
      handleResponseData(JSON.parse(response));
    },
    error: function (xhr, status, error) {
      if (CONSOLE_LOG) {
        console.group(`Login - Errors:`);
        console.error("XHR Status: ", xhr.status);
        console.error("XHR Text: ", xhr.responseText);
        console.error("Status: ", status);
        console.error("Error: ", error);
        console.groupEnd();
      }
      handleResponseData(JSON.parse(xhr.responseText));
    },
  });

  SPINNER_DIV.classList.add("hidden");
}

function handleResponseData(data: LoginResponse) {
  sessionStorage.setItem("token", data.data.token ?? "");
  if (data.status === 200 && data.data.redirect) {
    window.location.href = Routes.CLASSRECORDS_PAGE;
  } else {
    alertMessage(true, data.message);
  }
}
