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

const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const top50Handler = (req, res) => {
  res.render("pages/top50", {
    title: "Top 50 Songs Streamed on Spotify",
    top50: top50,
  });
};

// endpoints here
// res.render(view [, locals] [, callback])

app.get("/top50", top50Handler);

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
