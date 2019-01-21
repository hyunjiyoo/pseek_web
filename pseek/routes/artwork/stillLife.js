var express = require('express');
var router = express.Router();

// stillLife으로 이동
router.get('/', (req, res) => {
    res.render("mStillLife.ejs",{});
});

module.exports = router;