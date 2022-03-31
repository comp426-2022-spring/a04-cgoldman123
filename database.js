const Database = require('sqlite3')

const da = "nothting"
const db = new Database.Database('log.db')


const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and 'access'`)
let row =  stmt.get()
// testing autograder 
if (row === undefined) {
    console.log('log database is missing. Creating log database.')
    const sqlInit = `
        CREATE TABLE accesslog ( remoteaddr NUMERIC PRIMARY KEY, remoteuser TEXT, time NUMERIC, method VARCHAR, url NUMERIC, protocol TEXT, httpversion NUMERIC, secure NUMERIC, status INTEGER, referer NUMERIC, useragent NUMERIC)
        `
    logdb.exec(sqlInit)
} else {
    console.log('Log database exists')
}

module.exports = db