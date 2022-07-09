import {
    openModal,
    closeModal,
    finishDailyTask,
    editDailyTask,
    deleteDailyTask,
    editUserTask,
    deleteUserTask,
    finishUserTask,
    deleteHabitRow,
    removeHabit,
    editHabitName,
    setHabitStatus,
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
    input.setAttribute("class", "custom_input");
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
    taskControll.setAttribute("class", "btn btn_nobg btn_tooltip");
    taskControll.setAttribute("data-tooltip", "See more option");

    const btnIcon = document.createElement("div");
    btnIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: #fdfdfd;">
    <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
    </svg>`;

    taskControll.append(btnIcon);
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
        const div = document.createElement("div");

        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "btn btn_nobg btn_tooltip");
        deleteButton.setAttribute("data-tooltip", "Remove this habit");
        deleteButton.innerHTML = `
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: #fdfdfd;"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
        `;
        deleteButton.addEventListener("click", () => removeHabit(habit.id));

        const input = document.createElement("input");
        input.setAttribute("class", "table_input");
        input.setAttribute("value", habit.name);
        input.setAttribute("onFocus", 'this.placeholder="Hit enter to save changes"');
        input.setAttribute("onBlur", 'this.placeholder="Task name"');
        input.setAttribute("placeholder", "Task name");
        input.addEventListener("keyup", (e) => editHabitName(e, habit.id));

        div.append(input, deleteButton);

        th.append(div);
        return th;
    });

    const dateEl = document.createElement("th");
    dateEl.textContent = "Date";

    if (data.length) habitsEl.unshift(dateEl);
    return habitsEl;
}

export function createTableBody(data) {
    const rows = data.map((data) => {
        const tr = document.createElement("tr");
        const div = document.createElement("div");

        const td = document.createElement("td");
        td.setAttribute("class", "tr_first");

        const tdDate = document.createElement("p");
        tdDate.textContent = data.date;

        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "btn btn_nobg btn_tooltip");
        deleteButton.setAttribute("data-tooltip", "Remove this entry");
        deleteButton.innerHTML = `
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: #fdfdfd;"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
        `;
        deleteButton.addEventListener("click", () => deleteHabitRow(data.id));

        div.append(tdDate, deleteButton);
        td.append(div);
        tr.append(td);
        return tr;
    });

    const el = data.map((data) => {
        const a = data.habits.map((entry, i) => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("id", entry.id);
            input.addEventListener("click", () => setHabitStatus(entry.id, entry.entryId));

            if (entry.status) input.setAttribute("checked", "");

            if (i === data.habits.length - 1) td.setAttribute("class", "tr_last");

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

export function createLoadingAnimation() {
    const div = document.createElement("div");
    div.setAttribute("class", "loader_container");

    const loader = document.createElement("div");
    loader.setAttribute("class", "loader_icon");
    loader.innerHTML = ` <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            style='fill: #fdfdfd;'
        >
            <circle cx='12' cy='20' r='2'></circle>
            <circle cx='12' cy='4' r='2'></circle>
            <circle cx='6.343' cy='17.657' r='2'></circle>
            <circle cx='17.657' cy='6.343' r='2'></circle>
            <circle cx='4' cy='12' r='2.001'></circle>
            <circle cx='20' cy='12' r='2'></circle>
            <circle cx='6.343' cy='6.344' r='2'></circle>
            <circle cx='17.657' cy='17.658' r='2'></circle>
        </svg>`;

    div.append(loader);
    return div;
}

export function createQuoteCard(data) {
    const figure = document.createElement("figure");
    const blockquote = document.createElement("blockquote");
    blockquote.textContent = data.content;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = data.author;

    figure.append(blockquote, figcaption);
    return figure;
}
