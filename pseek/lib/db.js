var mysql = require('mysql');

// 데이터베이스 연결
db_init = function () {
    const conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pisa3333",
        database: "pseekdb",
        port: 3306
    });
    return conn;
};
module.exports = db_init;