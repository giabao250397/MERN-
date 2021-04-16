const authRouter = require("./auth");
const postRouter = require("./posts");

function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/posts", postRouter);
}

module.exports = route;
