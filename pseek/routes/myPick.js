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
// DISLIKE 버튼 눌렀을 때 pick_tbl에 데이터 DELETE
router.post('/myPick/art/dislike/:genre/:id', (req, res) => {
    // req.params객체로 삭제할 art_id를 가져와서 pick테이블에서 DELETE 수행.
    var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.art_id = (SELECT `art_tbl`.art_id FROM `art_tbl` WHERE `art_tbl`.art_id = ' + "'" + req.params.id + "'" + ')';
    db().query(sql, [], (err, results) => {
        console.log(req.params.id);
        if (err) throw err;
        res.redirect('/myPick/myPick/art');
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

// DISLIKE 버튼 눌렀을 때 pick_tbl에서 픽아티스트 데이터 DELETE
router.post('/myPick/artist/dislike/:pickuserid', (req,res) => {
    // req.params객체로 삭제할 user_id를 가져와서 pick테이블에서 DELETE 수행.
    var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.artist_id = (SELECT `user_tbl`.user_id FROM `user_tbl` WHERE `user_tbl`.user_id = ? )';
    db().query(sql, [req.params.pickuserid], (err, results) => {
        console.log(req.params.pickuserid);
        if(err) throw err;
        res.redirect('/myPick/myPick/artist');
    });
});

module.exports = router;