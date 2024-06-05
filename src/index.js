const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
// var _ = require('lodash');


//* decrare blog route
const blogRoute = require("./routes/blog/BlogRouter");
const categoryRoute = require("./routes/blog/CategoryRouter");

//* decrare music route
const musicRoute = require("./routes/music/MusicRouter");
const albumRoute = require("./routes/music/AlbumRouter");
const singerRoute = require("./routes/music/SingerRouter");
const tagRoute = require("./routes/music/TagRouter");
const authRoute = require("./routes/auth/authRoute");
const favoriteRoute = require("./routes/favorite/favoriteRoute");

// * decrare user route
const userRoute = require("./routes/user/UserRouter");


const searchRoute = require("./routes/searchRouter");


//* decrare revert route
const revertMusicRoute = require("./routes/deleted/revertMusic")

app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
app.use(morgan("common"));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGOOSE_URL, () => {
  console.log("success: ", process.env.MONGOOSE_URL);
});

//! this is decrare path api

//* BLOG
app.use("/api/blogs", blogRoute);
app.use("/api/categories", categoryRoute);

//* MUSIC
app.use("/api/musics", musicRoute);
app.use("/api/albums", albumRoute);
app.use("/api/singers", singerRoute);
app.use("/api/tags", tagRoute);

//* USER
app.use("/api/users", userRoute);

//* AUTH
app.use("/api/auth", authRoute);

//* favorite
app.use("/api/favorite", favoriteRoute);


//* REVERT
app.use("/api/revert", revertMusicRoute);

//* search

app.use("/api/search_all", searchRoute);


app.get("/", (req, res) => {
  res.send("Wellcome to server of Khanh Son !");
});

let PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`App running on port: ${PORT}`));
