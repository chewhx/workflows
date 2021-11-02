# Workflows

Collection of code to simplify and accelerate workflows.

- Created for Google Cloud Functions to be triggered by Http requests.
- Scripts can be run individually without cloud function trigger.

## lib/booksToNotion

- Created as an alternative to Readwise
- Open imap inbox and search for unread messages with subject "Notes from". (This is usually the subject of book highlights and notes sent from Apple Books app.)
- Retrive the body of the messages to get book title, author, and notes/highlights
- Search for book information on google books
- Create a new page in database on Notion, with book cover, title, author, descriptions, and notes/highlights.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
# FOR IMAP
EMAIL_PASSWORD=
EMAIL_ADDRESS=
EMAIL_HOST=
EMAIL_PORT=

# FOR NOTION
NOTION_API_TOKEN=
NOTION_BOOK_DATABASE_ID=
```

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run test
```

Visit http://localhost:8080/json to test.

Visit http://localhost:8080/booksToNotion to run script.
