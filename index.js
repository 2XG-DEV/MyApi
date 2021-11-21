const PORT = process.env.PORT || 8000;

const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

const newspapers = [
  {
    name: "theguardian",
    address: "https://www.theguardian.com/uk/technology",
  },
  {
    name: "nyt",
    address: "https://www.nytimes.com/search?query=crypto",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/search?q=crypto",
  },
  {
    name: "nypost",
    address: "https://nypost.com/search/crypto/",
  },
  {
    name: "cnn",
    address: "https://edition.cnn.com/search?q=crypto",
  },
  {
    name: "yahoonews",
    address:
      "https://news.search.yahoo.com/search?p=crypto&fr=uh3_news_vert_gs&fr2=p%3Anews%2Cm%3Asb",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:icontains("crypto")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({ title, url, source: newspaper.name });
    });
  });
});

app.get("/", (req, res) => {
  res.json(articles);
});

app.listen(PORT, () => console.log("Server running on : " + PORT));
