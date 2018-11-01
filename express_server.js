//get all the tools:express cookie-parser
var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
var PORT = 8080; // default port 8080

//start up the ejs templating engine and cookie parser
app.use(cookieParser());
app.set("view engine", "ejs");

//start engine bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));


// A function that generate a digit string
function generateRandomString() {
    var str = '';
    var alphs = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 6; i > 0; --i) {
        str += alphs[Math.floor(Math.random() * alphs.length)];
    }
    return str;
};

//A function that finds whether a new email already exists
function ifEmail(email) {
    let ifEx = false;
    for (let i in users) {
        if (email == users[i]['email']) {
            ifEx = true;
        }
    }
    return ifEx;
}

//Our Database
var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
    "8sc9m1": "http://www.youtube.com"
};
//User database
const users = {
    "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
    }
}

//Route to POST where we submit the login form
app.post("/login", (req, res) => {
    // let templateVars = {
    //     userName: req.cookies["userName"],
    // };
    const {
        userName
    } = req.body;
    res.cookie('userName', userName);
    res.redirect("/urls");
});


app.post("/register", (req, res) => {

    let newId = generateRandomString();
    const {
        email,
        password
    } = req.body;
    console.log(ifEmail(email));
    
    if (email && password && !ifEmail(email)) {
        let newUser = {
            id: newId,
            email: email,
            password: password
        };
        users[newId] = newUser;
        //console.log(users);
        res.cookie('user_id', newId);
        res.redirect("/urls");
    }
    else if (ifEmail(email)){
        res.status(400).send('The email already exists!!');
    }
    else {
        res.status(400).send('Please Enter Something!!');
    }
});


//Route to handle logout POST request
app.post("/logout", (req, res) => {
    res.clearCookie("userName");
    res.redirect("/urls");
});

//Post Route. Handles the delete button that was added to the main(index) page
app.post("/urls/:shortURL/delete", (req, res) => {
    let str = req.params.shortURL;
    delete urlDatabase[str];
    res.redirect("/urls");
});

//Post Route. Updates the longURL and shortURL
app.post("/urls/:shortURL", (req, res) => {
    const id = req.params.shortURL;
    const {
        long
    } = req.body;
    //Here, I could use my middleware and access req.sauceIndex
    urlDatabase[id] = long;
    res.redirect("/urls");
});

//Route to print out urls in /urls 
app.get("/urls", (req, res) => {
    let templateVars = {
        urls: urlDatabase,
        userName: req.cookies["userName"],
    };

    res.render("urls_index", templateVars);
});

//Register GET route. Sends the user to register page if the user doesn't log in yet
//could've created a simple button in the HTML than put another GET route in the server
app.get("/register", (req, res) => {
    res.render("url_register");
});

//Route for post
app.get("/urls/new", (req, res) => {
    let templateVars = {
        userName: req.cookies["userName"],
    };
    res.render("urls_new", templateVars);
});

//Route to redirect
app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

//Route to edit the longURL
app.get("/urls/:id", (req, res) => {
    let longURL = urlDatabase[req.params.id];
    let templateVars = {
        shortURL: req.params.id,
        longURL,
        userName: req.cookies["userName"]
    };
    res.render("urls_show", templateVars);
});

//Root Page
app.get("/", (req, res) => {
    res.send("Hello!");
});

//Display full URL
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