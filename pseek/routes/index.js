var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

// home으로 이동
router.get('/', (req, res) => {
    // 아티스트 4명만 가져옴
    var sql = 'SELECT user_name, user_id FROM `user_tbl` LIMIT 4';
    db().query(sql, (err, results) => {
        if(!err) {
            if(req.session.is_Logined){
                res.render("index.ejs",{
                    isLogined: req.session.is_Logined,
                    user: req.session.userId,
                    username: req.session.username,
                    userphone: req.session.userphone,
                    artistNames: results
                });
            } else {
                res.render("index.ejs",{
                    artistNames: results
                });
            }
        }
    });
});

// 마이페이지
router.get('/myPage', (req, res) => {
    /*  sql[0]: pick테이블에서 현재 로그인된 user_id에 해당하는 pick 작품을 art_id로 조회하여 art테이블에서 작품이미지와 타이틀 데이터 조회.
        sql[1]: pick테이블에서 현재 로그인된 user_id에 해당하는 pick 아티스트를 artist_id로 조회하여 art테이블에서 아티스트이미지와 이름 조회.
        sql[2]: user테이블에서 현재 로그인된 user_id에 해당하는 user를 art테이블에서 가져와서 작품 조회.
    */
    var sql = 'SELECT * FROM `art_tbl` WHERE `art_tbl`.art_id IN (SELECT `pick_tbl`.art_id FROM `pick_tbl` WHERE `pick_tbl`.user_id = ?);' +
        'SELECT * FROM `user_tbl` WHERE `user_tbl`.user_id IN (SELECT `pick_tbl`.artist_id FROM `pick_tbl` WHERE `pick_tbl`.user_id = ?); ' +
        'SELECT * FROM art_tbl WHERE art_tbl.artist_id = (SELECT user_tbl.user_id FROM user_tbl WHERE user_id = ?)';
    var loggedinId = req.session.userId;
    db().query(sql, [loggedinId, loggedinId, loggedinId], (err, results) => {
        res.render("myPage.ejs",{
            pickArt: results[0],
            pickArtist: results[1],
            myArt: results[2]
        });
    });
});

// 이용권 구매
router.get('/payTicket', (req, res) => {
    res.render("payTicket.ejs", {});
});

// 장르별 작품페이지로 이동
var artGenre = ['abstract', 'contemporary', 'modern', 'pop', 'stillLife', 'surrealism'];
for (let i = 0; i < artGenre.length; i++) {
    router.get(`/${artGenre[i]}`, (req, res) => {
        // 장르별로 art테이블 컬럼값 가져오는 쿼리문.
        var sql = 'SELECT * FROM `art_tbl` WHERE art_genre = ?';
        db().query(sql, [`${artGenre[i]}`], (err, results) => {
            if (!err) {
                // artwork = 장르별 art테이블에서 전체 데이터 가져오는 값을 변수에 저장.
                var artwork = results;
                // 로그인된 user_id에 해당하는 art_id를 pick테이블에서 SELECT 수행.
                var selectSql = 'SELECT art_id FROM `pick_tbl` WHERE user_id = ?';
                db().query(selectSql, [req.session.userId], (err, results) => {
                    // 작품 상세페이지에 작품리스트와 LIKE한 작품 전달.
                    res.render(`./artwork.ejs`, {
                        artwork: artwork,
                        userpick: results
                    });
                });
            }
        });
    });
    // LIKE 버튼 눌렀을 때 pick_tbl에 데이터 INSERT
    router.post('/:genre/like/:id', (req, res) => {
        // req.params객체로 art_id를 가져와서 art테이블에서 해당 값에 대한 데이터를 pick테이블에 INSERT 수행.
        var sql = 'INSERT INTO `pick_tbl` (pick_id, user_id, art_id) VALUES (?, ?, (SELECT art_id FROM art_tbl WHERE art_id = ' + "'" + req.params.id + "'" + '))';
        db().query(sql, [null, req.session.userId], (err, results) => {
            if (err) throw err;
            res.redirect('/' + req.params.genre);
        });
    });
    // DISLIKE 버튼 눌렀을 때 pick_tbl에 데이터 DELETE
    router.post('/:genre/dislike/:id', (req, res) => {
        // req.params객체로 삭제할 art_id를 가져와서 pick테이블에서 DELETE 수행.
        var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.art_id = (SELECT `art_tbl`.art_id FROM `art_tbl` WHERE `art_tbl`.art_id = ' + "'" + req.params.id + "'" + ')';
        db().query(sql, [], (err, results) => {
            if (err) throw err;
            res.redirect('/' + req.params.genre);
        });
    });
}

// 작가페이지로 이동
// router.get('/artist', (req, res) => {
//     var sql ='SELECT * FROM `user_tbl`';
//     db().query(sql, (err, results) => {
//         var artistList = results;
//         // 로그인된 user_id를 pick테이블에서 조회하여 해당 user테이블에 있는 값 모두 조회.
//         var sql ='SELECT * FROM `user_tbl` WHERE `user_tbl`.user_id IN (SELECT `pick_tbl`.artist_id FROM `pick_tbl` WHERE `pick_tbl`.user_id = ?)';
//         db().query(sql, [req.session.userId], (err, results) => {
//             res.render('artist.ejs', {
//                 artistList: artistList,
//                 artistpick: results
//             });
//         });
//     });
// });
// // LIKE 버튼 눌렀을 때 pick_tbl에 픽아티스트 데이터 INSERT
// router.post('/artist/like/:id', (req,res) => {
//     // req.params객체로 user_id를 가져와서 user테이블에서 해당 값에 대한 데이터를 pick테이블에 INSERT 수행.
//     var sql = 'INSERT INTO pick_tbl VALUES (NULL, ?, NULL, (SELECT user_id FROM user_tbl WHERE user_id = ?))';
//     db().query(sql, [req.session.userId, req.params.id], (err, results) => {
//         if(err) throw err;
//         res.redirect('/artist');
//     });
// });
// // DISLIKE 버튼 눌렀을 때 pick_tbl에서 픽아티스트 데이터 DELETE
// router.post('/artist/dislike/:id', (req,res) => {
//     // req.params객체로 삭제할 user_id를 가져와서 pick테이블에서 DELETE 수행.
//     var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.artist_id = (SELECT `user_tbl`.user_id FROM `user_tbl` WHERE `user_tbl`.user_id = ?)';
//     db().query(sql, [req.params.id], (err, results) => {
//         if(err) throw err;
//         res.redirect('/artist');
//     });
// });

// museum 이동
router.get('/museum', (req, res) => {
   res.render('museum.ejs', {});
});

module.exports = router;