const notion = require("../client/notion");
const resolveTags = require("../utils/resolveTags");

const bookPage = async ({
  NOTION_DATABASE_ID,
  _title,
  _author,
  _description,
  _tags,
  _image,
  _children,
}) => {
  const {
    properties: {
      Tags: {
        multi_select: { options: existingTags },
      },
    },
  } = await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID });

  _tags = resolveTags(_tags, existingTags);

  const parent = {
    database_id: NOTION_DATABASE_ID,
  };

  const cover = {
    type: "external",
    external: {
      url: _image,
    },
  };

  const properties = {
    Author: {
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: { content: _author, link: null },
          plain_text: _author,
          href: null,
        },
      ],
    },
    Tags: { type: "multi_select", multi_select: _tags },
    Status: {
      type: "multi_select",
      multi_select: [{ name: "Notes", color: "pink" }],
    },
    Name: {
      type: "title",
      title: [
        {
          type: "text",
          text: { content: _title, link: null },
          plain_text: _title,
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
          text: { content: _description, link: null },
          plain_text: _description,
          href: null,
        },
      ],
    },
  };

  const children = _children.map((e) => {
    const block = {
      object: "block",
    };
    if (
      e.match(
        /\d+ (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}/g
      )
    ) {
      block.type = "heading_1";
      block["heading_1"] = {
        text: [
          {
            type: "text",
            text: { content: e },
          },
        ],
      };
    } else {
      block.type = "paragraph";
      block["paragraph"] = {
        text: [
          {
            type: "text",
            text: { content: e },
          },
        ],
      };
    }
    return block;
  });

  return {
    parent,
    cover,
    properties,
    children,
  };
};

module.exports = bookPage;
