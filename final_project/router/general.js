const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user

public_users.use(express.json());

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      const userExists = users.some((user) => user.username === username);
      if (!userExists) {
        users.push({ username: username, password: password });
        return res.status(200).json({ message: "User Created! You may now login" });
      } else {
        return res.status(409).json({ message: "User already exists!" });
      }
    }
  
    return res.status(400).json({ message: "Problem registering user" });
  });

// Book List & filters

public_users.get('/', (req, res) => {
    axios.get('http://localhost:5500/books')
      .then(response => {
        const books = response.data;
        res.send(JSON.stringify(books, null, 3));
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
  });

  public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`http://localhost:5500/books/isbn/${isbn}`);
      const bookDetails = response.data;
      res.send(`Books with ISBN: ${isbn}\n${JSON.stringify(bookDetails, null, 3)}`);
    } catch (error) {
      console.error('Error fetching book details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const response = await axios.get(`http://localhost:5500/books/author/${author}`);
      const booksByAuthor = response.data;
      res.send(`Books found by ${author}\n${JSON.stringify(booksByAuthor, null, 3)}`);
    } catch (error) {
      console.error('Error fetching book details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:5500/books/title/${title}`);
      const booksByTitle = response.data;
      res.send(`Books named ${title}\n${JSON.stringify(booksByTitle, null, 3)}`);
    } catch (error) {
      console.error('Error fetching book details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

public_users.get('/reviews/:isbn',function (req, res) {
  const reviews = req.params.reviews;
  const booksByReviews = Object.values(books).filter(book => book.reviews === reviews);
  if ((reviews) === 0){
    res.send("Reviews" + JSON.stringify(booksByReviews,null,3));
  } else {
    res.send("No reviews have been published for this book! ");
  }
});

module.exports.general = public_users;
