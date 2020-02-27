var http = require('http');
var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var app = express();
var path = require('path');
var bodyparser = require('body-parser');
var db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'testing'
});
app.get('/',(request, response) =>{
    response.sendFile(path.join(__dirname + '/login.html'))
});
app.use(bodyparser.urlencoded({ extended: true }));
/*var server = http.createServer(function(req , res){
    res.writeHead(200,{'Content-Type': 'text/html'});
    var myReadStream =  fs.createReadStream(__dirname + '/login.html' , 'utf8');
    myReadStream.pipe(res);
    
    console.log("sucess");
});
*/
app.post('/' , function(req , res){
    var username = req.body.username;
    var tag = req.body.tagline;
    db.connect(function(err){
        if (err) throw err;
        var sql = "INSERT INTO customers (name , surname) VALUES ?";
        
        db.query(sql ,[[[username , tag]]],function(err ,res){
            if (err) throw err;
        });
        db.on('error', function(err) {
            console.log("[mysql error]",err);
        });
    });
    console.log(username);
    console.log(tag);
    res.redirect('/');
    res.end();
});
app.listen(8080);