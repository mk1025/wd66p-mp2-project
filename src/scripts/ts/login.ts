const login_ExitButton = document.getElementById("Homepage_Button") as HTMLButtonElement;

const login_emailUsernameInput = document.getElementById("email_username") as HTMLInputElement;
const login_passwordInput = document.getElementById("password") as HTMLInputElement;

const loginButton = document.getElementById("login_button") as HTMLButtonElement;

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
    url: "php/login.php",
    data: "session=" + JSON.stringify(data),
    success: function (response) {
      console.log(response);
      let postResponse = JSON.parse(response);
      if (postResponse.data.redirect) {
        window.location.href = "dashboard.html";
      }
    },
    error: function (xhr, status, error) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(status);
      console.error(error);
      handleResponseData(JSON.parse(xhr.responseText));
    },
  });
});

login_ExitButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

function login() {
  const emailUsername = login_emailUsernameInput.value;
  const password = login_passwordInput.value;

  if (emailUsername.length === 0 && password.length === 0) {
    return alertMessage(true, "Please enter your email and password");
  }
  if (emailUsername.length === 0) {
    return alertMessage(true, "Please enter your email");
  }
  if (password.length === 0) {
    return alertMessage(true, "Please enter your password");
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
    input: login_emailUsernameInput.value.toLowerCase(),
    password: login_passwordInput.value,
  };

  $.ajax({
    type: "POST",
    url: "php/login.php",
    data: "login=" + JSON.stringify(data),
    success: function (response) {
      console.log(response);
      handleResponseData(JSON.parse(response));
    },
    error: function (xhr, status, error) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      console.log(status);
      console.error(error);
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
    window.location.href = "index.html";
  }
  if (data.data.redirect) {
    window.location.href = "dashboard.html";
  }
}
