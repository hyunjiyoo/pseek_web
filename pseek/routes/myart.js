var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

// 마이페이지에서 내작품 더보기 (plus icon)
router.get('/', (req, res) => {
    var sql = 'SELECT * FROM `art_tbl` WHERE `art_tbl`.artist_id = (SELECT `user_tbl`.user_id FROM `user_tbl` WHERE `user_tbl`.user_id = ?)';
    db().query(sql, [req.session.userId], (err, results) => {
        res.render('myartList.ejs', {
            artistWork: results
        });
    });
});



module.exports = router;