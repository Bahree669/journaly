import {
    createTask,
    createTableHeader,
    createTableBody,
    createLoadingAnimation,
    createQuoteCard,
} from "./htmlElement.js";
import { makeId } from "./util.js";
import { isStorageAvailable, saveToStorage, getItemFromStorage, dispatchStorageEvent } from "./storage.js";

const userHabits = {
    habits: [],
    habitStatus: [],
};

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
        const savedHabits = getItemFromStorage(storage.userHabits);

        journal.myDay = savedJournal ? savedJournal.myDay : journal.myDay;
        journal.dailyNote = savedJournal ? savedJournal.dailyNote : journal.dailyNote;

        if (savedUserTask) for (const task of savedUserTask) userTasks.push(task);
        if (savedHabits) {
            const habits = savedHabits.habits;
            const habitStatuses = savedHabits.habitStatus;

            for (const habit of habits) userHabits.habits.push(habit);
            for (const status of habitStatuses) userHabits.habitStatus.push(status);
        }

        renderTableHeader();
        renderTableBody();
        renderDailyTask();
        renderDailyNote();
        renderUserTasks();
    }
});

// ======= RENDER AND STORAGE EVENTS
const RENDER_NOTE = "RENDER_NOTE",
    RENDER_DAILY_TASK = "RENDER_DAILY_TASK",
    RENDER_TASKS = "RENDER_TASKS",
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

    if (taskName && taskDate) {
        const taskObject = createTaskObject(taskName, taskDate);
        userTasks.unshift(taskObject);

        renderUserTasks();
        saveToStorage(storage.userTasks, userTasks);
    }
}

let sortCategory = "ALL";
function getFilterCategory(e) {
    sortCategory = this.dataset.value;
    filterTask(sortCategory);

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
    renderUserTasks();
}

export function editUserTask(targetId) {
    const targetInTask = userTasks.filter((task) => task.id === targetId)[0];
    const idxTargetInTask = userTasks.findIndex((task) => task.id === targetId);

    const taskName = document.getElementById("taskInput_" + targetId).value;
    const dueDate = document.getElementById("taskInputDate_" + targetId).value;

    const editedTask = { ...targetInTask, taskName, dueDate };
    userTasks.splice(idxTargetInTask, 1);
    userTasks.unshift(editedTask);

    saveToStorage(storage.userTasks, userTasks);
    renderUserTasks();
}

