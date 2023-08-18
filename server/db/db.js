const sqlite3 = require('sqlite3').verbose();
const dbConfig = require('./database-config');

// Open database connection
let db = new sqlite3.Database(dbConfig.dbPath, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const getDb = () => db;

// Close the database connection when the node process is terminated
const closeDb = () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Closed the database connection.');
        }
    });
};

module.exports = {
    getDb,
    closeDb
};
