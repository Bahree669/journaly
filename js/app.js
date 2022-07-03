import { createTask } from "./htmlElement.js";

export function openModal(id) {
    const targetDialog = document.getElementById(id);
    targetDialog.showModal();
}

export function closeModal(id) {
    const targetDialog = document.getElementById(id);
    targetDialog.close();
}
