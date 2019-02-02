var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

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


module.exports = router;