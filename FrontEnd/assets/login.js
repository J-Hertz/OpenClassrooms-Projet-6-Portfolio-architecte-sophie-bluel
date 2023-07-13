

async function login() {
  const forms = {
    email: document.querySelector("[name=email]").value,
    password: document.querySelector("[name=password]").value,
  };

  const payload = JSON.stringify(forms);

  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });

  const data = await response.json();

  if (response.ok) {
    // Les identifiants sont corrects, continuer avec le token
    window.localStorage.setItem("token", data.token);
    const token = window.localStorage.getItem("token");
    window.location.replace("../FrontEnd/index.html");
  } else {
    const email = document.querySelector("[name=email]");
    const password = document.querySelector("[name=password]");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    if (!validateEmail(email.value)) {
      if (emailError) {
        emailError.remove();
      }
      loginForms = document.getElementById("loginForms");
      loginForms.classList.add("loginFormsErrorMargin");

      const newEmailError = document.createElement("span");
      newEmailError.classList.add("error");
      newEmailError.classList.add("loginErrorMargin")
      newEmailError.setAttribute("id", "emailError");
      newEmailError.innerHTML = "Veuillez renseigner une adresse email valide.";
      email.parentNode.insertBefore(newEmailError, email.nextSibling);
      if (passwordError) {
        passwordError.remove();
      }
    } else if (!validatePassword(password.value)) {
      if (passwordError) {
        passwordError.remove();
      }
      loginForms = document.getElementById("loginForms");
      loginForms.classList.add("loginFormsErrorMargin");

      const newPasswordError = document.createElement("span");
      newPasswordError.classList.add("error");
      newPasswordError.classList.add("loginErrorMargin")
      newPasswordError.setAttribute("id", "passwordError");
      newPasswordError.innerHTML = "Le mot de passe doit comporter au moins 6 caractères dont une lettre et un chiffre.";
      password.parentNode.insertBefore(newPasswordError, password.nextSibling);
      if (emailError) {
        emailError.remove();
      }
    } else {
      if (emailError) {
        emailError.remove();
      }
      if (passwordError) {
        passwordError.remove();
      }
      const previousError = document.querySelector(".error");
      if (previousError) {
        previousError.remove();
      }
      const errorContainer = document.getElementById("errorContainer");
      const loginError = document.createElement("span");
      loginError.classList.add("error");
      loginError.innerHTML = "Identifiants incorrects. Veuillez réessayer.";
      errorContainer.appendChild(loginError);

      const loginTitle = document.getElementById("loginTitle");
      loginTitle.classList.remove("loginTitle");
      loginTitle.classList.add("loginTitleError");
    }
  }
}



async function addClickLogin() {
  const loginButton = document.querySelector(".loginButton");

  loginButton.addEventListener("click", async function(event) {
      
      event.preventDefault();
      login();
  });
}

async function addEnterKeyLogin() {
  const loginForm = document.getElementById("loginForms");

  loginForm.addEventListener("keypress", async function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      login();
    }   
  });
}

async function startLogin() {
  addClickLogin();
  addEnterKeyLogin();
}

function validateEmail(mail) {
  const emailInput= document.getElementById("email");
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInput.value)) {
    return (true)
  }
    return (false)
  
}

function validatePassword(password) {
  const passwordInput = document.getElementById("password");
  if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/.test(passwordInput.value)) {
    return true;
  }
  return false;
}

startLogin();
