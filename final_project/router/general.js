const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Ensure axios is installed: npm install axios

// ... (Registration code remains the same)

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
    try {
        // Simulating an asynchronous call to get books
        const getBooks = () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(books), 500);
            });
        };

        const allBooks = await getBooks();
        res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    const findByIsbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: "Book not found" });
        }
    });

    findByIsbn
        .then((book) => res.status(200).send(book))
        .catch((err) => res.status(err.status).json({ message: err.message }));
});

// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    
    try {
        const getByAuthor = await new Promise((resolve, reject) => {
            let booksByAuthor = [];
            let keys = Object.keys(books);
            keys.forEach(key => {
                if (books[key].author === author) {
                    booksByAuthor.push(books[key]);
                }
            });
            
            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor);
            } else {
                reject("No books found by this author");
            }
        });
        
        res.status(200).send(getByAuthor);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const getByTitle = new Promise((resolve, reject) => {
        let booksByTitle = [];
        let keys = Object.keys(books);
        keys.forEach(key => {
            if (books[key].title === title) {
                booksByTitle.push(books[key]);
            }
        });

        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject("No books found with this title");
        }
    });

    getByTitle
        .then((result) => res.status(200).send(result))
        .catch((err) => res.status(404).json({ message: err }));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;