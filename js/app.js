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
    myDay: [],
    dailyNote: {
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

        journal.myDay = savedJournal ? savedJournal.myDay : journal.myDay;
        journal.dailyNote = savedJournal ? savedJournal.dailyNote : journal.dailyNote;

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
    const { myDay } = journal;
    e.preventDefault();
    const taskName = document.getElementById("taskTitle").value;
    const taskObject = createTaskObject(taskName, null);

    myDay.unshift(taskObject);
    saveToStorage(storage.journal, journal);
    renderDailyTask();
}

function createTaskObject(taskName, taskDuedate) {
    return { id: makeId(), taskName: taskName, dueDate: taskDuedate, isFinish: false };
}

export function finishTask(e, targetId) {
    const { myDay } = journal;
    const targetTask = myDay.filter((task) => task.id === targetId)[0];
    const idxTaskInMyDay = myDay.findIndex((task) => task.id === targetId);

    const taskObject = { ...targetTask, is_finish: targetTask.is_finish ? false : true };

    myDay.splice(idxTaskInMyDay, 1);

    if (taskObject.is_finish) {
        myDay.push(taskObject);
    } else {
        myDay.unshift(taskObject);
    }

    saveToStorage(storage.journal, journal);
    renderDailyTask();
}

function renderDailyTask() {
    document.dispatchEvent(new Event(RENDER_DAILY_TASK));
}

function displayDailyTask() {
    const { myDay } = journal;

    dailyTaskContainer.innerHTML = "";
    for (const task of myDay) {
        const taskCard = createTask("MYDAY", task);
        dailyTaskContainer.append(taskCard);
    }
}

document.addEventListener(RENDER_DAILY_TASK, displayDailyTask);

// ======= DAILY NOTES
const dailyNoteContainer = document.querySelector(".note_text"),
    dailyNoteControll = document.getElementById("dailyNote_ctrl"),
    dailyNoteInput = document.getElementById("dailyNote_input");

dailyNoteInput.addEventListener("input", getDailyNote);
dailyNoteControll.addEventListener("click", addDailyNote);

function addDailyNote(e) {
    const { dailyNote } = journal;
    dailyNote.isEdit = dailyNote.isEdit ? false : true;

    saveToStorage(storage.journal, journal);
    renderDailyNote();
}

function getDailyNote() {
    const { dailyNote } = journal;

    dailyNote.note = this.value;
    dailyNoteInput.value = dailyNote.note;
}

function displayNote() {
    const { dailyNote } = journal;

    dailyNoteContainer.textContent = dailyNote.note || `🌌 Do not go gentle into that good night. 🌌`;

    if (dailyNote.isEdit) {
        dailyNoteControll.textContent = "Edit Note";
        dailyNoteContainer.style.display = "flex";
        dailyNoteInput.style.display = "none";
    } else {
        dailyNoteControll.textContent = "Add Note";
        dailyNoteContainer.style.display = "none";
        dailyNoteInput.style.display = "flex";
    }

    dailyNoteInput.value = dailyNote.note || "";
}

function renderDailyNote() {
    document.dispatchEvent(new Event(RENDER_NOTE));
}

document.addEventListener(RENDER_NOTE, displayNote);

// ======= ARCHIVE
function clearJournal() {
    journal.dailyNote = { note: "", isEdit: false };
    journal.myDay = [];
}

function createArchiveObject() {
    const { dailyNote, myDay } = journal;
    return { dailyNote, myDay };
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
