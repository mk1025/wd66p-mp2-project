const PROFILE_MIN_WIDTH = 200;
const PROFILE_MIN_HEIGHT = 200;
const PROFILE_MAX_WIDTH = 2048;
const PROFILE_MAX_HEIGHT = 2048;

const profileUploadBtn = document.getElementById("profile_upload") as HTMLInputElement;
const profilePlaceholder = document.getElementById("Profile_Placeholder") as HTMLImageElement;

const alertBox = document.getElementById("alert-box") as HTMLDivElement;
const alertRedMessages = document.getElementById("alert-red-messages") as HTMLDivElement;

const emailInput = document.getElementById("email") as HTMLInputElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const confirmPasswordInput = document.getElementById("confirm_password") as HTMLInputElement;

const registerButton = document.getElementById("Register_Button") as HTMLButtonElement;

const homepageButton = document.getElementById("Homepage_Button") as HTMLButtonElement;

homepageButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

emailInput.addEventListener("input", () => {
  if (!emailInput.validity.valid) {
    validationMessage("vm-email", "Please enter a valid email address.", true);
  } else {
    validationMessage("vm-email", "", false);
  }
});

usernameInput.addEventListener("input", () => {
  const pattern = /^[A-Za-z0-9_]+$/;

  if (!usernameInput.validity.valid) {
    usernameInput.value.length < usernameInput.minLength
      ? validationMessage(
          "vm-username-minlength",
          `Username must have minimum of a ${usernameInput.minLength} characters.`,
          true,
        )
      : validationMessage("vm-username-minlength", "", false);

    usernameInput.value.length > usernameInput.maxLength
      ? validationMessage(
          "vm-username-maxlength",
          `Username have only a maximum of ${usernameInput.maxLength} characters.`,
          true,
        )
      : validationMessage("vm-username-maxlength", "", false);

    !isNaN(parseInt(usernameInput.value[0]))
      ? validationMessage(
          "vm-username-firstchar",
          "First character in the username must not be a number.",
          true,
        )
      : validationMessage("vm-username-firstchar", "", false);

    !pattern.test(usernameInput.value)
      ? validationMessage(
          "vm-username-pattern",
          "Username must only contain letters, numbers or an underscore.",
          true,
        )
      : validationMessage("vm-username-pattern", "", false);
  } else {
    validationMessage("vm-username", "", false);
    validationMessage("vm-username-minlength", "", false);
    validationMessage("vm-username-maxlength", "", false);
    validationMessage("vm-username-firstchar", "", false);
    validationMessage("vm-username-pattern", "", false);
  }
});

passwordInput.addEventListener("input", () => {
  const digitLookahead = /(?=.*\d)/;
  const lowercaseLookahead = /(?=.*[a-z])/;
  const uppercaseLookahead = /(?=.*[A-Z])/;
  const specialLookahead = /(?=.*[!@#$%^&*])/;
  const spaceLookahead = /\s/;

  if (!passwordInput.validity.valid) {
    passwordInput.value.length < passwordInput.minLength
      ? validationMessage(
          "vm-password-minlength",
          `Password must have a minimum of ${passwordInput.minLength} characters`,
          true,
        )
      : validationMessage("vm-password-minlength", "", false);

    passwordInput.value.length > passwordInput.maxLength
      ? validationMessage(
          "vm-password-maxlength",
          `Password must not exceed ${passwordInput.maxLength}`,
          true,
        )
      : validationMessage("vm-password-maxlength", "", false);

    !digitLookahead.test(passwordInput.value)
      ? validationMessage("vm-password-digits", "Password must contain at least one digit", true)
      : validationMessage("vm-password-digits", "", false);

    !lowercaseLookahead.test(passwordInput.value)
      ? validationMessage(
          "vm-password-lowercase",
          "Password must contain at least one lowercase character",
          true,
        )
      : validationMessage("vm-password-lowercase", "", false);

    !uppercaseLookahead.test(passwordInput.value)
      ? validationMessage(
          "vm-password-uppercase",
          "Password must contain at least one uppercase character",
          true,
        )
      : validationMessage("vm-password-uppercase", "", false);

    !specialLookahead.test(passwordInput.value)
      ? validationMessage(
          "vm-password-special",
          "Password must have atleast one special character (!@#$%^&*)",
          true,
        )
      : validationMessage("vm-password-special", "", false);

    spaceLookahead.test(passwordInput.value)
      ? validationMessage("vm-password-spaces", "Password cannot contain spaces", true)
      : validationMessage("vm-password-spaces", "", false);
  } else {
    validationMessage("vm-password-minlength", "", false);
    validationMessage("vm-password-maxlength", "", false);
    validationMessage("vm-password-digits", "", false);
    validationMessage("vm-password-lowercase", "", false);
    validationMessage("vm-password-uppercase", "", false);
    validationMessage("vm-password-special", "", false);
    validationMessage("vm-password-spaces", "", false);
  }
});

profileUploadBtn.addEventListener("change", () => {
  const imagefile = profileUploadBtn.files?.[0];

  if (imagefile) {
    const image = new Image();
    image.src = URL.createObjectURL(imagefile);

    image.onload = () => {
      const width = image.width;
      const height = image.height;

      console.log(`Image Size -> W: ${width}, H: ${height}`);

      if (
        width >= PROFILE_MIN_WIDTH &&
        width <= PROFILE_MAX_WIDTH &&
        height >= PROFILE_MIN_HEIGHT &&
        height <= PROFILE_MAX_HEIGHT
      ) {
        validationMessage("vm-image-size", "", false);
        console.log(imagefile);
      } else {
        validationMessage(
          "vm-image-size",
          `Image height and width must be between ${PROFILE_MIN_HEIGHT}px and ${PROFILE_MAX_HEIGHT}px.`,
          true,
        );
        console.log("Invalid Image Size");
      }
      profilePlaceholder.src = image.src;
    };
  }
});

function validationMessage(id: string, message: string, appear: boolean) {
  let element = document.createElement("span");
  element.classList.add("mb-2");

  element.id = id;
  element.innerText = message;

  if (appear) {
    if (!document.getElementById(id)) alertRedMessages.appendChild(element);
    if (alertBox.classList.contains("hidden")) alertBox.classList.remove("hidden");
    registerButton.disabled = true;
  } else {
    alertRedMessages.querySelector(`#${id}`)?.remove();
  }

  if (alertRedMessages.children.length === 0) {
    alertBox.classList.add("hidden");
    registerButton.disabled = false;
  }
}

function sendData() {
  const data = {
    email_address: emailInput.value,
    username: usernameInput.value,
    password: passwordInput.value,
  };

  // console.log(JSON.stringify(data));

  fetch("php/registration.php", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}
