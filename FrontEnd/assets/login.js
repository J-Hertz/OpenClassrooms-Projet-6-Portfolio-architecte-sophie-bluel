

function login() {
    const loginForms = document.querySelector(".loginButton");
  
    loginForms.addEventListener("click", async function(event) {
        
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
        const token = data.token;
        console.log(token);
    });
}

login()