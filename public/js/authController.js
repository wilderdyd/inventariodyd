function createUserState() {
    document.getElementById("pCreate").hidden = true;
    btnLogin.hidden = true;
    btnCreate.hidden = false;
    inName.hidden = false;
}

function loginUserState() {
    document.getElementById("pCreate").hidden = false;
    btnLogin.hidden = false;
    btnCreate.hidden = true;
    inName.hidden = true;
    inName.value = "";
    inPassword.value = "";
}

function loginValidate() {
    if (inEmail.value != "" && inPassword.value != "") {
        auth.loginWithEmail(inEmail.value, inPassword.value)
    }
}

function createValidate() {
    if (inEmail.value != "" && inPassword.value != "") {
        auth.createWithEmail(inName.value, inEmail.value, inPassword.value);
    }
}

var btnLogin = document.getElementById("btnLogin");
var btnCreate = document.getElementById("btnCreate");
var inName = document.getElementById("inName");
var inEmail = document.getElementById("inEmail");
var inPassword = document.getElementById("inPassword");

var auth = new Auth();

btnLogin.addEventListener("click", loginValidate);
btnCreate.addEventListener("click", createValidate);
