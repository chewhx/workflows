const axios = require("axios");
/**
 *
 * @param {String} searchTitle
 * @param {String} searchAuthor
 * @returns id, title, subtitle, authors, description, categories
 */

const googleBooks = async (searchTitle, searchAuthor) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes`,
      {
        params: {
          q: searchTitle + searchAuthor,
          intitle: searchAuthor,
          inauthor: searchAuthor,
        },
      }
    );

    const book = data.items[0];

    const {
      id,
      volumeInfo: { title, subtitle, authors, description, categories },
    } = book;

    return { id, title, subtitle, authors, description, categories };
  } catch (e) {
    console.log(e.stack);
  }
};
module.exports = googleBooks;
