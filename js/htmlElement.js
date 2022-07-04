import { openModal, closeModal, finishDailyTask, editDailyTask, deleteDailyTask } from "./app.js";

export function createTask(category, task) {
    const { id, taskName, dueDate, isFinish } = task;
    const modalId = "taskModal_" + id;

    const container = document.createElement("div");
    container.setAttribute("class", "task_card");

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", id);
    input.addEventListener("click", (e) => finishTask(e, id));

    const taskTitle = document.createElement("h6");
    taskTitle.textContent = taskName;

    if (isFinish) {
        input.setAttribute("checked", "");
        taskTitle.setAttribute("class", "line_through");
    } else {
        taskTitle.classList.remove("line_through");
    }

    const taskControll = document.createElement("button");
    taskControll.textContent = "More";
    taskControll.setAttribute("class", "btn btn_main");
    taskControll.addEventListener("click", () => openModal(modalId));

    const taskDueDateTime = document.createElement("time");
    taskDueDateTime.textContent = dueDate;

    const taskDueDate = document.createElement("p");
    taskDueDate.textContent = "Due : ";
    taskDueDate.append(taskDueDateTime);

    const taskContent = document.createElement("div");

    if (category === "TASK") {
        taskContent.append(taskTitle, taskDueDate);
        container.append(input, taskContent, taskControll, createTaskModal(category, modalId, taskName, id));
    } else {
        container.append(input, taskTitle, taskControll, createTaskModal(category, modalId, taskName, id));
    }

    return container;
}

function createTaskModal(category, modalId, taskName, taskId) {
    const modal = document.createElement("dialog");
    modal.setAttribute("id", modalId);

    const modalContent = document.createElement("div");
    modalContent.setAttribute("class", "dialog_content");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "taskEdit_input");
    input.setAttribute("placeholder", "What is your goal today?");
    input.setAttribute("value", taskName);

    const dialogTitle = document.createElement("h4");
    dialogTitle.textContent = "Edit Task";

    const saveButton = document.createElement("button");
    saveButton.setAttribute("class", "btn btn_main");
    saveButton.textContent = "Save Edit";
    saveButton.addEventListener("click", (e) => editDailyTask(e, taskId));

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn_alert");
    deleteButton.textContent = "Delete Task";
    deleteButton.addEventListener("click", (e) => deleteDailyTask(e, taskId));

    const closeButton = document.createElement("button");
    closeButton.setAttribute("class", "btn btn_secondary");
    closeButton.textContent = "Cancel";
    closeButton.addEventListener("click", () => closeModal(modalId));

    const modalControll = document.createElement("div");
    modalControll.setAttribute("class", "dialog_ctrl");

    modalControll.append(saveButton, deleteButton, closeButton);
    modalContent.append(dialogTitle, input, modalControll);
    modal.append(modalContent);
    return modal;
}
