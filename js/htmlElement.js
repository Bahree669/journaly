import { openModal, closeModal } from "./app.js";

export function createTask(category, task) {
    const { id, task_title, due_date, is_finish } = task;
    const modalId = "taskModal_" + id;

    const container = document.createElement("div");
    container.setAttribute("class", "task_card");

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", id);
    if (is_finish) input.setAttribute("checked", "");

    const taskTitle = document.createElement("h6");
    taskTitle.textContent = task_title;

    const taskControll = document.createElement("button");
    taskControll.textContent = "More";
    taskControll.setAttribute("class", "btn btn_main");
    taskControll.addEventListener("click", () => openModal(modalId));

    const taskDueDateTime = document.createElement("time");
    taskDueDateTime.textContent = due_date;

    const taskDueDate = document.createElement("p");
    taskDueDate.textContent = "Due : ";
    taskDueDate.append(taskDueDateTime);

    const taskContent = document.createElement("div");

    if (category === "TASK") {
        taskContent.append(taskTitle, taskDueDate);
        container.append(input, taskContent, taskControll, createTaskModal(category, modalId));
    } else {
        container.append(input, taskTitle, taskControll, createTaskModal(category, modalId));
    }

    return container;
}

function createTaskModal(category, id) {
    const modal = document.createElement("dialog");
    modal.setAttribute("class", "task_modal");
    modal.setAttribute("id", id);

    const modalControll = document.createElement("button");
    modalControll.setAttribute("class", "btn btn_main");
    modalControll.textContent = "Close";
    modalControll.addEventListener("click", () => closeModal(id));

    modal.append(modalControll);
    return modal;
}
