var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

// Pick Art
router.get('/myPick/art', (req, res) => {
    var sql = 'SELECT * FROM `art_tbl` WHERE `art_tbl`.art_id IN (SELECT `pick_tbl`.art_id FROM `pick_tbl` WHERE `pick_tbl`.user_id = ? AND pick_tbl.art_id IS NOT NULL)';
    db().query(sql, [req.session.userId], (err, results) => {
        res.render('pickArt.ejs', {
            pickArt: results
        });
    });
});


// Pick Artist
router.get('/myPick/artist', (req, res) => {
    var sql = 'SELECT * FROM user_tbl WHERE `user_tbl`.user_id IN (SELECT `pick_tbl`.artist_id FROM `pick_tbl` WHERE `pick_tbl`.user_id = ? AND pick_tbl.artist_id IS NOT NULL)';
    db().query(sql, [req.session.userId], (err, results) => {
        res.render('pickArtist.ejs', {
            pickArtist: results
        });
    });
});

module.exports = router;