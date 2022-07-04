import mysql from 'mysql';

const con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'assword',
    database: 'users'
});

con.connect(undefined, err => {
    if (err) console.error(err);
});

// con.query('CREATE DATABASE users', undefined, (err, results, fields) => {
//     if(err) console.error(err);

//     console.log(results);
// });

// con.query('CREATE TABLE users(username TINYTEXT, password TINYTEXT)', undefined, (err, results, fields) => {
//     if(err) console.error(err);

//     console.log(results);
// });

// const user = [
//     ["user1", "assword1"],
//     ["user2", "assword2"],
//     ["user3", "assword3"],
//     ["user4", "assword4"],
//     ["user5", "assword5"],
// ];

// con.query(`INSERT INTO users VALUES ?`, [user], (err, results, fields) => {
//     if (err) console.error(err);

//     console.log(results);
// });

// con.query("SELECT * FROM users WHERE username REGEXP ?", ["[0-9]"], (err, results, fields) => {
//     if (err) console.error(err);

//     console.log(results);
// });


con.end();