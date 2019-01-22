// var passport = require('passport');
// var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../lib/db.js');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        console.log(user);
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        let sql = "SELECT * FROM `usertbl` WHERE id = " + id;
        db().query(sql, function (err, results) {
            done(err, results[0]);
        });
    });

    // 가입화면
    passport.use('signUp', new LocalStrategy(
        {
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        (req, username, password, done) => {
            // usertbl에서 userId 검색
            let sql = "SELECT userId FROM `usertbl` WHERE userId = '" + userId + "' ";
            db().query(sql, (err, results) => {
                console.log(results);
                if (err)
                    return done(err);
                // userId 있으면
                if (results.length) {
                    return done(null, false, req.flash('signUp Message', 'That ID is already taken.'));
                } else {
                    // userId 없으면
                    var newUser = new Object();
                    newUser.username = username;
                    newUser.password = password;

                    var insertSql = "INSERT INTO `usertbl` (userName, userPwd) values (?,?)";
                    console.log(insertSql);
                    db().query(insertSql, [username, password], (err, results) => {
                        newUser.id = results.insertId;
                        return done(null, newUser);
                    });
                }
            });
            // db().end();
        }
    ));

    // 로그인화면
    passport.use('local-login', new LocalStrategy(
        {
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        (req, username, password, done) => {
            let sql = "SELECT userId FROM `usertbl` WHERE userId = '" + username + "'"
            db().query(sql, (err, results) => {
                // 에러나면
                if (err)
                    return done(err);
                // ID 없으면
                if (!results.length)
                    return done(null, false, req.flash('Login Message', 'No user found.'));
                // ID는 맞고, 패스워드 틀리면,
                if (!( results[0].password === password))
                    return done(null, false, req.flash('Login Message', 'Wrong password.'));
                // 모두 맞으면
                return done(null, results[0]);
            });
        }
    ));
};
