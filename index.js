const booksToNotion = require("./lib/bookNotesToNotion");
const axios = require("axios");

exports.helloWorkflows = async (req, res) => {
  try {
    switch (req.params[0]) {
      case "booksToNotion":
        await booksToNotion();
        res.status(200).json({ success: true, data: "done" });
        break;
      case "json":
        const { data } = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        res.status(200).json({ success: true, data: data });
        break;
      default:
        res.status(200).json({
          success: true,
          method: req.method,
          query: req.query,
          params: req.params,
        });
        break;
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};
