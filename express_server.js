//get all the tools
var express = require("express");
var app = express();
var PORT = 8080; // default port 8080


//start up the ejs templating engine
app.set("view engine", "ejs");
//start engine bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// Generate 6 digit string
function generateRandomString() {
    var str = '';
    var alphs = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 6; i > 0; --i) {
        str += alphs[Math.floor(Math.random() * chars.length)];
    }
    return result;
};


//Our Database
var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

//Route to print out urls in /urls 
app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });
//Route for post
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });
//Route for test  
app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});
  
//Second route
app.get("/urls/:id", (req, res) => {
    let longURL = urlDatabase[req.params.id];
    console.log(longURL);
    let templateVars = { shortURL:req.params.id, longURL };
    res.render("urls_show", templateVars);
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