let $ = document;

let notes = [];

const popupModal = $.querySelector('.popup-box');

const openPopupModalBtn = $.querySelector('.add-box');
const closePopupModalBtn = $.querySelector('.close-popup');

const titleInput = $.querySelector('.title-input');
const descriptionInput = $.querySelector('.description-input');
const addNewButton = $.querySelector('button');
const popupTitle = $.querySelector('.popup-title');

const notesWrapper = $.querySelector('.wrapper');
let isUpdating = false;
let noteIdToEdit = null;

const openPopupModal = () => {

    if (isUpdating) {
        popupTitle.textContent = 'EDIT YOUR NOTE';
        addNewButton.textContent = 'UPDATE';
        popupModal.classList.add('show');
        titleInput.focus();
    } else {
        popupTitle.textContent = 'ADD NEW NOTE';
        addNewButton.textContent = 'ADD NEW';
        popupModal.classList.add('show');
        clearInputs();
        titleInput.focus();
    }
}

const closePopupModal = () => {
    popupModal.classList.remove('show');
}

const clearInputs = () => {
    titleInput.value = '';
    descriptionInput.value = '';
}

const calcCurrentDate = () => {
    let todayDate = new Date();
    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    };
    let date = new Intl.DateTimeFormat(navigator.languages, options).format(todayDate);
    return date;
}

const saveNotesFromLocalStorage = () => {
    localStorage.setItem('notes', JSON.stringify(notes));
}

const loadNotesFromLocalStorage = () => {
    let savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        displayNotes(notes);
    } else notes = [];
}

const addNewNote = () => {
    
    let noteTitle = titleInput.value;
    let noteDescription = descriptionInput.value;
    
    if (noteTitle) {
        if (isUpdating && noteIdToEdit !== null) {
            let noteSelected = notes.find(note => note.id == noteIdToEdit);
            noteSelected.title = noteTitle;
            noteSelected.description = noteDescription;
            noteSelected.date = calcCurrentDate();
    
            noteIdToEdit = null;
            isUpdating = false;
        } else {
            let newNote = {
              id: notes.length + 1,
              title: noteTitle,
              description: noteDescription,
              date: calcCurrentDate(),
            };
            notes.push(newNote);
        }

        $.querySelectorAll('.note').forEach(note => note.remove());
        saveNotesFromLocalStorage();
        displayNotes(notes);
        closePopupModal();
        clearInputs();
    }
}

const displayNotes = (notesArr) => {

    $.querySelectorAll('.note').forEach(note => note.remove());

    notesArr.forEach(note => {
        notesWrapper.insertAdjacentHTML('beforeend', `<li onclick="closeSettings(event)" class="note">
            <div class="details">
              <p>${note.title}</p>
              <span>${note.description}</span>
            </div>
            <div class="bottom-content">
              <span>${note.date}</span>
              <div onclick="openNoteSettings(event)" class="settings">
                <i class="uil uil-ellipsis-h"></i>
                <ul class="menu">
                  <li onclick="editNote(${note.id}, '${encodeURIComponent(note.title)}', '${encodeURIComponent(note.description)}')">
                    <i class="uil uil-pen"></i>Edit
                  </li>
                  <li  onclick="delNote('${note.id}')">
                    <i class="uil uil-trash""></i>Delete
                  </li>
                </ul>
              </div>
            </div>
        </li>`);
    })
}

const openNoteSettings = (e) => {
    e.target.parentElement.classList.add('show');

    document.addEventListener('click', event => {
        if (event.target.tagName !== 'I' || event.target != e.target) {
            e.target.parentElement.classList.remove('show');
        }
        
    })
}

const closeSettings = (e) => {
    const settingsElement = e.target.querySelector('.settings');
    if (settingsElement) {
        settingsElement.classList.remove('show');
    }
}

const delNote = (noteId) => {

    let confirmDelete = confirm('Are you sure to delete this note?');

    if (confirmDelete) {
        let noteSelected = notes.findIndex(note => note.id == noteId);
        notes.splice(noteSelected, 1);
        saveNotesFromLocalStorage();
    
        $.querySelectorAll('.note').forEach(note => note.remove());
        displayNotes(notes);
    }
}

const editNote = (noteId, noteTitle, noteDescription) => {
    isUpdating = true;
    noteIdToEdit = noteId;

    titleInput.value = decodeURIComponent(noteTitle);
    descriptionInput.value = decodeURIComponent(noteDescription);

    openPopupModal();
}

openPopupModalBtn.addEventListener('click', () => {
    isUpdating = false;
    openPopupModal();
});
closePopupModalBtn.addEventListener('click', closePopupModal);
addNewButton.addEventListener('click', event => {
    event.preventDefault();
    addNewNote();
});

window.addEventListener('load', loadNotesFromLocalStorage);
window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closePopupModal();
    }
})