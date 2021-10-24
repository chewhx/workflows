const bookPage = ({
  NOTION_DATABASE_ID,
  notionTitle,
  notionAuthor,
  notionDescription,
  notionTags,
  notionImage,
  notionChildren,
}) => {
  return {
    parent: {
      database_id: NOTION_DATABASE_ID,
    },
    cover: {
      type: "external",
      external: {
        url: notionImage,
      },
    },
    properties: {
      Author: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: notionAuthor, link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default",
            },
            plain_text: notionAuthor,
            href: null,
          },
        ],
      },
      Tags: { type: "multi_select", multi_select: notionTags },
      Status: {
        type: "multi_select",
        multi_select: [{ name: "Notes", color: "yellow" }],
      },
      Name: {
        type: "title",
        title: [
          {
            type: "text",
            text: { content: notionTitle, link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default",
            },
            plain_text: notionTitle,
            href: null,
          },
        ],
      },
      Media: {
        type: "multi_select",
        multi_select: [
          {
            name: "Book",
            color: "purple",
          },
        ],
      },
      Description: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: notionDescription, link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: "default",
            },
            plain_text: notionDescription,
            href: null,
          },
        ],
      },
    },
    children: notionChildren,
  };
};

module.exports = bookPage;
