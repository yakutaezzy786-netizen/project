// ==========================
// LOAD USER & SEMESTER
// ==========================

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const semesterKey = "semesters_" + currentUser.email;

const semesterId =
Number(localStorage.getItem("selectedSemester"));

let semesters =
JSON.parse(localStorage.getItem(semesterKey)) || [];

const semester =
semesters.find(s => s.id === semesterId);

if (!semester) {
    window.location.href = "dashboard.html";
}

document.getElementById("semesterName").innerText =
semester.name;

if (!semester.subjects) {
    semester.subjects = [];
}

const subjectList =
document.getElementById("subjectList");

let deleteIndex = null;

// ==========================
// SAVE
// ==========================

function saveData() {
    localStorage.setItem(semesterKey, JSON.stringify(semesters));
}

// ==========================
// UTILITY
// ==========================

function getDaysLeft(date) {
    if (!date) return "-";
    const today = new Date();
    const examDate = new Date(date);
    const diff = examDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function showMessage(text) {
    document.getElementById("messageText").innerText = text;
    document.getElementById("messageModal").style.display = "flex";
}

// ==========================
// RENDER SUBJECTS
// ==========================

function displaySubjects() {

    subjectList.innerHTML = "";

    document.getElementById("subjectCount").innerText =
        semester.subjects.length;

    let upcomingExams = 0;

    if (semester.subjects.length === 0) {
        subjectList.innerHTML = `
            <div class="empty-message">
                No subjects added yet.
            </div>
        `;
        document.getElementById("examCount").innerText = 0;
        return;
    }

    semester.subjects.forEach((subject, index) => {

        if (typeof subject === "string") {
            semester.subjects[index] = {
                name: subject,
                examDate: "",
                priority: "Medium",
                files: []
            };
            subject = semester.subjects[index];
            saveData();
        }

        const daysLeft = getDaysLeft(subject.examDate);

        if (daysLeft !== "-" && daysLeft >= 0) {
            upcomingExams++;
        }

        let fileHTML = "";

        if (subject.files && subject.files.length > 0) {
            subject.files.forEach(file => {
                fileHTML += `<li>📄 ${file}</li>`;
            });
        } else {
            fileHTML = `<li>No files uploaded</li>`;
        }

        const card = document.createElement("div");
        card.classList.add("subject-card");

        card.innerHTML = `
            <h3>📖 ${subject.name}</h3>
            <p>📅 Exam Date: ${subject.examDate || "Not Set"}</p>
            <p>⭐ Priority: ${subject.priority}</p>
            <p>⏳ Days Left: ${daysLeft}</p>
            <div class="file-section">
                <h4>Uploaded Files</h4>
                <ul class="file-list">
                    ${fileHTML}
                </ul>
                <input type="file"
                    class="file-input"
                    onchange="uploadFile(${index}, this)">
            </div>
            <button class="delete-btn"
                onclick="deleteSubject(${index})">
                Delete Subject
            </button>
        `;

        subjectList.appendChild(card);
    });

    document.getElementById("examCount").innerText = upcomingExams;
}

// ==========================
// ADD SUBJECT
// ==========================

document.getElementById("addSubjectBtn")
.addEventListener("click", () => {

    const name =
    document.getElementById("subjectInput").value.trim();

    const examDate =
    document.getElementById("examDate").value;

    const priority =
    document.getElementById("priority").value;

    if (name === "") {
        showMessage("Please enter subject name.");
        return;
    }

    if (examDate === "") {
        showMessage("Please select exam date.");
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(examDate);

    if (selectedDate < today) {
        showMessage("Exam date cannot be in the past.");
        return;
    }

    semester.subjects.push({
        name,
        examDate,
        priority,
        files: []
    });

    saveData();

    document.getElementById("subjectInput").value = "";
    document.getElementById("examDate").value = "";

    displaySubjects();

    showMessage("Subject added successfully!");
});

// ==========================
// FILE UPLOAD
// ==========================

function uploadFile(index, input) {
    const file = input.files[0];
    if (!file) return;
    semester.subjects[index].files.push(file.name);
    saveData();
    displaySubjects();
    showMessage("File uploaded successfully!");
}

// ==========================
// DELETE SUBJECT
// ==========================

function deleteSubject(index) {
    deleteIndex = index;
    document.getElementById("deleteModal").style.display = "flex";
}

document.getElementById("messageOkBtn")
.addEventListener("click", () => {
    document.getElementById("messageModal").style.display = "none";
});

document.getElementById("cancelDeleteBtn")
.addEventListener("click", () => {
    document.getElementById("deleteModal").style.display = "none";
});

document.getElementById("confirmDeleteBtn")
.addEventListener("click", () => {
    semester.subjects.splice(deleteIndex, 1);
    saveData();
    displaySubjects();
    document.getElementById("deleteModal").style.display = "none";
    showMessage("Subject deleted successfully!");
});

// ==========================
// NAVIGATION
// ==========================

function openRevision() {
    window.location.href = "revision.html";
}

// ==========================
// INITIAL LOAD
// ==========================

displaySubjects();