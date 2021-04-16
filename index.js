const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const route = require("./routers");
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Crypto", {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Connected success");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());

route(app);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
