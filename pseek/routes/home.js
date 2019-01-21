var express = require('express');
var router = express.Router();
var db = require('./lib/db.js');

// home으로 이동
router.get('/', (req, res) => {
    var sql = 'SELECT userName FROM usertbl WHERE userArtist = 1';
    db().query(sql, (err, results) => {
        if(!err) {
            // for(let i in results) {
            //     var artistName = results[i]["userName"];
            //     console.log(artistName);
            // }
            res.render("index.ejs",{
                artistNames: results
            });
            db().end();
        }
    });
});

module.exports = router;