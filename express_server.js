//get all the tools
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080


//start up the ejs templating engine
app.set("view engine", "ejs");

var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};
//Route to print out urls in /urls 
app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });
//main page
app.get("/", (req, res) => {
    res.send("Hello!");
});
//display full URL
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});
//hello page
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});