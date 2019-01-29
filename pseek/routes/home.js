var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

// home으로 이동
router.get('/', (req, res) => {
    // 아티스트 4명만 가져옴
    // var sql = 'SELECT userName, userId FROM `usertbl` WHERE userArtist = 1 LIMIT 4';
    // db().query(sql, (err, results) => {
    //     if(!err) {
    //         res.render("index.ejs",{
    //             artistNames: results
    //         });
    //         db().end();
    //     }
    // });
    res.render("./artwork/abstract.ejs",{
        //             artistNames: results
                });
});

module.exports = router;