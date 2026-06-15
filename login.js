let generatedOTP = "";
let otpVerified = false;





// ---------------- LOGIN ----------------

document.getElementById("loginBtn")
.addEventListener("click", () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "dashboard.html";
    } else {
    showPopup("Login Failed", "Invalid email or password");
    }

});

// ---------------- TOGGLE SECTIONS ----------------

const loginSection = document.getElementById("loginSection");
const forgotSection = document.getElementById("forgotSection");

document.getElementById("forgotToggle")
.addEventListener("click", () => {
    loginSection.style.display = "none";
    forgotSection.style.display = "block";
});

document.getElementById("backToLogin")
.addEventListener("click", () => {
    forgotSection.style.display = "none";
    loginSection.style.display = "block";
});

// ---------------- VERIFY USER ----------------

document.getElementById("verifyBtn")
.addEventListener("click", () => {

    const email =
    document.getElementById(
        "forgotEmail"
    ).value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email);

    if(user){

        generatedOTP =
        Math.floor(
        100000 + Math.random() * 900000
        ).toString();

    console.log(generatedOTP);

        emailjs.send(
            "service_lf07mrd",
            "template_aex14ug",
            {
                email: email,
                otp: generatedOTP
            }
        )
        .then(() => {

            document.getElementById(
                "otpBox"
            ).style.display = "block";

            showPopup(
                "OTP Sent",
                "Check your email"
            );

        })
        .catch(() => {

            showPopup(
                "Error",
                "Failed to send OTP"
            );

        });

    }
    else{

        showPopup(
            "Error",
            "User not found"
        );

    }

});

document.getElementById("verifyOtpBtn")
.addEventListener("click", () => {

    const enteredOTP =
    document.getElementById(
        "otpInput"
    ).value.trim();

    if(enteredOTP === generatedOTP){

        otpVerified = true;

        document.getElementById(
            "resetBox"
        ).style.display = "block";

        showPopup(
            "Success",
            "OTP Verified"
        );

    }
    else{

        showPopup(
            "Error",
            "Incorrect OTP"
        );

    }

});

// ---------------- RESET PASSWORD ----------------

document.getElementById("resetBtn")
.addEventListener("click", () => {

    if(!otpVerified){

    showPopup(
        "Error",
        "Please verify OTP first"
    );

    return;
}

    const newPass = document.getElementById("newPass").value;
    const confirmPass = document.getElementById("confirmPass").value;
    const email = document.getElementById("forgotEmail").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
    showPopup("Error", "Invalid request");
    return;
    }

    const user = users[userIndex];

    if (newPass === "" || confirmPass === "") {
        showPopup("Error", "Please fill all fields");
        return;
    }

    if (newPass !== confirmPass) {
        showPopup("Error", "Passwords do not match");
        return;
    }

    users[userIndex].password = newPass;

    localStorage.setItem("users", JSON.stringify(users));

    showPopup("Success", "Password updated successfully");

    forgotSection.style.display = "none";
    loginSection.style.display = "block";

    document.getElementById("resetBox").style.display = "none";
});

// ---------------- POPUP SYSTEM ----------------

function showPopup(title, message){
    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popupMessage").innerText = message;
    document.getElementById("popupOverlay").style.display = "flex";
}

document.getElementById("popupBtn")
.addEventListener("click", () => {
    document.getElementById("popupOverlay").style.display = "none";
});