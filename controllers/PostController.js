const Post = require("../models/Post");

module.exports = {
  index: async (req, res) => {
    const { description, entryFrom, entryTo, stopLoss, takeProfits } = req.body;

    //Check entry and stop
    if (!entryFrom || !entryTo || !stopLoss)
      return res
        .status(400)
        .json({ success: false, message: "Entry or Stop Loss is required" });

    try {
      const newPost = new Post({
        description,
        entryFrom,
        entryTo,
        stopLoss,
        takeProfits,
      });
      await newPost.save();

      res.json({ success: true, message: "Happy post success" });
    } catch (error) {
      console.log(error);
    }
  },
};
