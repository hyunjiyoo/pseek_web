var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var app = express();
var db = require('./lib/db.js');

db();

// 미들웨어 설정
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));

// 세션 미들웨어 저장
app.use(session({
    // 사용자가 js 입력못하게 보안
    HttpOnly: true,
    // https 로 접속
    secure: true,
    // 필수 옵션으로 secret 키 지정
    secret: 'asdfafsa!!dfgasg@#$fdg',
    // 세션데이터값 바뀌기 전까지는 세션저장소값에 저장암함.
    resave: false,
    // 세션필요하기전까지 세션구동 안하게 설정
    saveUninitialized: true,
    // 파일에 세션정보 저장
    store: new FileStore()
}));

app.use(function(req, res, next) {
    res.locals.user = req.session.userId;
    res.locals.username = req.session.username;
    res.locals.isLogined = req.session.is_Logined;
    res.locals.userphone = req.session.userphone;
    res.locals.userImg = req.session.userImg;
    res.locals.userpick = {};
    res.locals.existId = null;
    next();
});
app.use('/', require("./routes/home"));
app.use('/user', require("./routes/user"));

app.listen(30000, () => {
    console.log('server running at http://pseek.iptime.org:30001');
});