export function finishUserTask(targetId) {
    const targetTask = userTasks.filter((task) => task.id === targetId)[0];
    const idxTaskInMyDay = userTasks.findIndex((task) => task.id === targetId);

    const finishedTask = { ...targetTask, isFinish: targetTask.isFinish ? false : true };

    userTasks.splice(idxTaskInMyDay, 1);

    // Move the finished task to bottom
    if (finishedTask.isFinish) {
        userTasks.push(finishedTask);
    } else {
        userTasks.unshift(finishedTask);
    }

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

function displayUserTasks(category) {
    userTaskContainer.innerHTML = "";

    let tasks;
    if (category === "UNFINISHED") {
        tasks = userTasks.filter((task) => task.isFinish === false);
    } else if (category === "FINISHED") {
        tasks = userTasks.filter((task) => task.isFinish === true);
    } else {
        tasks = userTasks;
    }

    for (const task of tasks) {
        const taskCard = createTask("TASK", task);
        userTaskContainer.append(taskCard);
    }
}

document.addEventListener(RENDER_TASKS, () => {
    displayUserTasks(sortCategory);
});

// ======= USER HABITS
const tableHeader = document.getElementById("habitHead"),
    tableBody = document.getElementById("habitBody");

function renderTableHeader() {
    const el = createTableHeader(userHabits.habits);

    tableHeader.innerHTML = "";
    for (const x of el) tableHeader.append(x);
}

function renderTableBody() {
    const el = createTableBody(userHabits.habitStatus);

    tableBody.innerHTML = "";
    for (const x of el) tableBody.append(x);
}

document.getElementById("addHabit").addEventListener("click", addHabit);
document.getElementById("addEntry").addEventListener("click", addHabitRow);

let index = 1;
function addHabit() {
    userHabits.habits.push({ id: makeId(), name: "New habit " + index });
    index++;

    saveToStorage(storage.userHabits, userHabits);
    renderTableHeader();
    addHabitEntry();
}

export function removeHabit(targetId) {
    const idxTarget = userHabits.habits.findIndex((habit) => habit.id === targetId);
    userHabits.habits.splice(idxTarget, 1);

    if (!userHabits.habits.length) deleteAllRows();

    removeTableColumn(idxTarget);

    saveToStorage(storage.userHabits, userHabits);
    renderTableHeader();
}

export function editHabitName(e, targetId) {
    const key = e.key;

    if (key === "Enter") {
        const input = e.target.value;
        if (!input.length) return displayToast("Habit name is to short!");

        const idxTarget = userHabits.habits.findIndex((habit) => habit.id === targetId);
        userHabits.habits[idxTarget].name = input;
        saveToStorage(storage.userHabits, userHabits);
        renderTableHeader();
    }
}

function removeTableColumn(index) {
    userHabits.habitStatus.forEach((status) => {
        status.habits.splice(index, 1);
    });

    renderTableBody();
}

function addHabitRow() {
    const date = new Date();

    if (!userHabits.habits.length) return displayToast("Cannot add new entry to habits null :')");

    const rowId = makeId();

    userHabits.habitStatus.push({
        rowId,
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
        habits: [],
    });

    for (const x of userHabits.habitStatus) {
        const diff = Math.abs(userHabits.habits.length - x.habits.length);

        for (let i = 0; i < diff; i++) {
            x.habits.push({ id: makeId(), entryId: rowId, status: false });
        }
    }

    saveToStorage(storage.userHabits, userHabits);
    if (userHabits.habitStatus.length) renderTableBody();
}

export function setHabitStatus(targetId, entryId) {
    const habitStatus = userHabits.habitStatus;

    const entryIndex = habitStatus.findIndex((status) => status.rowId === entryId);
    const targetIndex = habitStatus[entryIndex].habits.findIndex((entry) => entry.id === targetId);
    const target = habitStatus[entryIndex].habits[targetIndex];

    const newStatus = { ...target, status: target.status ? false : true };

    habitStatus[entryIndex].habits.splice(targetIndex, 1, newStatus);
    saveToStorage(storage.userHabits, userHabits);
    renderTableBody();
}

export function deleteHabitRow(targetId) {
    const idxTarget = userHabits.habitStatus.findIndex((status) => status.rowId === targetId);

    userHabits.habitStatus.splice(idxTarget, 1);
    saveToStorage(storage.userHabits, userHabits);
    renderTableBody();
}

function deleteAllRows() {
    userHabits.habitStatus.splice(0);
    saveToStorage(storage.userHabits, userHabits);
}

function addHabitEntry() {
    for (const x of userHabits.habitStatus) {
        const diff = Math.abs(userHabits.habits.length - x.habits.length);

        for (let i = 0; i < diff; i++) {
            x.habits.push({ id: "", status: false });
        }
    }

    renderTableBody();
}

// ======= ARCHIVE
const api_url = "https://api.quotable.io/random?minLength=100&maxLength=140";

const quoteContainer = document.getElementById("quoteContainer");

async function getQuote(url) {
    renderQuotes(null, "loading");

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data) {
            renderQuotes(data, "finished");
        }
    } catch (error) {
        renderQuotes(error.message, "error");
        console.log(error.message);
    }
}

function renderQuotes(data, status) {
    quoteContainer.innerHTML = "";

    if (status === "loading") {
        const loader = createLoadingAnimation();
        quoteContainer.append(loader);
        return;
    }

    if (status === "finished") {
        const quoteEl = createQuoteCard(data);
        quoteContainer.append(quoteEl);
        return;
    }

    quoteContainer.innerHTML = `<p style="color: #fdfdfd; font-size:14px;">${data}</p>`;
}

getQuote(api_url);

document.getElementById("getNewQuote").addEventListener("click", () => getQuote(api_url));

// ======= TOAST NOTIFICATION
const toast = document.getElementById("toast");

function displayToast(message) {
    toast.textContent = message;
    toast.classList.add("active");

    toast.addEventListener("animationend", () => {
        toast.textContent = "";
        toast.classList.remove("active");
    });
}

// ======= DIALOG
export function openModal(targetId) {
    const targetDialog = document.getElementById(targetId);
    targetDialog.showModal();
}

export function closeModal(targetId) {
    const targetDialog = document.getElementById(targetId);
    targetDialog.close();
}

document.getElementById("myDay_addTask").addEventListener("click", () => openModal("myDay_dialog"));
document.getElementById("myDay_cancelTask").addEventListener("click", () => closeModal("myDay_dialog"));

document.getElementById("taskDialog_btn").addEventListener("click", () => openModal("taskDialog"));
document.getElementById("userTask_cancel").addEventListener("click", () => closeModal("taskDialog"));
