function showPopup(message){

    document
    .getElementById(
    "popupMessage"
    )
    .innerText =
    message;

    document
    .getElementById(
    "popup"
    )
    .style.display =
    "flex"; 
}

document
.getElementById(
"registerBtn"
)
.addEventListener(
"click",
()=>{

    const name =
    document
    .getElementById(
    "name"
    )
    .value;

    const email =
    document
    .getElementById(
    "email"
    )
    .value;

    const password =
    document
    .getElementById(
    "password"
    )
    .value;

    const user = {

        name,
        email,
        password

    };

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    showPopup(
    "Registration Successful!"
    );

});

document
.getElementById(
"popupBtn"
)
.addEventListener(
"click",
()=>{

    window.location.href =
    "login.html";

});