require("dotenv").config();
const { simpleParser } = require("mailparser");
const imap = require("../client/imap");
const notion = require("../client/notion");

const fs = require("fs-extra");

const parseBookNotes = require("../utils/parseBookNotes");
const resolveTags = require("../utils/resolveTags");
const searchBook = require("../utils/searchBook");

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

const MAILBOX = "[Gmail]/All Mail";
const SUBJECT = "Notes from";
const SEARCH_CRITERION = ["ALL", ["SUBJECT", SUBJECT]];
const NOTION_DATABASE_ID = process.env.NOTION_BOOK_DATABASE_ID;

const getEmailText = () => {
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
      imap.openBox(MAILBOX, false, searchMailBox);
    }

    // 3. Search the mailbox
    function searchMailBox() {
      imap.search(SEARCH_CRITERION, fetchSearchResults);
    }

    // 4. Fetch the search results
    function fetchSearchResults(err, res) {
      if (err) {
        throw err;
      }

      // 4A. Listen to message emitted from imapFetch event
      const imapFetch = imap.fetch(res, { bodies: "" });
      imapFetch.on("message", (message, seqno) => {
        // 4AA. Listen to body of message emitted from imapMessage event
        const imapMessage = message;

        imapMessage.on("body", (stream) => {
          // 4AAA. Parse body from imapMessage event
          simpleParser(stream, async (err, parsed) => {
            /* ----------Code here-------------- */
            // Do something to every message
            messages.push(parsed.text);
            /* --------------------------------- */
          });
        });

        // 4AB. End imap connection when messages have all been emitted
        imapMessage.on("end", () => {
          imap.end();
        });
      });
    }

    // Connect to imap
    imap.connect();
  } catch (e) {
    console.log(e.stack);
  }
};
getEmailText();
