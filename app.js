// Book Class - Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class - Handle UI tasks
class UI {
  //display books
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  //add book to list
  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><button class="btn btn-danger btn-sm delete">X</button></td>
    `;
    
    list.appendChild(row);
  }

  // Delete book
  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Disappear in 3 seconds
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000)
  }

  static clearFields() {
    document.querySelector('#book-form').reset();
  }
}

// Store Class - Handles Storage (localstorage)
class Store {
  static getBooks() {
    if (!localStorage.getItem('books')) {
      return [];
    } else {
      return JSON.parse(localStorage.getItem('books'));
    }
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static deleteBook(isbn) {
    const books = Store.getBooks();
    
    localStorage.setItem('books', JSON.stringify(books.filter(book => book.isbn !== isbn)));
  }
}

// Event - Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event - Add Book
document.querySelector('#book-form').addEventListener('submit', e => {
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Validate
  if (!title || !author || !isbn) {
    UI.showAlert('Please fill in all fields', 'danger')
  } else {
    // instantiate Book
    const book = new Book(title, author, isbn);
  
    // Add book to UI & Store
    UI.addBookToList(book);
    Store.addBook(book);
    UI.showAlert('Book added!', 'success');
  
    // Clear fields
    UI.clearFields();
  }

});

// Event - Delete Book
document.querySelector('#book-list').addEventListener('click', e => {
  UI.showAlert('Book removed!', 'success');
  Store.deleteBook(e.target.parentElement.previousElementSibling.textContent)
  UI.deleteBook(e.target);
});