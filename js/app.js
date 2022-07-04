import { createTask } from "./htmlElement.js";
import { makeId } from "./util.js";
import {
    isStorageAvailable,
    saveToStorage,
    getItemFromStorage,
    removeItemFromStorage,
    dispatchStorageEvent,
} from "./storage.js";

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

const storage = {
    journal: "JOURNAL",
    userTasks: "USER_TASKS",
    userHabits: "USER_HABITS",
};
// check for local storage support

document.addEventListener("DOMContentLoaded", () => {
    if (isStorageAvailable()) {
        const savedJournal = getItemFromStorage(storage.journal);

        journal.my_day = savedJournal ? savedJournal.my_day : journal.my_day;
        journal.daily_note = savedJournal ? savedJournal.daily_note : journal.daily_note;

        renderDailyTask();
        renderDailyNote();
    }
});

// ======= RENDER AND STORAGE EVENTS
const RENDER_NOTE = "RENDER_NOTE",
    RENDER_DAILY_TASK = "RENDER_DAILY_TASK",
    RENDER_HABITS = "RENDER_HABITS",
    RENDER_TASKS = "RENDER_TASKS",
    RENDER_ARCHIVE = "RENDER_ARCHIVE",
    STORAGE_EVENT = "STORAGE_EVENT";

// ======= LOCAL STORAGE
document.addEventListener(STORAGE_EVENT, () => {
    console.log(JSON.parse(localStorage.getItem(storage.journal)));
    console.log(JSON.parse(localStorage.getItem(storage.userTasks)));
    console.log(JSON.parse(localStorage.getItem(storage.userHabits)));
});

// ======= DAILY TASKS
const dailyTaskForm = document.getElementById("myDay_form"),
    dailyTaskContainer = document.getElementById("myDay_tasks");

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
    saveToStorage(storage.journal, journal);
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

    my_day.splice(idxTaskInMyDay, 1);

    if (taskObject.is_finish) {
        my_day.push(taskObject);
    } else {
        my_day.unshift(taskObject);
    }

    saveToStorage(storage.journal, journal);
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
const dailyNote = document.querySelector(".note_text"),
    dailyNoteControll = document.getElementById("dailyNote_ctrl"),
    dailyNoteInput = document.getElementById("dailyNote_input");

dailyNoteInput.addEventListener("input", getDailyNote);
dailyNoteControll.addEventListener("click", addDailyNote);

function addDailyNote(e) {
    const { daily_note } = journal;
    daily_note.isEdit = daily_note.isEdit ? false : true;

    saveToStorage(storage.journal, journal);
    renderDailyNote();
}

function getDailyNote() {
    const { daily_note } = journal;

    daily_note.note = this.value;
    dailyNoteInput.value = daily_note.note;
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
    }

    dailyNoteInput.value = daily_note.note || "";
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
