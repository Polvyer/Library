// Library used to maintain books
let myLibrary = [];
let totalNumberOfBooks = 0;

// Testing whether your storage has been populated
if (!localStorage.getItem("myLibrary")) { // Not populated - Send library to local storage
    console.log('not populated');
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary)); // key = 'myLibrary' val = Array myLibrary
    localStorage.setItem("totalNumberOfBooks", totalNumberOfBooks.toString(10));
}
else { // Populated - Get values from local storage and create table
    console.log('populated');
    myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    totalNumberOfBooks = parseInt(localStorage.getItem("totalNumberOfBooks"));
    console.table(myLibrary);
    console.log('totalNumberOfBooks: ' + totalNumberOfBooks);
    displayLibrary();
}

// Book object
function Book(title, author, numberOfPages, readBook) {
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.readBook = readBook;
}

// Update book prototype
Book.prototype.info = function() {
    return `The ${this.title} by ${this.author}, ${this.numberOfPages} pages, ${this.readBook ? "read already" : "not read yet"}`;
}

// Add entire library to DOM
function displayLibrary() {
    myLibrary.forEach((tuple) => {
        displayToDOM(tuple[0], tuple[1]);
    });
}

// Add book to the library
function addBookToLibrary(book) {
    console.log(book.info()); // Print info to console
    totalNumberOfBooks += 1;
    myLibrary.push(new Array(book, totalNumberOfBooks)); // Adds book + unique ID to library
    console.table(myLibrary);

    // Add to local storage
    localStorage.clear();                                         // Empties entire store object
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary)); // Updates local storage
    localStorage.setItem("totalNumberOfBooks", totalNumberOfBooks.toString(10));
    console.log(localStorage);

    // Add to DOM
    displayToDOM(book, totalNumberOfBooks);
}

// Add book info to DOM
function displayToDOM(book, id) {
    // Point of insertion for new books
    let table = document.querySelector('table');

    let tr = document.createElement('tr');
    tr.setAttribute('id', id); // Used to eliminate from library
    let td;

    // Adds book info to the table via row
    for (let prop in book) {
        let isOwn = book.hasOwnProperty(prop);

        // Iterates over book's objects
        if(isOwn) {
            td = document.createElement('td');

            // Add checkbox button
            if (prop == 'readBook') {
                let checkBox = document.createElement('input');
                checkBox.setAttribute('type', 'checkbox');

                // Add event listener to monitor changes
                checkBox.addEventListener('change', (e) => {
                    alert('checked');
                });

                // If readBook == true => checked, else unchecked
                if (book[prop]) {
                    checkBox.checked = true;
                }
                else {
                    checkBox.checked = false;
                }
                td.appendChild(checkBox);
            }
            // Add text info
            else {
                td.textContent = book[prop];
            }

            tr.appendChild(td);
        }
    }

    // Creates delete button for row
    td = document.createElement('td');
    let button = document.createElement('button');
    button.textContent = 'Delete';

    // Adds event listener for delete button to delete row when pushed
    button.addEventListener('click', (e) => {
        let child = button.parentNode.parentNode;
        table.removeChild(child);

        // Remove book from myLibrary
        let id = child.getAttribute('id');
        for (let i = 0; i < myLibrary.length; i++) {
            if (id == myLibrary[i][1]) {
                myLibrary.splice(i, 1);
                console.table(myLibrary);
                break;
            }
        }

        // Update local storage
        localStorage.clear();                                         // Empties entire store object
        localStorage.setItem("myLibrary", JSON.stringify(myLibrary)); // Updates local storage
        localStorage.setItem("totalNumberOfBooks", totalNumberOfBooks.toString(10));
        console.log(localStorage);
    });

    // Appends delete button and new row
    td.appendChild(button);
    tr.appendChild(td);
    table.appendChild(tr);
}

// Clears input fields
function clearFields() {
    title.value = "";
    author.value = "";
    pages.value = "";
    readBook.checked = false;
}

// Form children used to retrieve input
const title = document.querySelector('#title');
const author = document.querySelector('#author');
const pages = document.querySelector('#pages');
const readBook = document.querySelector('#readBook');

// Form OnSubmit ('Add' button clicked)
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents page from refreshing
    addBookToLibrary(new Book(title.value, author.value, parseInt(pages.value), readBook.checked));
    clearFields();      // Clears input fields
});

// Clear input ('Clear' button clicked)
const clear = document.querySelector('#clear');
clear.addEventListener('click', (e) => {
    e.preventDefault(); // Prevents fields from being required
    clearFields();      // Clears input fields
});
