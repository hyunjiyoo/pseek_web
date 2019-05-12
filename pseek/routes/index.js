var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');

// home으로 이동
router.get('/', (req, res) => {
    // 아티스트 4명만 가져옴
    var sql = 'SELECT * FROM `user_tbl` WHERE user_id = ? OR user_id = ? OR user_id = ? OR user_id = ?';
    db().query(sql, ['goah', 'georgia', 'wassily', 'vladi'], (err, results) => {
        if(!err) {
            if(req.session.is_Logined){
                res.render("index.ejs",{
                    isLogined: req.session.is_Logined,
                    user: req.session.userId,
                    username: req.session.username,
                    userphone: req.session.userphone,
                    artistNames: results
                });
            } else {
                res.render("index.ejs",{
                    artistNames: results
                });
            }
        }
    });
});

// 마이페이지
router.get('/myPage', (req, res) => {
    /*  sql[0]: 전체 작품 조회
        sql[1]: 사용자가 픽한 작품의 장르(그룹)를 기준으로 픽한 장르의 수만큼 내림차순 정렬 -> 정렬 후 가장 많은 수의 장르를 기준으로 작품 테이블에서 데이터 조회.
        sql[2]: pick테이블에서 현재 로그인된 user_id에 해당하는 pick 작품을 art_id로 조회하여 art테이블에서 작품이미지와 타이틀 데이터 조회.
        sql[3]: pick테이블에서 현재 로그인된 user_id에 해당하는 pick 아티스트를 artist_id로 조회하여 art테이블에서 아티스트이미지와 이름 조회.
        sql[4]: user테이블에서 현재 로그인된 user_id에 해당하는 user를 art테이블에서 가져와서 작품 조회.
    */
    var sql =
        'SELECT * FROM `art_tbl`;' +
        'SELECT * FROM `art_tbl` WHERE art_genre = (SELECT art_genre FROM(SELECT COUNT(*) AS cnt, A.art_genre FROM (SELECT art_genre, user_id FROM art_tbl, pick_tbl WHERE art_tbl.art_id = pick_tbl.art_id AND user_id = ?) A GROUP BY art_genre) B ORDER BY B.cnt DESC LIMIT 1);' +
        'SELECT * FROM `art_tbl` WHERE `art_tbl`.art_id IN (SELECT `pick_tbl`.art_id FROM `pick_tbl` WHERE `pick_tbl`.user_id = ?);' +
        'SELECT * FROM `user_tbl` WHERE `user_tbl`.user_id IN (SELECT `pick_tbl`.artist_id FROM `pick_tbl` WHERE `pick_tbl`.user_id = ?); ' +
        'SELECT * FROM art_tbl WHERE art_tbl.artist_id = (SELECT user_tbl.user_id FROM user_tbl WHERE user_id = ?)';
    var loggedinId = req.session.userId;
    db().query(sql, [loggedinId, loggedinId, loggedinId, loggedinId], (err, results) => {
        res.render("myPage.ejs", {
            allArt: results[0],
            recommendArt: results[1],
            pickArt: results[2],
            pickArtist: results[3],
            myArt: results[4]
        });
    });
});


// myPage Pick Delete
// DISLIKE 버튼 눌렀을 때 pick_tbl에 데이터 DELETE
router.post('/myPage/:genre/dislike/:id', (req, res) => {
    // req.params객체로 삭제할 art_id를 가져와서 pick테이블에서 DELETE 수행.
    var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.art_id = (SELECT `art_tbl`.art_id FROM `art_tbl` WHERE `art_tbl`.art_id = ' + "'" + req.params.id + "'" + ')';
    db().query(sql, [], (err, results) => {
        console.log(req.params.id);
        if (err) throw err;
        res.redirect('/myPage');
    });
});
// DISLIKE 버튼 눌렀을 때 pick_tbl에서 픽아티스트 데이터 DELETE
router.post('/myPage/dislike/:pickuserid', (req,res) => {
    // req.params객체로 삭제할 user_id를 가져와서 pick테이블에서 DELETE 수행.
    var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.artist_id = (SELECT `user_tbl`.user_id FROM `user_tbl` WHERE `user_tbl`.user_id = ? )';
    db().query(sql, [req.params.pickuserid], (err, results) => {
        if(err) throw err;
        res.redirect('/myPage');
    });
});

