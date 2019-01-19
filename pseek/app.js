var express = require('express');
var fs = require('fs');
var app = express();

app.get('/', (req, res) => {
    fs.readFile('index.html', 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(data);
    });
});

app.listen(30000, () => {
    console.log('server running');
});