require("dotenv").config();
const fs = require("fs-extra");
const { simpleParser } = require("mailparser");
const imap = require("./client/imap");
const notion = require("./client/notion");

const bookNotes = require("./utils/parseBookNotes");
const resolveTags = require("./utils/resolveTags");
const googleBooks = require("./utils/searchBook");

const bookPage = require("./templates/bookPage");

/* 
1. Email book notes from ibooks to gmail.com
2. Activate this script with http request
3. Script will look into inbox and find from subject = "Notes from..."

4a. Save the text as json in google cloud storage (this will trigger the parsing function)


7. Check if the book already exists
8. If so, append the children to page
9. Otherwise, create a new page in database with book metadata and children
*/

const getEmails = () => {
  try {
    const MAILBOX = "[Gmail]/All Mail";
    const SEARCH_CRITERION = [
      "ALL",
      ["SUBJECT", "Notes from “The Body” by Bill Bryson"],
    ];

    const imapFetch = (err, results) => {
      const f = imap.fetch(results, { bodies: "" });
      /*4. Fetch that email body and get text version */
      f.on("message", (msg) => {
        msg.on("body", (stream) => {
          simpleParser(stream, async (err, parsed) => {
            const { text } = parsed;
            /*5. Parse the text to a children array and book title with author*/
            const { notionChildren, searchTitle, searchAuthor } =
              bookNotes(text);

            /*6. Look up google books for the book title, tags and images*/
            const { id, title, subtitle, authors, description, categories } =
              await googleBooks(searchTitle, searchAuthor);

            // notion.pages.create({
            //   parent: {
            //     database_id: NOTION_DATABASE_ID,
            //   },
            //   properties: {
            //     Name: {
            //       title: [{ text: { content: Date.now().toLocaleString() } }],
            //     },
            //   },
            //   children,
            // });
            /* Make API call to save the data
                 Save the retrieved data into a database.
                 E.t.c
              */

            /* 7. Check if the book already exists*/
            /* 8. If so, append the children to page*/
            /* 9. Otherwise, create a new page in database with book metadata and children*/

            // 9a. Get existing tags from notion database
            const {
              properties: {
                Tags: {
                  multi_select: { options: existingTags },
                },
              },
            } = await notion.databases.retrieve({
              database_id: NOTION_DATABASE_ID,
            });
            // 9b. Resolve tags

            const notionTags = resolveTags(categories, existingTags);
            // 9c. Page parent, cover, properties, and children

            const notionTitle = `${title}: ${subtitle}`;
            const notionAuthor = authors.join(", ");
            const notionDescription = !description
              ? ""
              : description.length > 1999
              ? description.slice(0, 1996) + "..."
              : description;
            const notionImage = `https://books.google.com/books/content/images/frontcover/${id}?fife=w600`;

            const page = bookPage({
              NOTION_DATABASE_ID,
              notionTitle,
              notionAuthor,
              notionDescription,
              notionTags,
              notionImage,
              notionChildren,
            });

            notion.pages.create(page);
          });
        });
        msg.once("attributes", (attrs) => {
          const { uid } = attrs;
          imap.addFlags(uid, ["\\Seen"], () => {
            // Mark the email as read after reading it
            console.log("Marked as read!");
          });
        });
      });
      f.once("error", (ex) => {
        return Promise.reject(ex);
      });
      f.once("end", () => {
        console.log("Done fetching all messages!");
        imap.end();
      });
    };

    const imapSearch = () => imap.search(SEARCH_CRITERION, imapFetch);

    const imapOpen = () => imap.openBox(MAILBOX, false, imapSearch);

    imap.once("ready", imapOpen);

    imap.once("error", (err) => {
      console.log(err);
    });

    imap.once("end", () => {
      console.log("Connection ended");
    });

    imap.connect();
  } catch (e) {
    console.log("an error occurred");
    console.log(e.stack);
  }
};

getEmails();
