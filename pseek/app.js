var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.render("index.ejs",{});
    // fs.readFile('index.ejs', 'utf8', (err, data) => {
    //     //res.writeHead(200, {'Content-Type' : 'text/html'});
    //     //res.end(ejs.render(data));
    //
    // });
});
app.get('/myPage', (req, res) => {
    res.render("myPage.ejs", {});
});

app.listen(30000, () => {
    console.log('server running');
});