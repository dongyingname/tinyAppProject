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

//A function to determine whether the username and password combination
// exists in the users object
function ifMatch(email, password) {
    //1:Correct combination
    //2:Correct email, wrong password
    //3:email dosn't exist
    let ifEx = [];    
    for (let i in users) {
        if (users[i]['email'] == email && password == users[i].password) {
            ifEx[0] = 1;
            ifEx[1] = i;
            //console.log(ifEx[1]);
        } else if (users[i]['email'] == email && password != users[i].password) {
            ifEx[0] = 2;
           // console.log(users[i]['password'])
        } else {
            ifEx[0] = 3;
        }
        
    }
    return ifEx;
}

//Our DatabaseurlDatabase
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

//Route to print out urls in /urls 
app.get("/urls", (req, res) => {
    let templateVars = {
        users: users,
        userName: req.cookies["userName"],
    };

    res.render("urls_index", templateVars);
});

//Route to Login page
app.get("/login", (req, res) => {
    let templateVars = {
        users: users,
        userName: req.cookies["userName"],
    };

    res.render("url_login", templateVars);
});

//Register GET route. Sends the user to register page if the user doesn't log in yet
//could've created a simple button in the HTML than put another GET route in the server
app.get("/register", (req, res) => {
    res.render("url_register");
});

//Route for post
app.get("/urls/new", (req, res) => {
    let templateVars = {
        users: users,
        userName: req.cookies["userName"],
    };
    res.render("urls_new", templateVars);
});

//Route to redirect
app.get("/u/:shortURL", (req, res) => {
    let longURL = users[req.params.shortURL]['email'];
    res.redirect(longURL);
});

//Route to edit the longURL
app.get("/urls/:id", (req, res) => {
    let longURL = users[req.params.id]['email'];
    let templateVars = {
        shortURL: req.params.id,
        longURL,
        users: users,
        userName: req.cookies["userName"]
    };
    res.render("urls_show", templateVars);
});

//Route to POST where we submit the login form
app.post("/login", (req, res) => {
    const {
        userName,
        password
    } = req.body;
    if (ifMatch(userName, password)[0] == 1){
        let user_id = ifMatch(userName, password)[1];
        res.cookie('user_id', user_id);
        res.redirect("/urls");
    } else if (ifMatch(userName, password)[0] == 2){
        res.status(400).send("Status Code 400!! Wrong Password!!");
    } else if (ifMatch(userName, password)[0] == 3){
        res.status(400).send("Status Code 400!! Please Register First!!");
    }
});

//A POST route that take the register info and determine whether to send
//to cookie based on the validity of the info
app.post("/register", (req, res) => {

    let newId = generateRandomString();
    const {
        email,
        password
    } = req.body;
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
    } else if (ifEmail(email)) {
        res.status(400).send("Status Code 400!! The email already exists!!");
    } else {
        res.status(400).send("Status Code 400!! Please Enter Something!!");
    }
});

//Route to handle logout POST request
app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/urls");
});

//Post Route. Handles the delete button that was added to the main(index) page
app.post("/urls/:shortURL/delete", (req, res) => {
    let str = req.params.shortURL;
    delete users[str];
    res.redirect("/urls");
});

//Post Route. Updates the longURL and shortURL
app.post("/urls/:shortURL", (req, res) => {
    const id = req.params.shortURL;
    const {
        long
    } = req.body;
    //Here, I could use my middleware and access req.sauceIndex
    users[id]['email'] = long;
    res.redirect("/urls");
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