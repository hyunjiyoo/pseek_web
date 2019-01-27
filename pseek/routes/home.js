var express = require('express');
var fs = require('fs');
var router = express.Router();
var db = require('../lib/db.js');

// home으로 이동
router.get('/', (req, res) => {
    // 아티스트 4명만 가져옴
    var sql = 'SELECT userName, userId FROM `usertbl` WHERE userArtist = 1 LIMIT 4';
    db().query(sql, (err, results) => {
        if(!err) {
            if(req.session.is_Logined){
                res.render("index.ejs",{
                    isLogined: req.session.is_Logined,
                    user: req.session.userId,
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
    var username = body.username;
    var password = body.password;
    var sql = 'SELECT userId, userPwd FROM `usertbl` WHERE userId = ? AND userPwd = ?';
    db().query(sql, [username, password], (err, results) => {
        // results.length는 result 값에 값이 하나가 들어있음
        if(results.length > 0) {
            if(username === results[0].userId && password === results[0].userPwd) {
                // 로그인 성공
                // 세션객체에 로그인여부확인 변수 생성
                req.session.is_Logined = true;
                // 세션객체에 userId 변수 생성
                req.session.userId = username;
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

// 마이페이지로 이동
router.get('/mypage',(req, res) => {
    res.render("myPage.ejs",{});
});

// 장르별 작품페이지로 이동
fs.readdir('./views/artwork', (err, filelist) => {
    for(let i = 0; i < filelist.length; i++) {
        let artGenre = filelist[i].slice(0, -4);
        router.get(`/${artGenre}`, (req, res) => {
            res.render(`./artwork/${artGenre}.ejs`,{});
        });
    }
});

module.exports = router;