//get all the tools: express, cookie session
//start up the ejs templating engine and cookie parser
//cookie-session: a cookie encrypt engine
//initiate bcypt hashing engine
//default port 8080
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const PORT = 8080;

//start engine bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));

//Set cookie session.
app.use(cookieSession({
    name: 'session',
    keys: ['kklasdnknaldk', 'iawodhihqq']
}));

// A function that generate a digit string, which is used for creating unencrypted user ID
// and short URL
function generateRandomString() {
    var str = '';
    var alphs = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 6; i > 0; --i) {
        str += alphs[Math.floor(Math.random() * alphs.length)];
    }

    return str;
};

//A function that finds whether a new email already exists,
//when one is registering a new account to POST /login 
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
//exists in the users object
function ifMatch(email, password) {
    //1:Correct combination
    //2:Correct email, wrong password
    //3:email dosn't exist
    let ifEx = [];
    for (let i in users) {
        if (users[i]['email'] == email && bcrypt.compareSync(password, users[i].password)) {
            ifEx[0] = 1;
            ifEx[1] = i;
        } else if (users[i]['email'] == email && password != users[i].password) {
            ifEx[0] = 2;
        } else {
            ifEx[0] = 3;
        }
    }

    return ifEx;
}

//Our URL Database
var urlDatabase = {
    "b2xVn2": {
        longURL: "http://www.lighthouselabs.ca",
        userID: "aslnds"
    },
    "9sm5xK": {
        longURL: "http://www.google.com",
        userID: "adlkas"
    },
    "8sc9m1": {
        longURL: "http://www.youtube.com",
        userID: "ssoool"
    }
};
//User Info database, contains generated 6 digit ID as the key, session encrypted id,
//email, and bcrypt encrypted password
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

//GET route to our main page 
app.get("/urls", (req, res) => {

    let templateVars = {
        users: users,
        user_id: req.session.user_id,
        urls: urlDatabase
    };

    res.render("urls_index", templateVars);

});

//GET route to Login page
app.get("/login", (req, res) => {

    res.render("url_login");
});

//Register GET route. Sends the user to register page if the user doesn't log in yet
//could've created a simple button in the HTML than put another GET route in the server
app.get("/register", (req, res) => {

    res.render("url_register");
});

//POST route to the URL creation page. Only accessible to user who logs in.
app.get("/urls/new", (req, res) => {

    let user_id = req.session.user_id;
    let templateVars = {
        users: users,
        user_id: req.session.user_id
    };
    if (user_id) {
        res.render("urls_new", templateVars);
    } else {
        res.redirect("/login");
    }
});

//Route to redirect to the longURL if the short URL exists in the database
app.get("/u/:shortURL", (req, res) => {

    let longURL = urlDatabase[req.params.shortURL]['longURL'];
    res.redirect(longURL);
});

//Route to edit the longURL
app.get("/urls/:id", (req, res) => {

    let longURL = urlDatabase[req.params.id]['longURL'];
    let templateVars = {
        shortURL: req.params.id,
        longURL,
        users: users,
        user_id: req.session.user_id
    };

    res.render("urls_show", templateVars);
});

//Route to POST where we submit the login form
app.post("/login", (req, res) => {

    let {
        userName,
        password
    } = req.body;

    if (ifMatch(userName, password)[0] == 1) {
        let user_id = ifMatch(userName, password)[1];
        req.session.user_id = user_id;
        res.redirect("/urls");
    } else if (ifMatch(userName, password)[0] == 2) {
        res.status(403).send("Status Code 403!! Wrong Password!! Please go back to the previous page");
    } else if (ifMatch(userName, password)[0] == 3) {
        res.status(403).send("Status Code 403!!Please Register First!! Please go back to the previous page");
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
    const hashPass = bcrypt.hashSync(password, 15);

    if (email && password && !ifEmail(email)) {
        let newUser = {
            id: newId,
            email: email,
            password: hashPass
        };
        users[newId] = newUser;
        req.session.user_id = newId;
        res.redirect("/urls");
    } else if (ifEmail(email)) {
        res.status(400).send("Status Code 400!! The email already exists!!");
    } else {
        res.status(400).send("Status Code 400!! Please Enter Something!!");
    }
});

//Route to handle logout POST request
app.post("/logout", (req, res) => {
    delete req.session.user_id;;
    res.redirect("/urls");

});

//Post Route. Handles the delete button that was added to the main(index) page
app.post("/urls/:shortURL/delete", (req, res) => {
    const str = req.params.shortURL;
    const user_id = req.session.user_id;

    if (user_id && user_id == urlDatabase[str]['userID']) {
        delete urlDatabase[str];
        res.redirect("/urls");
    } else if (user_id) {
        res.send("You can only delete your own URL");
    } else {
        res.redirect("/login");
    }
});

//Post Route. Updates the longURL and shortURL
app.post("/urls/:shortURL", (req, res) => {
    const str = req.params.shortURL;
    const user_id = req.session.user_id;
    const {
        longURL
    } = req.body;

    if (user_id && user_id == urlDatabase[str]['userID']) {
        urlDatabase[str]['longURL'] = longURL;
        res.redirect("/urls");
    } else if (user_id) {
        res.send("You can only edit your own URL");
    } else {
        res.redirect("/login");
    }
});

//Post Route. Create a new URL and add it to the urlDatabase
app.post("/urls", (req, res) => {
    const {
        longURL
    } = req.body;
    const newId = generateRandomString();
    user_id = req.session.user_id;

    if (user_id) {
        urlDatabase[newId] = {
            longURL: longURL,
            userID: user_id
        };
        res.redirect("/urls");
    } else {
        res.redirect("/login");
    }
});

//Root Page. 
app.get("/", (req, res) => {
    res.send("Hello!");
});

//Display all URLs in the urlDatabase
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