var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

// 이용권 구매
router.get('/', (req, res) => {
    res.render("payTicket.ejs");
});

// monthly 이용권구매 시 DB에 INSERT와 SELECT 수행
router.post('/:code', (req, res) => {
    switch (req.params.code) {
        case '1':
            daily();
            break;
        default:
            monthly();
            break;
    }
    function monthly() {
        // 티켓 구매시 tck_tbl에서 현재 로그인된 사용자의 이용권 구매내역을 INSERT
        var sql = 'INSERT INTO `tckreg_tbl`(tck_id, user_id, start_date, end_date) VALUES(?, ?, now(), date_add(now(), interval + 30 day));';
        db().query(sql, [req.params.code, req.session.userId], (err, results) => {
            view();
        });
    }
    function daily() {
        var sql = 'INSERT INTO `tckreg_tbl`(tck_id, user_id, start_date, end_date) VALUES(?, ?, now(), date_add(now(), INTERVAL 24 HOUR));';
        db().query(sql, [req.params.code, req.session.userId], (err, results) => {
            console.log("daily insert");
            view();
        });
    }
    function view() {
        // 로그인된 사용자가 구매한 티켓 Title 정보 SELECT
        var sql = 'SELECT * FROM `tck_tbl` WHERE tck_id IN(SELECT tck_id FROM `tckreg_tbl` WHERE user_id = ?);';
        db().query(sql, [req.session.userId], (err, results) => {
            var ticket_length = req.session.ticket.length;
            console.log("ticket_length: " + ticket_length);
            if(ticket_length === 0) {
                console.log("results: " + results);
                req.session.ticket.push(results);
            } else {
                req.session.ticket.pop();
                console.log("results: " + results);
                req.session.ticket.push(results);
            }
            res.redirect('/myPage');
        });
    }
});

module.exports = router;