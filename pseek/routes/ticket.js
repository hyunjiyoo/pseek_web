var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

// 이용권 구매
router.get('/', (req, res) => {
    res.render("payTicket.ejs");
});

// monthly 이용권구매 시 DB에 INSERT와 SELECT 수행
router.post('/monthly/:code', (req, res) => {
    /*
    sql[0]: 티켓 구매시 tck_tbl에서 현재 로그인된 사용자의 이용권 구매내역을 INSERT
    sql[1]: 로그인된 사용자가 구매한 티켓 Title 정보 SELECT
     */
    var sql = 'INSERT INTO `tckreg_tbl`(tck_id, user_id, start_date, end_date) VALUES(?, ?, curdate(), date_add(curdate(), interval + 30 day));' +
    'SELECT * FROM `tck_tbl` WHERE tck_id IN(SELECT tck_id FROM `tckreg_tbl` WHERE user_id = ?)';
    db().query(sql, [req.params.code, req.session.userId, req.session.userId], (err, results) => {
        var ticket_length = req.session.ticket.length;
        if(ticket_length == 0 ) {
            req.session.ticket.push(results[1]);
        }
        res.redirect('/myPage');
    });
});

module.exports = router;