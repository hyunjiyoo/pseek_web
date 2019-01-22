var express = require('express');
// var fs = require('fs');
// var ejs = require('ejs');
var bodyParser = require('body-parser');
var app = express();
var db = require('./lib/db.js');

db();

// 미들웨어 설정
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', require("./routes/home"));

app.listen(30000, () => {
    console.log('server running');
});