const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/movie_playlist", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connection Successful`);
  })
  .catch((e) => {
    console.log(`Connection Faied`);
  });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database.");
});

const playlistSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  playlistData: {
    type: [
      {
        Title: { type: String, required: true },
        Year: { type: String },
        imdbID: { type: String },
        Type: { type: String },
        Poster: { type: String },
      },
    ],
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
  },
});

const Playlist = new mongoose.model("Playlist", playlistSchema);
const User = mongoose.model("User", userSchema);

app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to signup.", error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ username: user.username }, "YOUR_SECRET_KEY");
    res.json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Failed to login.", error: error.message });
  }
});

app.post("/api/createPlaylist", async (req, res) => {
  try {
    const userName = req.body.userName;
    const isPublic = req.body.isPublic;
    const name = req.body.name;
    const playlistData = req.body.playlistData;
    const newPlaylist = new Playlist({
      userName: userName,
      name: name,
      isPublic: isPublic,
      playlistData: playlistData,
    });
    console.log(newPlaylist, "pl");
    await newPlaylist.save();

    res.status(201).json({
      message: "Playlist saved successfully!",
      newPlaylist: newPlaylist,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create playlist.", error: error });
  }
});

app.get("/api/playlists", async (req, res) => {
  try {
    const userName = req.query.userName;
    const client = await MongoClient.connect(`mongodb://localhost:27017`);
    const db = client.db("movie_playlist");
    const playlistsCollection = db.collection("playlists");
    const playlists = await playlistsCollection
      .find({ userName: userName })
      .toArray();

    client.close();

    console.log(playlists);
    if (playlists.length > 0) {
      res.status(200).json(playlists);
    } else {
      res
        .status(404)
        .json({ message: "No playlists found for the provided userName." });
    }
  } catch (error) {
    console.error("Error retrieving playlists:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve playlists.", error: error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
