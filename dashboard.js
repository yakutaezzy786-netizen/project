// Welcome User

const user = JSON.parse(localStorage.getItem("user"));

if(user){
    document.getElementById("welcomeText").innerText =
    `Welcome, ${user.name} 👋`;
}

// Load Semesters

let semesters =
JSON.parse(localStorage.getItem("semesters")) || [];

const semesterList =
document.getElementById("semesterList");

// Display Semesters

function displaySemesters(){

    semesterList.innerHTML = "";

    document.getElementById("semesterCount").innerText =
    semesters.length;

    semesters.forEach((semester,index)=>{

        const card = document.createElement("div");

        card.classList.add("semester-card");

        card.innerHTML = `
            <div class="semester-header">
                <h3>📚 ${semester.name}</h3>

                <span
                    class="delete-icon"
                    onclick="deleteSemester(${index})">
                    🗑️
                </span>
            </div>
        `;

        semesterList.appendChild(card);

    });

}

// Add Semester

document
.getElementById("addSemesterBtn")
.addEventListener("click",()=>{

    const semesterName =
    prompt("Enter Semester Name");

    if(!semesterName){
        return;
    }

    semesters.push({
        id: Date.now(),
        name: semesterName,
        subjects: []
    });

    localStorage.setItem(
        "semesters",
        JSON.stringify(semesters)
    );

    displaySemesters();

});

// Delete Semester

function deleteSemester(index){

    const confirmDelete =
    confirm("Delete this semester?");

    if(!confirmDelete){
        return;
    }

    semesters.splice(index,1);

    localStorage.setItem(
        "semesters",
        JSON.stringify(semesters)
    );

    displaySemesters();

}

// Initial Load

displaySemesters();