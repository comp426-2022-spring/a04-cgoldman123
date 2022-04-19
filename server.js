const args = require('minimist')(process.argv.slice(2))
// Define allowed argument name 'help'.
if (args.help === true) {
  console.log('(--help).*(Return this message and exit.)')
  process.exit(0)
}

const fs = require('fs')
const morgan = require('morgan')

const express = require('express')

const app = express()

// const cors = require('cors');
// app.use(cors())


var db = require("./database.js")
app.use(express.urlencoded({ extended: true}));
app.use(express.json());


if (args.log == "false") {
    console.log("not creating it")
} else{
    const accessLog = fs.createWriteStream('access.log', { flags: 'a' })
    app.use(morgan('combined', { stream: accessLog }))
}

// Always log to database
app.use((req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referrer: req.headers['referer'],
        useragent: req.headers['user-agent']
    };
    console.log(logdata)
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referrer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referrer, logdata.useragent)
    console.log(info)
    next();
})



// Define allowed argument name 'port'.

// Define a const `port` using the argument from the command line. 
// Make this const default to port 3000 if there is no argument given for `--port`.
const port = args.port || process.env.PORT || 5555


// let logging = morgan('combined')
// app.use(logging('common'))


const server = app.listen(port, () => {
    console.log(`App is running on port ${port}`)
});

// look at express.js example online
app.get('/app', (req, res)  => {
    res.json({"message":"Your API works! (200)"});
    res.status(200);
});


if (args.debug) {
    app.get("app/log/access",(req, res) => {
        const stmt = db.prepare('SELECT * FROM accesslog').all()
        res.status(200).send(stmt)
    })
    app.get("app/error", (req, res) => {
        // res.status(500).send("500 Internal Server Error")
        throw new Error('Error test works')
    }) 
}

app.use(function(req, res, next) {
    res.status(404).send("404 NOT FOUND")
    res.type("text/plain") 
    next() 
})

