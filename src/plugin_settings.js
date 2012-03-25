// Storage for recordings
function getRecLocalStorage() {
    return JSON.parse(localStorage.KotiruutuRec_v4);
}

function setRecLocalStorage(recStorage) {
    localStorage.KotiruutuRec_v4 = JSON.stringify(recStorage);
}

function isRecLocalStorageEmpty() {
    return getRecLocalStorage().length == 0;
}

function initRecLocalStorage() {
    setRecLocalStorage([]);
}

function initRecLocalStorageFirstTime() {
    if (localStorage.KotiruutuRec_v4 == undefined) {
        initRecLocalStorage();
    }
}