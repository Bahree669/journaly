import {
    openModal,
    closeModal,
    finishDailyTask,
    editDailyTask,
    deleteDailyTask,
    editUserTask,
    deleteUserTask,
    finishUserTask,
} from "./app.js";

export function createTask(category, task) {
    const { id, taskName, dueDate, isFinish } = task;
    const modalId = "taskModal_" + id;
    const inputId = "taskInput_" + id;
    const inputDateId = "taskInputDate_" + id;

    const container = document.createElement("div");
    container.setAttribute("class", "task_card");

    const input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", id);
    if (category === "TASK") {
        input.addEventListener("click", () => finishUserTask(id));
    } else {
        input.addEventListener("click", () => finishDailyTask(id));
    }

    const taskTitle = document.createElement("h6");
    taskTitle.textContent = taskName;

    if (isFinish) {
        input.setAttribute("checked", "");
        taskTitle.setAttribute("class", "line_through");
    } else {
        taskTitle.classList.remove("line_through");
    }

    const taskControll = document.createElement("button");
    taskControll.innerHTML = `<div class='more_btn'>
            <div class="more_icon">
                <div class='dot'></div>
                <div class='dot'></div>
                <div class='dot'></div>
            </div>
        </div>`;
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
        container.append(
            input,
            taskContent,
            taskControll,
            createTaskModal(modalId, inputId, inputDateId, id, taskName, dueDate)
        );
    } else {
        container.append(input, taskTitle, taskControll, createDailyTaskModal(modalId, inputId, taskName, id));
    }

    return container;
}

function createDailyTaskModal(modalId, inputId, taskName, taskId) {
    const modal = document.createElement("dialog");
    modal.setAttribute("id", modalId);

    const modalContent = document.createElement("div");
    modalContent.setAttribute("class", "dialog_content");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", inputId);
    input.setAttribute("placeholder", "What is your goal today?");
    input.setAttribute("value", taskName);

    const dialogTitle = document.createElement("h4");
    dialogTitle.textContent = "Edit Task";

    const saveButton = document.createElement("button");
    saveButton.setAttribute("class", "btn btn_main");
    saveButton.textContent = "Save Edit";
    saveButton.addEventListener("click", () => editDailyTask(taskId));

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn_alert");
    deleteButton.textContent = "Delete Task";
    deleteButton.addEventListener("click", () => deleteDailyTask(taskId));

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

function createTaskModal(modalId, inputId, inputDateId, taskId, taskName, dueDate) {
    const modal = document.createElement("dialog");
    modal.setAttribute("id", modalId);

    const dialogContent = document.createElement("div");
    dialogContent.setAttribute("class", "dialog_content");

    const dialogTitle = document.createElement("h4");
    dialogTitle.textContent = "Edit Task";

    const form = document.createElement("div");
    form.setAttribute("id", "userTask_edit");
    form.setAttribute("class", "myDay_form");

    const inputContainerOne = document.createElement("div");
    const inputContainerTwo = document.createElement("div");

    const inputTitle = document.createElement("input");
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("id", inputId);
    inputTitle.setAttribute("value", taskName);
    inputTitle.setAttribute("placeholder", "Go to the store");
    inputTitle.setAttribute("name", "task title");
    inputTitle.setAttribute("required", "");

    const inputDate = document.createElement("input");
    inputDate.setAttribute("type", "date");
    inputDate.setAttribute("value", dueDate);
    inputDate.setAttribute("name", "task title");
    inputDate.setAttribute("id", inputDateId);
    inputDate.setAttribute("required", "");

    const btnSubmit = document.createElement("button");
    btnSubmit.textContent = "Save Edit";
    btnSubmit.setAttribute("class", "btn btn_main");
    btnSubmit.addEventListener("click", () => editUserTask(taskId));

    const btnCancel = document.createElement("button");
    btnCancel.textContent = "Cancel";
    btnCancel.setAttribute("class", "btn btn_secondary");
    btnCancel.addEventListener("click", () => closeModal(modalId));

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Delete";
    btnDelete.setAttribute("class", "btn btn_alert");
    btnDelete.addEventListener("click", () => deleteUserTask(taskId));

    inputContainerOne.append(inputTitle);
    inputContainerTwo.append(inputDate);

    form.append(inputContainerOne, inputContainerTwo, btnSubmit);

    dialogContent.append(dialogTitle, form, btnDelete, btnCancel);

    modal.append(dialogContent);
    return modal;
}

export function createTableHeader(data) {
    const habitsEl = data.map((habit) => {
        const th = document.createElement("th");
        th.textContent = habit.name;
        return th;
    });

    const dateEl = document.createElement("th");
    dateEl.textContent = "Date";

    habitsEl.unshift(dateEl);
    return habitsEl;
}

export function createTableBody(data) {
    const rows = data.map((data) => {
        const tr = document.createElement("tr");
        const tdDate = document.createElement("td");
        tdDate.textContent = data.date;
        tdDate.setAttribute("class", "tr_first");

        tr.append(tdDate);
        return tr;
    });

    const el = data.map((data) => {
        const a = data.entries.map((entry, i) => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.setAttribute("type", "checkbox");

            if (i === data.entries.length - 1) td.setAttribute("class", "tr_last");

            td.append(input);
            return td;
        });

        return a;
    });

    const tableRows = rows.map((row, i) => {
        el[i].forEach((el) => {
            row.append(el);
        });
        return row;
    });

    return tableRows;
}
