var express = require('express');
var fs = require('fs');
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

// 로그인
router.get('/login', (req, res) => {
    res.render("login.ejs",{});
});

router.post('/login', (req, res) => {
    var body = req.body;
    var userid = body.username;
    var password = body.password;
    var sql = 'SELECT * FROM `user_tbl` WHERE user_id = ? AND user_password = ?';
    db().query(sql, [userid, password], (err, results) => {
        // results.length는 result 값에 값이 하나가 들어있음
        if(results.length > 0) {
            if(userid === results[0].user_id && password === results[0].user_password) {
                // 로그인 성공
                // 세션객체에 로그인여부확인 변수 생성
                req.session.is_Logined = true;
                // 세션객체에 userId 변수 생성
                req.session.userId = userid;
                req.session.username = results[0].user_name;
                req.session.userphone = results[0].user_tel;
                res.redirect('/');
            }
        } else {
            // 로그인 실패
            res.redirect('/login');
        }
    });
});

// 로그아웃
router.get('/logout', (req, res) => {
    // 세션 삭제
    req.session.destroy((err) => {
        res.redirect('/');
    }) ;
});

// 회원가입
router.get('/register', (req, res) => {
    res.render('register.ejs', {});
});

router.post('/register', (req, res) => {
    let body = req.body;
    var regId = body.id;
    var regname = body.name;
    var regPwd = body.password;
    var regPhone = body.phone_number;

    var sql = 'INSERT INTO `user_tbl` (user_id, user_name, user_password, user_tel) VALUES (?,?,?,?)';
    db().query(sql, [regId, regname, regPwd, regPhone], (err, results) => {
        if (err) {
            // INSERT시 user_id가 PK이므로 중복값 존재 X
            // 따라서, err발생 => 동일아이디가 존재한다는 의미. (DB자체에서 수행)
            res.render('register.ejs', {
                existId: regId
            });
        } else {
            res.redirect('/login');
        }
    });
});

// 마이페이지로 이동
router.get('/myPage', (req, res) => {
    // pick테이블에서 현재 로그인된 user_id에 해당하는 pick 작품을 art_id로 조회하여 art테이블에서 작품이미지와 타이틀 데이터 조회.
    var sql = 'SELECT art_id, art_imgsrc, art_title FROM `art_tbl` WHERE `art_tbl`.art_id IN (SELECT `pick_tbl`.art_id FROM `pick_tbl` WHERE `pick_tbl`.user_id = ?)';
    db().query(sql, [req.session.userId], (err, results) => {
        var pickArt = results;
        // pick테이블에서 현재 로그인된 user_id에 해당하는 pick 아티스트를 artist_id로 조회하여 art테이블에서 아티스트이미지와 이름 조회.
        var sql = 'SELECT user_imgsrc, user_name FROM user_tbl WHERE user_tbl.user_id IN (SELECT pick_tbl.artist_id FROM pick_tbl WHERE pick_tbl.user_id = ?)';
        db().query(sql, [req.session.userId], (err, results) => {
            res.render("myPage.ejs",{
                pickArt: pickArt,
                pickArtist: results
            });
        });
    });

});

// 이용권 구매
router.get('/payTicket', (req, res) => {
    res.render("payTicket.ejs", {});
});

// 장르별 작품페이지로 이동
fs.readdir('./views/artwork', (err, filelist) => {
    for(let i = 0; i < filelist.length; i++) {
        let artGenre = filelist[i].slice(0, -4);
        router.get(`/${artGenre}`, (req, res) => {
            // 장르별로 art테이블 컬럼값 가져오는 쿼리문.
            var sql = 'SELECT * FROM `art_tbl` WHERE art_genre = ?';
            db().query(sql, [`${artGenre}`], (err, results) => {
                if(!err) {
                    // artwork = 장르별 art테이블에서 전체 데이터 가져오는 값을 변수에 저장.
                    var artwork = results;
                    // 로그인된 user_id에 해당하는 art_id를 pick테이블에서 SELECT 수행.
                    var selectSql = 'SELECT art_id FROM `pick_tbl` WHERE user_id = ?';
                    db().query(selectSql, [req.session.userId], (err, results) => {
                        // 작품 상세페이지에 작품리스트와 LIKE한 작품 전달.
                        res.render(`./artwork/abstract.ejs`,{
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
                if(err) throw err;
                res.redirect('/' + req.params.genre);
            });
        });
        // DISLIKE 버튼 눌렀을 때 pick_tbl에 데이터 DELETE
        router.post('/:genre/dislike/:id', (req, res) => {
            // req.params객체로 삭제할 art_id를 가져와서 pick테이블에서 DELETE 수행.
            var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.art_id = (SELECT `art_tbl`.art_id FROM `art_tbl` WHERE `art_tbl`.art_id = ' + "'" + req.params.id + "'" + ')';
            db().query(sql, [], (err, results) => {
                if(err) throw err;
                res.redirect('/' + req.params.genre);
            });
        });
    }
});

// 작가페이지로 이동
router.get('/artist', (req, res) => {
    var sql ='SELECT * FROM `user_tbl`';
    db().query(sql, (err, results) => {
        var artistList = results;
        console.log(results.length);
        // 로그인된 user_id를 pick테이블에서 조회하여 해당 user테이블에 있는 값 모두 조회.
        var sql ='SELECT * FROM `user_tbl` WHERE `user_tbl`.user_id IN (SELECT `pick_tbl`.artist_id FROM `pick_tbl` WHERE `pick_tbl`.user_id = ?)';
        db().query(sql, [req.session.userId], (err, results) => {
            console.log(results.length);
            res.render('artist.ejs', {
                artistList: artistList,
                artistpick: results
            });
        });
    });
});
// LIKE 버튼 눌렀을 때 pick_tbl에 데이터 INSERT
router.post('/artist/like/:id', (req,res) => {
    // req.params객체로 user_id를 가져와서 user테이블에서 해당 값에 대한 데이터를 pick테이블에 INSERT 수행.
    var sql = 'INSERT INTO pick_tbl VALUES (NULL, ?, NULL, (SELECT user_id FROM user_tbl WHERE user_id = ?))';
    db().query(sql, [req.session.userId, req.params.id], (err, results) => {
        if(err) throw err;
        res.redirect('/artist');
    });
});
// DISLIKE 버튼 눌렀을 때 pick_tbl에 데이터 DELETE
router.post('/artist/dislike/:id', (req,res) => {
    // req.params객체로 삭제할 user_id를 가져와서 pick테이블에서 DELETE 수행.
    var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.artist_id = (SELECT `user_tbl`.user_id FROM `user_tbl` WHERE `user_tbl`.user_id = ?)';
    db().query(sql, [req.params.id], (err, results) => {
        if(err) throw err;
        res.redirect('/artist');
    });
});


module.exports = router;