const { Router } = require("express");
const _ = require("lodash");
const router = Router();
const books = require("./books.json");
const authors = require("./authors.json");

function itExists(authorid) {
  let x = false;
  authors.forEach((author) => {
    if (authorid == author.id) {
      return (x = true);
    }
  });
  return x;
}
function showComplete(authors, books) {
  books.forEach((book) => {
    authors.forEach((author) => {
      if (book.authorid == author.id) {
        book.author = author.name + " " + author.lastName;
      }
    });
  });
}

router.get("/books", (req, res) => {
  showComplete(authors, books);
  res.json(books);
});

router.post("/books", (req, res) => {
  const { name, authorid } = req.body;
  const exists = itExists(authorid);
  console.log(exists);
  if (name && authorid && exists) {
    authors.forEach((author) => {
      if (author.id == authorid) {
        author.numberOfBooks += 1;
      }
    });
    const newBook = { ...req.body };
    books.push(newBook);
    res.json({ added: "successful" });
  } else {
    res
      .status(403)
      .json({ statusCode: "bad request, check values or if the author exist" });
  }
});

router.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  _.remove(books, (book) => {
    return book.id == id;
  });
  res.json();
});

router.put("/books/:id", (req, res) => {
  const id = req.params.id;
  const { name, authorid } = req.body;
  _.each(books, (book) => {
    if (book.id == id) {
      book.name = name;
      book.authorid = authorid;
      res.json({ modified: "successful" });
    } else {
      res.status(400).json({ statusCode: "bad request" });
    }
  });
});

module.exports = router;
