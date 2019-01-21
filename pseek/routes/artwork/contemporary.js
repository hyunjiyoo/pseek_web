var express = require('express');
var router = express.Router();

// contemporary로 이동
router.get('/', (req, res) => {
    res.render("./artwork/contemporary.ejs",{});
});

module.exports = router;