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
    res.render("myPage.ejs",{});
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
            var sql = 'SELECT art_title, art_imgsrc FROM `art_tbl` WHERE art_genre = ?';
            db().query(sql, [`${artGenre}`], (err, results) => {
                if(!err) {
                    res.render(`./artwork/${artGenre}.ejs`,{
                        artwork: results
                    });
                }
            });
        });
    }
});

module.exports = router;