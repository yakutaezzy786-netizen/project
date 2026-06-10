document
.getElementById("loginBtn")
.addEventListener("click",()=>{

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const user =
    JSON.parse(localStorage.getItem("user"));

    if(
        user &&
        user.email === email &&
        user.password === password
    ){
        window.location.href =
        "dashboard.html";
    }
    else{
        alert("Invalid Credentials");
    }

});