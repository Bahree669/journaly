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

// ======= DAILY NOTES
const dailyNote = document.querySelector(".note_text");
const dailyNoteControll = document.getElementById("dailyNote_ctrl");
const dailyNoteInput = document.getElementById("dailyNote_input");

dailyNoteInput.addEventListener("input", getDailyNote);
dailyNoteControll.addEventListener("click", addDailyNote);

let noteInput;
function addDailyNote(e) {
    journal.daily_note.note = noteInput;
    journal.daily_note.isEdit = journal.daily_note.isEdit ? false : true;

    console.log(journal.daily_note);
    renderDailyNote();
}

function getDailyNote() {
    noteInput = this.value;
}

function displayNote() {
    dailyNote.textContent = journal.daily_note.note;

    if (journal.daily_note.isEdit) {
        dailyNoteControll.textContent = "Edit Note";
        dailyNote.style.display = "flex";
        dailyNoteInput.style.display = "none";
    } else {
        dailyNoteControll.textContent = "Add Note";
        dailyNote.style.display = "none";
        dailyNoteInput.style.display = "flex";
        dailyNoteInput.value = journal.daily_note.note;
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
