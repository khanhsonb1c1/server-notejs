const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const blogRoute = require("./routes/BlogRouter");

app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
app.use(morgan("common"));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

mongoose.set("strictQuery", true);

mongoose.connect(
  process.env.MONGOOSE_URL,
  () => {
    console.log("success: ", process.env.MONGOOSE_URL );
  }
);

app.use("/api/blog", blogRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

let PORT = process.env.PORT || 5005
app.listen(PORT, () => console.log(`App running on port: ${PORT}`))