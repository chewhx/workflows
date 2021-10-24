/* ------------------------ */
/*      Book notes          */
/* ------------------------ */
/**
 *
 * @param {String} text Text from JSON to be convert to prefix with markdown syntax
 * @returns Children array for notion api
 */
const bookNotes = (text) => {
  const textArr = text.split(/\n/).filter((e) => e !== "");
  const notionChildren = textArr.slice(3).map((e) => {
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

  return { notionChildren, searchTitle: textArr[1], searchAuthor: textArr[2] };
};

/* ------------------------ */
/*      ARK newsletter      */
/* ------------------------ */

// const textArr = text.split(/\n/).filter((e) => e !== "");
// console.log(textArr.map((e) => e.match(/(By)/g)));

module.exports = bookNotes;
