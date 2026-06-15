// ==========================
// THEME
// ==========================

const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('themeToggle');
  if(!btn) return;

  btn.textContent = document.body.dataset.theme === 'dark' ? '☀️' : '🌙';

  btn.addEventListener('click', () => {
    const current = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', current);
    localStorage.setItem('theme', current);
    btn.textContent = current === 'dark' ? '☀️' : '🌙';
  });
});

document.getElementById("logoutBtn")
?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
});

// ==========================
// LOAD DATA
// ==========================

const user = JSON.parse(localStorage.getItem("currentUser"));
const semesterKey = "semesters_" + user.email;

const welcomeText = document.getElementById("welcomeText");
if (user && welcomeText) {
    welcomeText.innerText = `Welcome back, ${user.name} 👋`;
}

let semesters = JSON.parse(localStorage.getItem(semesterKey)) || [];

const semesterList = document.getElementById("semesterList");
const semesterModal = document.getElementById("semesterModal");
const semesterInput = document.getElementById("semesterInput");
const deleteModal = document.getElementById("deleteModal");

let semesterToDelete = null;

// ==========================
// EXAM FUNCTIONS
// ==========================

function getDaysLeft(date) {
    if (!date) return -1;
    const today = new Date();
    const examDate = new Date(date);
    const diff = examDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function calculateTotalUpcomingExams() {
    let count = 0;
    semesters.forEach((semester) => {
        const subjects = Array.isArray(semester.subjects) ? semester.subjects : [];
        subjects.forEach((subject) => {
            if (subject.examDate) {
                const days = getDaysLeft(subject.examDate);
                if (days >= 0) count++;
            }
        });
    });
    return count;
}

// ==========================
// TODAY FOCUS
// ==========================

function updateFocus() {
    const focus = document.getElementById("todayFocus");
    if (!focus) return;
    let totalSubjects = 0;
    semesters.forEach((semester) => {
        totalSubjects += (semester.subjects || []).length;
    });
    focus.innerText = `${totalSubjects} Subjects • ${calculateTotalUpcomingExams()} Exams`;
}

// ==========================
// EXAM PREVIEW
// ==========================

function renderExamPreview() {
    const examPreview = document.getElementById("examPreview");
    if (!examPreview) return;
    examPreview.innerHTML = "";
    let exams = [];
    semesters.forEach((semester) => {
        (semester.subjects || []).forEach((subject) => {
            if (subject.examDate) {
                exams.push({ name: subject.name, date: subject.examDate });
            }
        });
    });
    if (exams.length === 0) {
        examPreview.innerHTML = `<div class="empty-box">No upcoming exams</div>`;
        return;
    }
    exams.sort((a, b) => new Date(a.date) - new Date(b.date));
    exams.forEach((exam) => {
        const card = document.createElement("div");
        card.classList.add("semester-card");
        card.innerHTML = `
            <h3>📅 ${exam.name}</h3>
            <p class="semester-label">${exam.date}</p>
        `;
        examPreview.appendChild(card);
    });
}

// ==========================
// DISPLAY SEMESTERS
// ==========================

function displaySemesters() {
    if (!semesterList) return;
    semesterList.innerHTML = "";
    let totalSubjects = 0;
    semesters.forEach((semester) => {
        totalSubjects += (semester.subjects || []).length;
    });

    const semesterCountHero = document.getElementById("semesterCountHero");
    const subjectCountHero = document.getElementById("subjectCountHero");
    const examCountHero = document.getElementById("examCountHero");

    if (semesterCountHero) semesterCountHero.innerText = semesters.length;
    if (subjectCountHero) subjectCountHero.innerText = totalSubjects;
    if (examCountHero) examCountHero.innerText = calculateTotalUpcomingExams();

    semesters.forEach((semester, index) => {
        const card = document.createElement("div");
        card.classList.add("semester-card");
        card.innerHTML = `
            <div class="semester-header">
                <h3 class="semester-title" onclick="openSemester(${semester.id})">
                    📚 ${semester.name}
                </h3>
                <span class="delete-icon" onclick="deleteSemester(${index})">🗑️</span>
            </div>
            <p class="semester-label">Open Workspace →</p>
        `;
        semesterList.appendChild(card);
    });

    updateFocus();
    renderExamPreview();
}

// ==========================
// OPEN SEMESTER
// ==========================

function openSemester(id) {
    localStorage.setItem("selectedSemester", id);
    window.location.assign("./semester.html");
}

// ==========================
// ADD SEMESTER
// ==========================

document.getElementById("addSemesterBtn")?.addEventListener("click", () => {
    semesterModal.style.display = "flex";
});

document.getElementById("closeModalBtn")?.addEventListener("click", () => {
    semesterModal.style.display = "none";
    semesterInput.value = "";
});

// ==========================
// SAVE SEMESTER
// ==========================

document.getElementById("saveSemesterBtn")?.addEventListener("click", () => {
    const semesterName = semesterInput.value.trim();
    if (semesterName === "") {
        alert("Please enter semester name");
        return;
    }
    semesters.push({ id: Date.now(), name: semesterName, subjects: [] });
    localStorage.setItem(semesterKey, JSON.stringify(semesters));
    displaySemesters();
    semesterInput.value = "";
    semesterModal.style.display = "none";
});

// ==========================
// DELETE SEMESTER
// ==========================

function deleteSemester(index) {
    semesterToDelete = index;
    deleteModal.style.display = "flex";
}

document.getElementById("confirmDeleteBtn")?.addEventListener("click", () => {
    if (semesterToDelete !== null) {
        semesters.splice(semesterToDelete, 1);
        localStorage.setItem(semesterKey, JSON.stringify(semesters));
        displaySemesters();
    }
    deleteModal.style.display = "none";
    semesterToDelete = null;
});

document.getElementById("cancelDeleteBtn")?.addEventListener("click", () => {
    deleteModal.style.display = "none";
    semesterToDelete = null;
});

// ==========================
// INITIAL LOAD
// ==========================

displaySemesters();