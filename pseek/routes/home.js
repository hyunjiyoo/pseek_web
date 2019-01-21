var express = require('express');
var router = express.Router();

// home으로 이동
router.get('/', (req, res) => {
    res.render("index.ejs",{});
});

module.exports = router;