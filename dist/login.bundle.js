(()=>{"use strict";var e={769:(e,t,n)=>{n.d(t,{C2:()=>o,h6:()=>r,s6:()=>s});const o="../../api/login.php",s="../../",r="../dashboard"}},t={};function n(o){var s=t[o];if(void 0!==s)return s.exports;var r=t[o]={exports:{}};return e[o](r,r.exports,n),r.exports}n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e=n(769);const t=document.getElementById("Homepage_Button"),o=document.getElementById("email_username"),s=document.getElementById("password"),r=document.getElementById("login_button"),a=document.getElementById("alert"),l=document.getElementById("spinner");function d(e,t){e?(a.classList.remove("hidden"),a.querySelector("span").innerText=t):(a.classList.add("hidden"),l.classList.add("hidden"))}function i(t){var n;sessionStorage.setItem("token",null!==(n=t.data.token)&&void 0!==n?n:""),400===t.status&&d(!0,t.message),t.data.user&&(window.location.href=e.s6),t.data.redirect&&(window.location.href=e.h6)}r.addEventListener("click",(function(){const t=o.value,n=s.value;return t.length&&n.length?(d(!1,""),function(){l.classList.remove("hidden");let t={credential:o.value.toLowerCase(),password:s.value};$.ajax({type:"POST",url:e.C2,data:"login="+JSON.stringify(t),success:function(e){console.log("Successful Response: ",e),i(JSON.parse(e))},error:function(e,t,n){console.log("XHR Status: ",e.status),console.log("XHR Text: ",e.responseText),console.log("Status: ",t),console.error("Error: ",n),i(JSON.parse(e.responseText))}}),l.classList.add("hidden")}()):d(!0,"Please enter the missing fields")})),t.addEventListener("click",(()=>{window.location.href=e.s6}))})(),(()=>{var e=n(769);const t=document.getElementById("Homepage_Button"),o=document.getElementById("email_username"),s=document.getElementById("password"),r=document.getElementById("login_button"),a=document.getElementById("alert"),l=document.getElementById("spinner");function d(e,t){e?(a.classList.remove("hidden"),a.querySelector("span").innerText=t):(a.classList.add("hidden"),l.classList.add("hidden"))}function i(t){var n;sessionStorage.setItem("token",null!==(n=t.data.token)&&void 0!==n?n:""),400===t.status&&d(!0,t.message),t.data.user&&(window.location.href=e.s6),t.data.redirect&&(window.location.href=e.h6)}r.addEventListener("click",(function(){const t=o.value,n=s.value;return t.length&&n.length?(d(!1,""),function(){l.classList.remove("hidden");let t={credential:o.value.toLowerCase(),password:s.value};$.ajax({type:"POST",url:e.C2,data:"login="+JSON.stringify(t),success:function(e){console.log("Successful Response: ",e),i(JSON.parse(e))},error:function(e,t,n){console.log("XHR Status: ",e.status),console.log("XHR Text: ",e.responseText),console.log("Status: ",t),console.error("Error: ",n),i(JSON.parse(e.responseText))}}),l.classList.add("hidden")}()):d(!0,"Please enter the missing fields")})),t.addEventListener("click",(()=>{window.location.href=e.s6})),document.addEventListener("DOMContentLoaded",(function(){var t;const n={request:"login",token:null!==(t=sessionStorage.getItem("token"))&&void 0!==t?t:""};$.ajax({type:"POST",url:e.C2,data:"session="+JSON.stringify(n),success:function(t){console.log("Successful Response: ",t),JSON.parse(t).data.redirect&&(window.location.href=e.h6)},error:function(e,t,n){console.log("XHR Status: ",e.status),console.log("XHR Text: ",e.responseText),console.log("Status: ",t),console.error("Error: ",n),i(JSON.parse(e.responseText))}})}))})()})();