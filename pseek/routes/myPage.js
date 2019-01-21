var express = require('express');
var router = express.Router();

// 마이페이지 이동
router.get('/', (req, res) => {
    res.render("myPage.ejs", {});
});

module.exports = router;