const Register_Button = document.getElementById(
  "Register_Button"
) as HTMLButtonElement;
const Login_Button = document.getElementById(
  "Login_Button"
) as HTMLButtonElement;
const ForStudents_Button = document.getElementById(
  "ForStudents_Button"
) as HTMLButtonElement;

const Features_Button = document.getElementById("Features_Button");

Register_Button?.addEventListener("click", () => {
  window.location.href = "registration.html";
});

Login_Button?.addEventListener("click", () => {
  window.location.href = "login.html";
});

ForStudents_Button?.addEventListener("click", () => {
  window.location.href = "check-grades.html";
});

Features_Button?.addEventListener("click", () => {
  let element = document.getElementById("Features_Section") as HTMLElement;

  element.scrollIntoView({
    block: "start", // Scroll the element to the top of the viewport
    behavior: "smooth", // Scroll with smooth animation
  });
});
