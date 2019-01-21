var express = require('express');
var fs = require('fs');
var app = express();

/*
* ejs view 사용
* */
app.set("view engine", "ejs");

/*
* default 경로 . 선언
* */
app.use(express.static(__dirname + "/."));


app.get('/', (req, res) => {
    // fs.readFile('index.html', 'utf8', (err, data) => {
    //     res.writeHead(200, {'Content-Type' : 'text/html'});
    //     res.end(data);
    // });
    res.render("index");
});

app.listen(30000, () => {
    console.log('server running');
});