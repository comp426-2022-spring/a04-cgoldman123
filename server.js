const express = require('express')
const morgan = require('morgan')
//const req = require('express/lib/request')
const app = express()
//const fs = require('fs')


var db = require("./database.js")
var md5 = require("md5")
app.use(express.urlencoded({ extended: true}));
app.use(express.json());




const args = require('minimist')(process.argv.slice(2))
// Define allowed argument name 'help'.
args["help"]





// Define allowed argument name 'port'.
args["port"]
// Define a const `port` using the argument from the command line. 
// Make this const default to port 3000 if there is no argument given for `--port`.
const port = args.port || 5555


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


// READ a list of users (HTTP method GET)
app.get("/app/log/access", (req, res) => {
  try{
    const stmt = db.prepare('SELECT * FROM accesslog').all()
    res.status(200).send(stmt)
  } catch (e) {
    console.error(e)
  }
});


app.use(function(req, res, next) {
    res.status(404).send("404 NOT FOUND")
    res.type("text/plain") 
    next() 
})
