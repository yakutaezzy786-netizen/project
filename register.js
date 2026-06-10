document
.getElementById("registerBtn")
.addEventListener("click", () => {

    const name =
    document.getElementById("name").value.trim();

    const email =
    document.getElementById("email").value.trim();

    const password =
    document.getElementById("password").value.trim();

    // Empty Fields Validation
    if(name === "" || email === "" || password === ""){
        alert("Please fill all fields");
        return;
    }

    // Email Validation
    const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){
        alert("Please enter a valid email address");
        return;
    }

    // Password Length Validation
    if(password.length < 6){
        alert("Password must be at least 6 characters long");
        return;
    }

    const user = {
        name,
        email,
        password
    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    alert("Registration Successful!");

    window.location.href =
    "login.html";

});