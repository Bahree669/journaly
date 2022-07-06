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
        const savedUserTask = getItemFromStorage(storage.userTasks);

        journal.myDay = savedJournal ? savedJournal.myDay : journal.myDay;
        journal.dailyNote = savedJournal ? savedJournal.dailyNote : journal.dailyNote;

        if (savedUserTask) for (const task of savedUserTask) userTasks.push(task);

        renderDailyTask();
        renderDailyNote();
        renderUserTasks();
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
    const { journal, userHabits, userTasks } = storage;
    const a = getItemFromStorage(journal),
        b = getItemFromStorage(userTasks),
        c = getItemFromStorage(userHabits);

    console.log({ a, b, c });
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

export function finishDailyTask(targetId) {
    const { myDay } = journal;
    const targetTask = myDay.filter((task) => task.id === targetId)[0];
    const idxTaskInMyDay = myDay.findIndex((task) => task.id === targetId);

    const taskObject = { ...targetTask, isFinish: targetTask.isFinish ? false : true };

    myDay.splice(idxTaskInMyDay, 1);

    // Move the finished task to bottom
    if (taskObject.isFinish) {
        myDay.push(taskObject);
    } else {
        myDay.unshift(taskObject);
    }

    saveToStorage(storage.journal, journal);
    renderDailyTask();
}

export function editDailyTask(targetId) {
    const { myDay } = journal;
    const targetTask = myDay.filter((task) => task.id === targetId)[0];
    const idxTaskInMyDay = myDay.findIndex((task) => task.id === targetId);
    const taskName = document.getElementById("taskInput_" + targetId).value;

    const taskObject = { ...targetTask, taskName };

    myDay.splice(idxTaskInMyDay, 1);
    myDay.unshift(taskObject);

    saveToStorage(storage.journal, journal);
    renderDailyTask();
}

export function deleteDailyTask(targetId) {
    const { myDay } = journal;
    const idxTaskInMyDay = myDay.findIndex((task) => task.id === targetId);
    myDay.splice(idxTaskInMyDay, 1);

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

    dailyNoteContainer.textContent = dailyNote.note || "Be nice to others 💖";

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

// ======= USER TASKS
const sortButton = document.querySelector(".sort_controll"),
    sortPopUp = document.querySelector(".sort_value"),
    sortItems = document.querySelectorAll(".sort_item"),
    userTaskForm = document.getElementById("userTask_form"),
    userTaskContainer = document.getElementById("userTask_container");

sortItems.forEach((item) => item.addEventListener("click", getFilterCategory));
sortButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    sortPopUp.classList.toggle("open");
});

document.addEventListener("DOMContentLoaded", () => {
    userTaskForm.addEventListener("submit", (e) => {
        addUserTask(e);
    });
});

function addUserTask(e) {
    e.preventDefault();

    const taskName = document.getElementById("userTask_title").value;
    const taskDate = document.getElementById("userTask_date").value;

    const taskObject = createTaskObject(taskName, taskDate);
    userTasks.push(taskObject);

    renderUserTasks();
    saveToStorage(storage.userTasks, userTasks);
}

let sortCategory = "UNFINISHED";
function getFilterCategory(e) {
    sortCategory = this.dataset.value;
    filterTask(sortCategory);

    console.log("category :", sortCategory);

    highlightFilterCategory(sortCategory);
    sortPopUp.classList.remove("open");
}

function highlightFilterCategory(category) {
    sortItems.forEach((item) => {
        if (item.dataset.value !== category) item.classList.remove("active");
    });
    sortItems.forEach((item) => {
        if (item.dataset.value == category) item.classList.add("active");
    });
}

highlightFilterCategory(sortCategory);

function filterTask(category) {
    console.log("sorting...");
}

export function editUserTask(targetId) {
    const targetInTask = userTasks.filter((task) => task.id === targetId)[0];
    const idxTargetInTask = userTasks.findIndex((task) => task.id === targetId);

    const taskName = document.getElementById("taskInput_" + targetId).value;
    const dueDate = document.getElementById("taskInputDate_" + targetId).value;

    const editedTask = { ...targetInTask, taskName, dueDate };
    userTasks.splice(idxTargetInTask, 1);
    userTasks.unshift(editedTask);

    // console.log(taskName, dueDate);
    // console.log(editedTask);
    // console.log(userTasks);

    saveToStorage(storage.userTasks, userTasks);
    renderUserTasks();
}

export function deleteUserTask(targetId) {
    const idxTargetInTask = userTasks.findIndex((task) => task.id === targetId);
    userTasks.splice(idxTargetInTask, 1);

    saveToStorage(storage.userTasks, userTasks);
    renderUserTasks();
}

function renderUserTasks() {
    document.dispatchEvent(new Event(RENDER_TASKS));
}

function displayUserTasks() {
    userTaskContainer.innerHTML = "";

    for (const task of userTasks) {
        const taskCard = createTask("TASK", task);
        userTaskContainer.append(taskCard);
    }
}

document.addEventListener(RENDER_TASKS, displayUserTasks);

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

document.getElementById("taskDialog_btn").addEventListener("click", () => openModal("taskDialog"));
document.getElementById("userTask_cancel").addEventListener("click", () => closeModal("taskDialog"));
