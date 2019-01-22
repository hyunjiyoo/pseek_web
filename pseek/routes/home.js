var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

// home으로 이동
router.get('/', (req, res) => {
    // 아티스트 4명만 가져옴
    var sql = 'SELECT userName, userId FROM `usertbl` WHERE userArtist = 1 LIMIT 4';
    db().query(sql, (err, results) => {
        if(!err) {
            res.render("index.ejs",{
                artistNames: results
            });
        }
    });
});

// 마이페이지로 이동
router.get('/mypage',(req, res) => {
    res.render("myPage.ejs",{});
});

// 장르별 작품페이지로 이동
router.get('/abstract',(req, res) => {
    res.render("./artwork/abstract.ejs",{});
});
router.get('/contemporary',(req, res) => {
    res.render("./artwork/contemporary.ejs",{});
});
router.get('/modern',(req, res) => {
    res.render("./artwork/modern.ejs",{});
});
router.get('/pop',(req, res) => {
    res.render("./artwork/pop.ejs",{});
});
router.get('/stillLife',(req, res) => {
    res.render("./artwork/stillLife.ejs",{});
});
router.get('/surrealism',(req, res) => {
    res.render("./artwork/surrealism.ejs",{});
});

module.exports = router;