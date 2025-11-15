import { getAllBooks } from "../models/booksModel.js";

export const fetchBooks = async (req, res) => {
  try {
    const books = await getAllBooks();

    res.json(books);
  } catch (error) {
    res.status(500).json({error: "FetchBooks error"});
  }
}