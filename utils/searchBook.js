const axios = require("axios");
const notion = require("../client/notion");
/**
 *
 * @param {String} searchTerm Term as [Book] by [Author]
 * @returns
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

    // const cover = {
    //   type: "external",
    //   external: {
    //     url: _image,
    //   },
    // };
    // const properties = {
    //   Author: {
    //     type: "rich_text",
    //     rich_text: [
    //       {
    //         type: "text",
    //         text: { content: _author, link: null },
    //         annotations: {
    //           bold: false,
    //           italic: false,
    //           strikethrough: false,
    //           underline: false,
    //           code: false,
    //           color: "default",
    //         },
    //         plain_text: _author,
    //         href: null,
    //       },
    //     ],
    //   },
    //   Tags: { type: "multi_select", multi_select: _tags },
    //   Status: {
    //     type: "multi_select",
    //     multi_select: [{ name: "Unread", color: "red" }],
    //   },
    //   Name: {
    //     type: "title",
    //     title: [
    //       {
    //         type: "text",
    //         text: { content: _title, link: null },
    //         annotations: {
    //           bold: false,
    //           italic: false,
    //           strikethrough: false,
    //           underline: false,
    //           code: false,
    //           color: "default",
    //         },
    //         plain_text: _title,
    //         href: null,
    //       },
    //     ],
    //   },
    //   Media: {
    //     type: "multi_select",
    //     multi_select: [
    //       {
    //         name: "Book",
    //         color: "purple",
    //       },
    //     ],
    //   },
    //   Description: {
    //     type: "rich_text",
    //     rich_text: [
    //       {
    //         type: "text",
    //         text: { content: _description, link: null },
    //         annotations: {
    //           bold: false,
    //           italic: false,
    //           strikethrough: false,
    //           underline: false,
    //           code: false,
    //           color: "default",
    //         },
    //         plain_text: _description,
    //         href: null,
    //       },
    //     ],
    //   },
    // };
  } catch (e) {
    console.log(e.stack);
  }
};

googleBooks("Breath", "James Nestor");

module.exports = googleBooks;
