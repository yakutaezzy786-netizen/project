// ==========================
// LOAD USER & DATA
// ==========================

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const semesterKey = "semesters_" + currentUser.email;

const semesters =
JSON.parse(localStorage.getItem(semesterKey)) || [];

const selectedSemesterId =
localStorage.getItem("selectedSemester");

const semester =
semesters.find(s => s.id == selectedSemesterId);

const subjects =
semester?.subjects || [];

// ==========================
// STREAK
// ==========================

const streakKey = "streak_" + currentUser.email;
const lastVisitKey = "lastVisit_" + currentUser.email;

const today = new Date().toDateString();
const lastVisit = localStorage.getItem(lastVisitKey);

let streak = parseInt(localStorage.getItem(streakKey)) || 0;

if(lastVisit === today){
    // same day, keep streak
} else if(lastVisit === new Date(Date.now() - 86400000).toDateString()){
    // visited yesterday, increase streak
    streak++;
    localStorage.setItem(streakKey, streak);
} else {
    // missed a day, reset streak
    streak = 1;
    localStorage.setItem(streakKey, streak);
}

localStorage.setItem(lastVisitKey, today);

const streakEl = document.getElementById("streakCount");
if(streakEl){
    streakEl.innerText = streak + (streak === 1 ? " Day 🔥" : " Days 🔥");
}

// ==========================
// FOCUS SUBJECT
// ==========================

if(subjects.length){

    const focus =
    [...subjects].sort((a,b)=>
        new Date(a.examDate) -
        new Date(b.examDate)
    )[0];

    const daysLeft =
    Math.ceil(
        (new Date(focus.examDate)-new Date())
        /(1000*60*60*24)
    );

    const focusEl = document.getElementById("focusSubject");
    if(focusEl){
        focusEl.innerHTML = `
            <h3>${focus.name}</h3>
            <p>📅 ${daysLeft} days left</p>
        `;
    }
}

// ==========================
// TASKS
// ==========================

const taskList = document.getElementById("taskList");

if(taskList){
    subjects.forEach((subject, index)=>{
        const task = document.createElement("div");
        task.className = "task-item";
        task.innerHTML = `
        <label>
            <input
            type="checkbox"
            class="taskCheck"
            data-index="${index}">
            Revise ${subject.name}
        </label>
        `;
        taskList.appendChild(task);
    });
}

updateProgress();

document.addEventListener("change", e=>{
    if(e.target.classList.contains("taskCheck")){
        updateProgress();
    }
});

// ==========================
// PROGRESS
// ==========================

function updateProgress(){

    const total =
    document.querySelectorAll(".taskCheck").length;

    const done =
    document.querySelectorAll(".taskCheck:checked").length;

    const percent =
    total ? Math.round((done/total)*100) : 0;

    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    if(progressFill) progressFill.style.width = percent+"%";
    if(progressText) progressText.innerText = percent+"%";

    updateSummary(done);
}

// ==========================
// WEEKLY SUMMARY
// ==========================

function updateSummary(done){

    const weeklySummary = document.getElementById("weeklySummary");

    if(weeklySummary){
        weeklySummary.innerHTML = `
            <div class="summary-box">
                ✅ Tasks Completed: ${done}
            </div>
            <div class="summary-box">
                📚 Subjects: ${subjects.length}
            </div>
            <div class="summary-box">
                🔥 Streak: ${streak} Day${streak === 1 ? "" : "s"}
            </div>
        `;
    }
}

// ==========================
// QUICK REVISION
// ==========================

const randomSubject = document.getElementById("randomSubject");

function pickRandom(){
    if(subjects.length===0){
        if(randomSubject) randomSubject.innerText = "No Subject Found";
        return;
    }
    const subject =
    subjects[Math.floor(Math.random()*subjects.length)];
    if(randomSubject) randomSubject.innerText = subject.name;
}

pickRandom();

document.getElementById("pickSubjectBtn")
?.addEventListener("click", pickRandom);

// ==========================
// TIMER
// ==========================

let timer = 1500;
let interval;

const timerDisplay = document.getElementById("timerDisplay");

function showTimer(){
    const mins = Math.floor(timer/60);
    const secs = timer%60;
    if(timerDisplay){
        timerDisplay.innerText =
        `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
    }
}

showTimer();

document.getElementById("startBtn")?.addEventListener("click", ()=>{
    clearInterval(interval);
    interval = setInterval(()=>{
        if(timer>0){
            timer--;
            showTimer();
        }
    },1000);
});

document.getElementById("pauseBtn")?.addEventListener("click", ()=>{
    clearInterval(interval);
});

document.getElementById("resetBtn")?.addEventListener("click", ()=>{
    clearInterval(interval);
    timer = 1500;
    showTimer();
});

// ==========================
// NOTIFICATIONS
// ==========================

document.getElementById("notificationBtn")?.addEventListener("click", ()=>{

    const notificationModal = document.getElementById("notificationModal");
    if(notificationModal) notificationModal.style.display = "flex";

    const list = document.getElementById("notificationList");
    if(list){
        list.innerHTML = "";
        subjects.forEach(subject=>{
            const days =
            Math.ceil(
                (new Date(subject.examDate)-new Date())
                /(1000*60*60*24)
            );
            list.innerHTML += `<p>📢 ${subject.name} exam in ${days} days</p>`;
        });
    }
});

function closeNotifications(){
    const notificationModal = document.getElementById("notificationModal");
    if(notificationModal) notificationModal.style.display = "none";
}

// ==========================
// NOTES
// ==========================

const textarea = document.getElementById("notes");

if(textarea){
    textarea.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    });
}