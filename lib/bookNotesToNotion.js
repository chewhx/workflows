require("dotenv").config();
const { simpleParser } = require("mailparser");
const imap = require("../client/imap");
const notion = require("../client/notion");

const searchBook = require("../utils/searchBook");
const bookPage = require("../templates/bookPage");

/* ------------------------ */
/* List of Gmail Mailboxes  */
/* ------------------------ */
/* "*",zen
| "INBOX",
| "[Gmail]",
| "[Gmail]/All Mail",
| "[Gmail]/Drafts",
| "[Gmail]/Important",
| "[Gmail]/Sent Mail",
| "[Gmail]/Spam",
| "[Gmail]/Starred",
| "[Gmail]/Trash",*/
/* ------------------------ */

const MAILBOX = "INBOX";
const SUBJECT = "Notes from";
const SEARCH_CRITERION = ["UNSEEN", ["SUBJECT", SUBJECT]];
const NOTION_DATABASE_ID = process.env.NOTION_BOOK_DATABASE_ID;

const bookNotesToNotion = async () => {
  // Event messages
  imap.once("error", (err) => {
    console.log(err.stack);
  });
  imap.once("end", () => {
    console.log("Connection ended");
  });

  try {
    // 1. Ready event emmitter
    imap.once("ready", openMailBox);

    // 2. Open the mailbox
    function openMailBox() {
      return imap.openBox(MAILBOX, false, searchMailBox);
    }

    // 3. Search the mailbox
    function searchMailBox() {
      return imap.search(SEARCH_CRITERION, fetchSearchResults);
    }

    // 4. Fetch the search results
    function fetchSearchResults(err, res) {
      if (err) {
        throw err;
      }

      // 4A. Listen to message emitted from imapFetch event
      const imapFetch = imap.fetch(res, { bodies: "", markSeen: true });
      imapFetch.on("message", (message, seqno) => {
        // 4AA. Listen to body of message emitted from imapMessage event
        const imapMessage = message;

        // imapMessage.on("attributes", (attrs) => {
        //   const { uid } = attrs;
        //   imap.addFlags(uid, ["\\Seen"], () => {
        //     // Mark the email as read after reading it
        //     console.log(`Message ${uid} - Marked as read!`);
        //   });
        // });

        imapMessage.on("body", (stream) => {
          // 4AAA. Parse body from imapMessage event
          simpleParser(stream, async (err, parsed) => {
            /* ----------Code here-------------- */
            // Do something to every message
            const { text } = parsed;
            const textArr = text.split(/\n/).filter((e) => e !== "");
            const bookTitle = textArr[1];
            const bookAuthor = textArr[2];
            const bookTextArr = textArr.slice(3);
            // Search for book details
            const { id, title, subtitle, authors, description, categories } =
              await searchBook(bookTitle, bookAuthor);

            let _title, _author, _description, _image, _tags, _children;

            _title = `${title} + ${subtitle}`;
            _author = authors.join(", ");
            _description = !description
              ? ""
              : description.length > 1999
              ? description.slice(0, 1996) + "..."
              : description;
            _image = `https://books.google.com/books/content/images/frontcover/${id}?fife=w600`;
            _tags = categories;
            _children = bookTextArr;

            const notionPage = await bookPage({
              NOTION_DATABASE_ID,
              _title,
              _author,
              _description,
              _tags,
              _image,
              _children,
            });

            notion.pages.create(notionPage);

            /* --------------------------------- */
          });
        });

        // 4AB. End imap connection when messages have all been emitted
        imapMessage.on("end", () => {
          imap.end();
        });
      });

      imapFetch.once("error", (e) => {
        throw e;
      });
      imapFetch.once("end", () => {
        console.log("Done fetching all messages!");
        imap.end();
      });
    }

    // Connect to imap
    imap.connect();
  } catch (e) {
    console.log(e.stack);
  }
};

module.exports = bookNotesToNotion;

// (async () => {
//   const res = await bookNotesToNotion();
//   console.log({ res });
// })();
