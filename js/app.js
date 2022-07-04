import { createTask } from "./htmlElement.js";
import { makeId } from "./util.js";

const userHabits = [];
const userTasks = [];
const journal = {
    my_day: [],
    daily_note: {
        note: "",
        isEdit: false,
    },
};
const userArchives = [];

// ======= RENDER EVENTS
const RENDER_NOTE = "RENDER_NOTE";
const RENDER_DAILY_TASK = "RENDER_DAILY_TASK";

// ======= DAILY TASKS
const dailyTaskForm = document.getElementById("myDay_form");
const dailyTaskContainer = document.getElementById("myDay_tasks");

document.addEventListener("DOMContentLoaded", () => {
    dailyTaskForm.addEventListener("submit", (e) => {
        addDailyTask(e);
    });
});

function addDailyTask(e) {
    const { my_day } = journal;
    e.preventDefault();
    const taskName = document.getElementById("taskTitle").value;
    const taskObject = createTaskObject(taskName, null);

    my_day.unshift(taskObject);
    renderDailyTask();
}

function createTaskObject(taskName, taskDuedate) {
    return { id: makeId(), task_title: taskName, due_date: taskDuedate, is_finish: false };
}

export function finishTask(e, targetId) {
    const { my_day } = journal;
    const targetTask = my_day.filter((task) => task.id === targetId)[0];
    const idxTaskInMyDay = my_day.findIndex((task) => task.id === targetId);

    const taskObject = { ...targetTask, is_finish: targetTask.is_finish ? false : true };

    my_day.splice(idxTaskInMyDay, 1, taskObject);
    renderDailyTask();
}

function renderDailyTask() {
    document.dispatchEvent(new Event(RENDER_DAILY_TASK));
}

function displayDailyTask() {
    const { my_day } = journal;

    dailyTaskContainer.innerHTML = "";
    for (const task of my_day) {
        const taskCard = createTask("MYDAY", task);
        dailyTaskContainer.append(taskCard);
    }
}

document.addEventListener(RENDER_DAILY_TASK, displayDailyTask);

// ======= DAILY NOTES
const dailyNote = document.querySelector(".note_text");
const dailyNoteControll = document.getElementById("dailyNote_ctrl");
const dailyNoteInput = document.getElementById("dailyNote_input");

dailyNoteInput.addEventListener("input", getDailyNote);
dailyNoteControll.addEventListener("click", addDailyNote);

let noteInput;
function addDailyNote(e) {
    const { daily_note } = journal;
    daily_note.note = noteInput;
    daily_note.isEdit = daily_note.isEdit ? false : true;

    console.log("addDailyNote", daily_note);
    renderDailyNote();
}

function getDailyNote() {
    noteInput = this.value;
}

function displayNote() {
    const { daily_note } = journal;
    dailyNote.textContent = daily_note.note || `🌌 Do not go gentle into that good night. 🌌`;

    if (daily_note.isEdit) {
        dailyNoteControll.textContent = "Edit Note";
        dailyNote.style.display = "flex";
        dailyNoteInput.style.display = "none";
    } else {
        dailyNoteControll.textContent = "Add Note";
        dailyNote.style.display = "none";
        dailyNoteInput.style.display = "flex";
        dailyNoteInput.value = daily_note.note || "";
    }
}

function renderDailyNote() {
    document.dispatchEvent(new Event(RENDER_NOTE));
}

document.addEventListener(RENDER_NOTE, displayNote);

// ======= ARCHIVE
function clearJournal() {
    journal.daily_note = { note: "", isEdit: false };
    journal.my_day = [];
}

function createArchiveObject() {
    const { daily_note, my_day } = journal;
    return { daily_note, my_day };
}

function addToArchive() {
    userArchives.push(createArchiveObject());
}

// ======= DIALOG
export function openModal(targetId) {
    const targetDialog = document.getElementById(targetId);
    document.body.style.overflow = "hidden";
    targetDialog.showModal();
}

export function closeModal(targetId) {
    const targetDialog = document.getElementById(targetId);
    document.body.style.overflow = "auto";
    targetDialog.close();
}

document.getElementById("myDay_addTask").addEventListener("click", () => openModal("myDay_dialog"));
document.getElementById("myDay_cancelTask").addEventListener("click", () => closeModal("myDay_dialog"));
