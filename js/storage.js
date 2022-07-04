export function isStorageAvailable() {
    if (typeof Storage !== undefined) return true;
    alert("Local storage is not available in this browser!");
    return false;
}

export function saveToStorage(storageKey, storageData) {
    if (isStorageAvailable()) {
        localStorage.setItem(storageKey, JSON.stringify(storageData));
        dispatchStorageEvent("STORAGE_EVENT");
    }
}

export function getItemFromStorage(storageKey) {
    const data = localStorage.getItem(storageKey);
    return JSON.parse(data);
}

export function removeItemFromStorage(storageKey) {
    localStorage.clear(storageKey);
}

export function dispatchStorageEvent(event) {
    document.dispatchEvent(new Event(event));
}
