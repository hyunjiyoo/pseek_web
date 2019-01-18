var express = require('express');
var fs = require('fs');
var app = express();

// app.use(express.static(__dirname + '/public'));
// app.use('/', (req, res, next) => {
//     fs.readFile('header-bg.jpg', (err, data) => {
//         res.writeHead(200, {'Content-Type' : 'image/jpg'});
//         console.log(data);
//         res.send(data);
//     });
//     next();
// });

app.get('/', (req, res) => {
    fs.readFile('index.html', 'utf8', (err, data) => {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(data);
    });
});

app.listen(30000, () => {
    console.log('server running');
});