const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Book List

public_users.get('/', function(req,res){
    res.send(JSON.stringify(books,null,3));
});

// Get book details based on ISBN

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send("Books with ISBN: " + (isbn) + JSON.stringify(books[isbn],null,3));
 });
  
// Get book details based on author

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  res.send("Books found by " + (author) + JSON.stringify(booksByAuthor,null,3));
});

// Get all books based on title

public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title)
    res.send("Books named " + (title) + JSON.stringify(booksByTitle,null,3))
});

//  Get book review

public_users.get('/reviews/:reviews',function (req, res) {
  const reviews = req.params.reviews
  res.send("Reviews: " + books[reviews])
});

module.exports.general = public_users;
