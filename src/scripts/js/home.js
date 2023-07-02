"use strict";
const Register_Button = document.getElementById("Register_Button");
const Login_Button = document.getElementById("Login_Button");
const ForStudents_Button = document.getElementById("ForStudents_Button");
const Features_Button = document.getElementById("Features_Button");
Register_Button === null || Register_Button === void 0 ? void 0 : Register_Button.addEventListener("click", () => {
    window.location.href = "registration.html";
});
Login_Button === null || Login_Button === void 0 ? void 0 : Login_Button.addEventListener("click", () => {
    window.location.href = "login.html";
});
ForStudents_Button === null || ForStudents_Button === void 0 ? void 0 : ForStudents_Button.addEventListener("click", () => {
    window.location.href = "check-grades.html";
});
Features_Button === null || Features_Button === void 0 ? void 0 : Features_Button.addEventListener("click", () => {
    let element = document.getElementById("Features_Section");
    element.scrollIntoView({
        block: "start",
        behavior: "smooth",
    });
});
