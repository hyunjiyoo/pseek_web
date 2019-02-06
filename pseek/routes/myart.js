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
router.post('/upload', (req, res) => {
    // input file타입의 addImg 객체 가져옴
    let addImg = req.files.addImg;
    addImg.mv('./public/uploads/user/'+ req.session.userId + '/art/' + req.body.addTitle + '.jpg', () => {
        var sql = 'INSERT INTO art_tbl VALUES (NULL, (SELECT user_id FROM user_tbl WHERE user_id =?), ?, ?, ?, ?, ?)';
        var imgsrc = './uploads/user/'+ req.session.userId + '/art/' + req.body.addTitle + '.jpg';
        db().query(sql, [req.session.userId, req.body.addTitle, req.body.addDes, req.body.addGenre, imgsrc, req.body.addLoc ], (err, results) => {
            if(err) throw err;
            res.redirect('/myart');
        });
    });
});


module.exports = router;