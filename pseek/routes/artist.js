var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

// 아티스트 페이지로 이동
router.get('/', (req, res) => {
    var sql ='SELECT A.*, IF(B.PICK_ID IS NULL, \'N\', \'Y\') AS LIKEYN\n' +
        'FROM USER_TBL A\n' +
        'LEFT OUTER JOIN (\n' +
        'SELECT B.*\n' +
        'FROM USER_TBL A, PICK_TBL B\n' +
        'WHERE a.USER_ID = B.USER_ID\n' +
        '\tAND B.USER_ID =?\n' +
        ') B\n' +
        'ON A.USER_ID=B.ARTIST_ID';
    db().query(sql, [req.session.userId], (err, results) => {
        res.render('artist.ejs', {
            artistList: results
        });
    });
});
// LIKE 버튼 눌렀을 때 pick_tbl에 픽아티스트 데이터 INSERT
router.post('/artist/like/:id', (req,res) => {
    // req.params객체로 user_id를 가져와서 user테이블에서 해당 값에 대한 데이터를 pick테이블에 INSERT 수행.
    var sql = 'INSERT INTO pick_tbl VALUES (NULL, ?, NULL, (SELECT user_id FROM user_tbl WHERE user_id = ?))';
    db().query(sql, [req.session.userId, req.params.id], (err, results) => {
        if(err) throw err;
        res.redirect('/artist');
    });
});
// DISLIKE 버튼 눌렀을 때 pick_tbl에서 픽아티스트 데이터 DELETE
router.post('/artist/dislike/:id', (req,res) => {
    // req.params객체로 삭제할 user_id를 가져와서 pick테이블에서 DELETE 수행.
    var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.artist_id = (SELECT `user_tbl`.user_id FROM `user_tbl` WHERE `user_tbl`.user_id = ?)';
    db().query(sql, [req.params.id], (err, results) => {
        if(err) throw err;
        res.redirect('/artist');
    });
});

// 작가별 작품 리스트 출력
router.get('/:id', (req,res) => {
    // req.params객체로 삭제할 user_id를 가져와서 pick테이블에서 DELETE 수행.
    var sql = 'SELECT A.*, IF(B.PICK_ID IS NULL, \'N\', \'Y\') AS LIKEYN FROM ART_TBL A \n' +
        '\tLEFT OUTER JOIN (\n' +
        '\t\tSELECT B.* FROM ART_TBL A, PICK_TBL B\n' +
        '        WHERE A.ART_ID = B.ART_ID AND B.USER_ID = ? ) B\n' +
        '        ON A.ART_ID = B.ART_ID\n' +
        '        WHERE A.artist_id = ?;';
    db().query(sql, [req.session.userId ,req.params.id], (err, results) => {
        if (!err) {
            // 작품 상세페이지에 작품리스트와 LIKE한 작품 전달.
            res.render("pickartistArt.ejs", {
                pickArt: results
            });
        }
    });
});

// LIKE 버튼 눌렀을 때 pick_tbl에 데이터 INSERT
router.post('/art/like/:artid/:artistid', (req, res) => {
    // req.params객체로 art_id를 가져와서 art테이블에서 해당 값에 대한 데이터를 pick테이블에 INSERT 수행.
    var sql = 'INSERT INTO `pick_tbl` (pick_id, user_id, art_id) VALUES (?, ?, (SELECT art_id FROM art_tbl WHERE art_id = ' + "'" + req.params.artid + "'" + '))';
    db().query(sql, [null, req.session.userId], (err, results) => {
        if (err) throw err;
        res.redirect('/artist/' + req.params.artistid);
    });
});
// DISLIKE 버튼 눌렀을 때 pick_tbl에 데이터 DELETE
router.post('/art/dislike/:artid/:artistid', (req, res) => {
    // req.params객체로 삭제할 art_id를 가져와서 pick테이블에서 DELETE 수행.
    var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.art_id = (SELECT `art_tbl`.art_id FROM `art_tbl` WHERE `art_tbl`.art_id = ' + "'" + req.params.artid + "'" + ')';
    db().query(sql, [], (err, results) => {
        if (err) throw err;
        res.redirect('/artist/' + req.params.artistid);
    });
});

module.exports = router;