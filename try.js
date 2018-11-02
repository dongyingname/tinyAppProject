// const bcrypt = require('bcrypt');

// const hash = bcrypt.hashSync('hahahaahahah', 15);
// console.log(hash);
// // res == true)
// console.log(bcrypt.compareSync('one', hash));
// console.log(bcrypt.compareSync('hahahaahahah', hash));
var cookieSession = require('cookie-session')
var express = require('express')

var app = express()

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

app.get('/', function (req, res, next) {
    // Update views
    req.session.views = (req.session.views || 0) + 1

    // Write response
    res.end(req.session.views + ' views')
})

app.listen(3000)