var mysql = require('mysql');

//establish mysql connection
var connection = mysql.createConnection({
    host     : 'localhost',
    port : '8889',
    user     : 'root',
    password : 'root',
    database : 'toxic_chemical_industry'
});

module.exports = {connection};