// 프로필 edit
router.post('/myPage/edit', (req, res) => {
    let editProFile = req.files.editProFile;

    // 프로필 이미지 및 다른 정보 모두 변경시
    if (editProFile.name !== '') {
        // 파일객체에서 변경된 프로필이미지 가져와서 'session.userId.jpg' 파일이름으로 업로드 후 이미지 업데이트
        editProFile.mv('./public/uploads/user/'+ req.session.userId + '/profile/' + req.session.userId + '.jpg', () => {
            var sql = 'UPDATE `user_tbl` SET user_name = ?, user_tel = ?, user_imgsrc = ? WHERE user_id = ?';
            var imgsrc = '/uploads/user/' + req.session.userId + '/profile/' + req.session.userId + '.jpg';
            db().query(sql, [req.body.editProName, req.body.editProTel, imgsrc, req.session.userId], (err, results) => {
                if(err) throw err;
                // edit한 프로필 정보를 session값에 있는 프로필 정보를 변경함으로써 수정.
                req.session.username = req.body.editProName;
                req.session.userphone = req.body.editProTel;
                req.session.userImg = imgsrc;
                res.redirect('/myPage');
            });
        });
    } else {
        // 이미지 변경없이 다른 프로필 정보 변경할때
        var sql = 'UPDATE `user_tbl` SET user_name = ?, user_tel = ? WHERE user_id = ?';
        db().query(sql, [req.body.editProName, req.body.editProTel, req.session.userId], (err, results) => {
            if(err) throw err;
            // edit한 프로필 정보를 session값에 있는 프로필 정보를 변경함으로써 수정.
            req.session.username = req.body.editProName;
            req.session.userphone = req.body.editProTel;
            res.redirect('/myPage');
        });
    }
});

// 장르별 작품페이지로 이동
var artGenre = ['abstract', 'contemporary', 'modern', 'pop', 'stillLife', 'surrealism'];
for (let i = 0; i < artGenre.length; i++) {
    router.get(`/${artGenre[i]}`, (req, res) => {
        // 장르별로 art테이블 컬럼값 가져오는 쿼리문.
        var sql = 'SELECT A.*, IF(B.PICK_ID IS NULL, \'N\', \'Y\') AS LIKEYN\n' +
            'FROM ART_TBL A\n' +
            'LEFT OUTER JOIN (\n' +
            'SELECT B.*\n' +
            'FROM ART_TBL A, PICK_TBL B\n' +
            'WHERE a.ART_ID = B.ART_ID\n' +
            '\tAND B.USER_ID = ?\n' +
            ') B\n' +
            'ON A.ART_ID=B.ART_ID\n' +
            'WHERE A.ART_GENRE = ?\n' +
            ';';
        db().query(sql, [req.session.userId ,`${artGenre[i]}`], (err, results) => {
            if (!err) {
                // 작품 상세페이지에 작품리스트와 LIKE한 작품 전달.
                res.render("artwork.ejs", {
                    artwork: results
                });
            }
        });
    });
    // LIKE 버튼 눌렀을 때 pick_tbl에 데이터 INSERT
    router.post('/:genre/like/:id', (req, res) => {
        // req.params객체로 art_id를 가져와서 art테이블에서 해당 값에 대한 데이터를 pick테이블에 INSERT 수행.
        var sql = 'INSERT INTO `pick_tbl` (pick_id, user_id, art_id) VALUES (?, ?, (SELECT art_id FROM art_tbl WHERE art_id = ' + "'" + req.params.id + "'" + '))';
        db().query(sql, [null, req.session.userId], (err, results) => {
            if (err) throw err;
            res.redirect('/' + req.params.genre);
        });
    });
    // DISLIKE 버튼 눌렀을 때 pick_tbl에 데이터 DELETE
    router.post('/:genre/dislike/:id', (req, res) => {
        // req.params객체로 삭제할 art_id를 가져와서 pick테이블에서 DELETE 수행.
        var sql = 'DELETE FROM `pick_tbl` WHERE `pick_tbl`.art_id = (SELECT `art_tbl`.art_id FROM `art_tbl` WHERE `art_tbl`.art_id = ' + "'" + req.params.id + "'" + ')';
        db().query(sql, [], (err, results) => {
            if (err) throw err;
            res.redirect('/' + req.params.genre);
        });
    });
}

// museum 이동
// var museum = ['museum1', 'museum2', 'museum3'];
// for (let i = 1; i < museum.length + 1; i++) {
//     router.get(`./${museum[i]}`, (req, res) => {
//         console.log(museum[i]);
//         res.render("museum1.ejs", {});
//     });
// }
router.get('/museum1', (req, res) => {
   res.render('museum1.ejs', {});
});
router.get('/museum2', (req, res) => {
    res.render('museum2.ejs', {});
});
router.get('/museum3', (req, res) => {
    res.render('museum3.ejs', {});
});


module.exports = router;