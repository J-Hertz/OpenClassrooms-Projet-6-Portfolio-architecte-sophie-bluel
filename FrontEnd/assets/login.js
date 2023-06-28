

async function login() {
    const loginButton = document.querySelector(".loginButton");
  
    loginButton.addEventListener("click", async function(event) {
        
        event.preventDefault();
    
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
            window.localStorage.setItem("loginSuccess", "true");
            const token = window.localStorage.getItem("token");
            //console.log(token);
            window.location.replace("../FrontEnd/index.html");
        } else {
            // Les identifiants sont incorrects, afficher un message d'erreur

            const errorContainer = document.getElementById("errorContainer");
            const error = document.createElement("span");
            error.classList.add("error");
            error.innerHTML = "Identifiants incorrects. Veuillez réessayer.";
            errorContainer.appendChild(error);

            const loginTitle = document.getElementById("loginTitle");
            loginTitle.classList.remove("loginTitle");
            loginTitle.classList.add("loginTitleError");




        }
    });
}


login()