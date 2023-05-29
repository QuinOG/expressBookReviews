const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username.length >= 3;
};

const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username && user.password === password);
  return !!user;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "secret_key");
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ message: "Invalid username or password" });
      }
    } else {
      return res.status(400).json({ message: "Invalid username format" });
    }
  } else {
    return res.status(400).json({ message: "Missing username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.username;
  
    if (books.hasOwnProperty(isbn)) {
      const reviewId = generateReviewId(); // Generate a unique ID for the review
      books[isbn].reviews[reviewId] = { review, username }; // Store the review with its ID and username
      return res.status(200).json({ message: "Review added successfully", reviewId });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
  // Function to generate a unique review ID
  function generateReviewId() {
    return Math.random().toString(36).substring(2, 15);
  }
  

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewId = req.body.id;
  
    // Find the book by ISBN
    const book = books[isbn];
  
    // Check if the book exists
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Find the index of the review in the book's reviews array
    const reviewIndex = book.reviews.findIndex((review) => review.id === reviewId && review.username === req.session.username);
  
    // Check if the review exists
    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found" });
    }
  
    // Remove the review from the book's reviews array
    book.reviews.splice(reviewIndex, 1);
  
    // Send success response
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
