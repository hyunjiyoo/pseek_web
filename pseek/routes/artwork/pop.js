var express = require('express');
var router = express.Router();

// pop으로 이동
router.get('/', (req, res) => {
    res.render("./artwork/mPop.ejs",{});
});

module.exports = router;