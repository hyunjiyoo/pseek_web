var express = require('express');
var router = express.Router();

// mAbstract 이동
router.get('/', (req, res) => {
    res.render("mAbstract.ejs",{});
});

module.exports = router;