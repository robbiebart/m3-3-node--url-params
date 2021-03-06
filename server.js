"use strict";

const morgan = require("morgan");

const { top50 } = require("./data/top50");

const PORT = process.env.PORT || 8000;

const express = require("express");

// <% top50.map((song)=>{ %>
//     <li>
//         <div class=rank><%-song.rank%></div>
//         <div class=streams><%-song.streams%></div>
//         <div class=title><%-song.title%></div>
//         <div class=artist><%-song.artist%></div>
//         <div class=pubDate><%-song.publicationDate%></div>
//     </li>
// <% }) %>

const top50Handler = (req, res) => {
  res.render("pages/top50", {
    title: "Top 50 Songs Streamed on Spotify",
    top50: top50,
  });
};

const popularArtistHandler = (req, res) => {
  let currentMostPopular = null;
  let artists = {};
  top50.forEach((song) => {
    if (artists[song.artist] === undefined) {
      artists[song.artist] = { name: song.artist, songs: [song] };
    } else {
      artists[song.artist].songs.push(song);
    }
    let artist = artists[song.artist];
    currentMostPopular =
      currentMostPopular === null
        ? (currentMostPopular = artist)
        : currentMostPopular.songs.length >= artist.songs.length
        ? currentMostPopular
        : artist;
    console.log("most popular artist is", currentMostPopular);
  });
  res.render("pages/top50", {
    title: "Most Popular Artist",
    top50: currentMostPopular.songs,
  });
};

const individualSongHandler = (req, res) => {
  const id = req.params.id;
  console.log("reqparams", req.params);
  const song = top50.find((song) => {
    return song.rank == id;
  });
  console.log("song", song);
  if (song !== undefined) {
    res.render("pages/songpage", { title: song.title, song });
  } else {
    res.status(404);
    res.render("pages/fourOhFour", {
      path: req.originalUrl,
      title: "Wrong song Id",
    });
  }
};

const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// endpoints here
// res.render(view [, locals] [, callback])

app.get("/top50", top50Handler);
app.get("/top50/song/:id", individualSongHandler);
app.get("/top50/popular-artist", popularArtistHandler);

// handle 404s
app.get("*", (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    title: "I got nothing",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

/*
get handles http requests; get is a kind of http requests; when you are trying to get a 
resource from a server, the front end sends back this kind of req; its up to the server
to handle this request and send something back to the front, and this is why we call
a handler;

the handlers for get and other such functions; it always has req object, and that object
has all sorts of data associated with it, and its handled in the backend with req 
object; that's why the query params go with req object

the second is the response object. this is used to send back a response to front-end, 
this is why we do res.render etc

there is a third one called next; the way express works checks the next bit of middleware
next object jumps into the next middleware (this won't come up, just good to know);

process.cwd() + '/views'
    cwd current working directory
    cwd is wherever the json is (usually); inside node you can console.log(process.cwd())
        this will tell you what current working directory is
        all our views are in process.cwd/views - that is our views folder; so anytime
we are tryign to render a view, express goes there so we can start from pages and the whole
rel path isn't necessary


*/
