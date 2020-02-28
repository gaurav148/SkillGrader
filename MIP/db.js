var http = require('http');
var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var app = express();
var session = require('express-session'); 
var path = require('path');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var js_alert = require("js-alert");


var db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'testing'
});


app.get('/',(request, response) =>{
    response.sendFile(path.join(__dirname + '/test.html'));
    
    
});
app.use(express.urlencoded({ extended: false  }));
app.use(express.json());

app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true,
   
 }));

 app.use(express.static(__dirname+'/public'));

    

app.post('/',function(req,res){
   //login
   var username2 = req.body.username2;
   var password2 = req.body.password2;
   var username1 = req.body.username1;
   var password1 = req.body.password1;
   var username3 = req.body.username3;
   var password3 = req.body.password3;
   var stu_email = req.body.stuemail;
   var stu_name = req.body.stuname;
   var teaemail = req.body.teaemail;
   var teaname = req.body.teaname;
   var domain = req.body.domain;
   var quali = req.body.quali;
   var role = req.body.role;
   
if(username1){
   
   db.query("SELECT * FROM login_student",(err,results1,fields)=>{
   var c = 0;
      for(i=0;i<results1.length;i++){
         if(username1 == results1[i].username){
            js_alert.alert("username already exists in student");
            c = 1;
            break;
         }
      }
      if(c==0){
         
            bcrypt.hash(password1, saltRounds, function(err, hash) {
               var student_data = {
                  "name" : stu_name,
                  "username" : username1,
                  "password" : hash,
                  "email" : stu_email
               };
               db.query('INSERT INTO login_student SET ?',student_data,(err,results,fields)=>{
               if(err) throw err;
            });
            res.redirect('/')
            console.log("student2 added");
         }); 
         }
         else{
            res.send("unique nahi ahe");
            console.log("username unique nahi ahe")
         }
      
      
   });

   

   }
   else if(username2){
//teacher
      db.query("SELECT username FROM login_teacher",(err , results1, fields)=>{
         //console.log(results1);
         
         for(i=0;i<results1.length;i++){
            //console.log(results1[i].username);
            
            if(username2==results1[i].username){
               
               db.query("SELECT password FROM login_teacher",(err , results2, fields)=>{
                  
                  for(j=0;j<results2.length;j++){
                     //console.log(results2[j].password);
               bcrypt.compare(password2, results2[j].password, function(err, result) {
                  //console.log(result);
                  if(result == true){
                     //console.log("success login");
                     req.session.tea_login = true;
                     //res.redirect('/home');
                     
                     if(req.session.tea_login){
                        console.log("0")
                        res.redirect('\home');
                     }
                     
                  }
              
            });
         }
      });
   }
   else{
      console.log("wrong");
      
   }
}
});



//student
   if(!(req.session.tea_login)){
      console.log("1")
   db.query("SELECT username FROM login_student",(err , results1, fields)=>{
   console.log(username2);
   
   for(i=0;i<results1.length;i++){
      console.log(results1[i].username);
      
      if(username2==results1[i].username){
         console.log("pass1");
         db.query("SELECT password FROM login_student",(err , results2, fields)=>{
            
            for(j=0;j<results2.length;j++){
               //console.log(results2[j].password);
      bcrypt.compare(password2, results2[j].password, function(err, result) {
            //console.log(result);
            if(result == true){
               console.log("pass2");
               //console.log("success login");
               req.session.stu_login = true;
               //res.redirect('/home');
               if(req.session.stu_login = true){
                  console.log(2);
                  res.redirect('\home');
               }
            }
            
      });
   }
});
}
else{
console.log("wrong");

}
}
});
}

   }
   else if(username3){
      db.query("SELECT * FROM login_teacher",(err,results2,fields)=>{
         var d=0;
         for(i=0;i<results2.length;i++){
            if(username1 == results2[i].username){
               js_alert.alert("username already exists in teacher");
               d=1;
               break;
            }
         }
         if(d==0){
            bcrypt.hash(password3, saltRounds, function(err, hash) {
               var teacher_data = {
                  "username" : username3,
                  "password" : hash,
                  "domain" : domain,
                  "qualification" : quali
               };
            db.query('INSERT INTO login_teacher SET ?',teacher_data,(err,results,fields)=>{
               if(err) throw err;
            });
            res.redirect('/')
            console.log("teacher added")
         });
         }
         else{
            res.send("unique nahi ahe");
            console.log("username unique nahi ahe")
         }
            
         
      });

      
   }

});


app.get('/home',(req,res)=>{
   console.log(req.session.stu_login);
   console.log(req.session.tea_login);
   if(req.session.tea_login){
      res.sendFile(path.join(__dirname + '/index.html'));
      //req.session.tea_login = false;
   }
   else if(req.session.stu_login){
      res.sendFile(path.join(__dirname + '/index.html'));
      //req.session.stu_login = false;

   }
   else{
      res.send("404 not found");
   }
});

app.listen(3000);


