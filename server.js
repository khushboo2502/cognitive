const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const moment = require('moment')
var cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Server Connection
const port = process.env.PORT || '8080'
app.set('port', port)
const server = http.createServer(app)
console.log('NODE TIME ===> ' + moment(new Date()).format("YYYY-MM-DD HH:mm:ss"))
server.listen(port, () => console.log(`API running on localhost:${port}`))

app.use(express.static(path.join(__dirname, 'build')));	

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))				
})

