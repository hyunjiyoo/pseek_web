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

// 작품 업로드
router.post('/upload', (req, res) => {
    // input file타입의 addImg 객체 가져옴
    let addImg = req.files.addImg;
    addImg.mv('./public/uploads/user/'+ req.session.userId + '/art/' + req.body.addTitle + '.jpg', () => {
        var sql = 'INSERT INTO art_tbl VALUES (NULL, (SELECT user_id FROM user_tbl WHERE user_id =?), ?, ?, ?, ?)';
        var imgsrc = '/uploads/user/'+ req.session.userId + '/art/' + req.body.addTitle + '.jpg';
        db().query(sql, [req.session.userId, req.body.addTitle, req.body.addDes, req.body.addGenre, imgsrc], (err, results) => {
            if(err) throw err;
            res.redirect('/myart');
        });
    });
});

// 작품 편집
router.post('/edit', (req, res) => {
    // input file타입의 editImg 객체 가져옴
    let editImg = req.files.editImg;

    if (editImg.name !== '') {
        editImg.mv('./public/uploads/user/'+ req.session.userId + '/art/' + req.body.editTitle + '.jpg', () => {
            var sql = 'UPDATE `art_tbl` SET art_title = ?, art_des = ?, art_genre = ?, art_imgsrc = ? WHERE artist_id = ? AND art_id = ?';
            var imgsrc = '/uploads/user/'+ req.session.userId + '/art/' + req.body.editTitle + '.jpg';
            db().query(sql, [req.body.editTitle, req.body.editDes, req.body.editGenre, imgsrc, req.session.userId, req.body.editId], (err, results) => {
                if(err) throw err;
                res.redirect('/myart');
            });
        });
    } else {
        var sql = 'UPDATE `art_tbl` SET art_title = ?, art_des = ?, art_genre = ? WHERE artist_id = ? AND art_id = ?';
        db().query(sql, [req.body.editTitle, req.body.editDes, req.body.editGenre, req.session.userId, req.body.editId], (err, results) => {
            if(err) throw err;
            res.redirect('/myart');
        });

    }
});

// 작품 삭제
router.post('/delete', (req, res) => {
    var sql = 'DELETE FROM `art_tbl` WHERE art_id = ?';
    db().query(sql, [req.body.editId], (err, results) => {
        if(err) throw err;
        console.log(req.body.editId);
        res.redirect('/myart');
    });
});

module.exports = router;