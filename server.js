const sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var app = express();
const Nexmo = require('nexmo');

app.set('view engine','ejs');
//create Nexmo account and get api key and api secret
const nexmo = new Nexmo({
  apiKey: YOUR_API_KEY,
  apiSecret:YOUR_API_SECRET
});

//cred
const user_Email=YOUR_EMAIL_ID;
const user_Email_Pass= YOUR_EMAIL_ID_PASSWORD;
var urlencodedParser = bodyParser.urlencoded({ extended: false })

function GetCurrentTime()
{
  let date_ob = new Date();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  var time = hours + ":" + minutes+":"+seconds;
  return time;
}

function Store_IN_DB(sql_query)
{
  let db = new sqlite3.Database('./db/ems.sqlite3', (err) => {
  if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the Database SQlite database.');
  });

  db.run(sql_query, (err) => {
  if (err) {
      return console.error(err.message);
    }
    console.log('Updated');
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

function Send_Mail(html_body,hemail)
{
  var mailOptions = {
    from: user_Email,
    to: hemail,
    subject: 'Visiter Details',
    html:html_body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user_Email,
    pass: user_Email_Pass
  }
});


app.get('/',function(req,res){
  res.render('main');
});

app.post('/exit', urlencodedParser, function (req, res) {
  console.log(req.body.vemail);
  let sql_query1='UPDATE data SET cout="'+GetCurrentTime()+'" WHERE vemail="'+req.body.vemail+'" AND vphone="'+req.body.vphone+'"';
  console.log(sql_query1);
  let sql_query2='SELECT * FROM data WHERE vemail="'+req.body.vemail+'" AND vphone="'+req.body.vphone+'"'
  console.log(sql_query2)
  //Get data
  let db = new sqlite3.Database('./db/ems.sqlite3', (err) => {
  if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the Database SQlite database.');
  });

  db.run(sql_query1, (err) => {
  if (err) {
       console.error(err.message);
    }
    console.log('Updated');
  });
    let msg='<h1> Your Visiting Details </h1><h3>';
    db.all(sql_query2, [], (err, rows) => {
      if (err) {
        throw err;
      }
      console.log("Size "+rows.length);
      if(rows.length >= 1)
      {
        var Details = rows[rows.length-1];
        msg=msg+'Name: '+Details.vname+'</h3><h3>'+'Phone: '+Details.vphone+'</h3><h3>'+'Check-in Time: '+Details.cin+'</h3><h3>'+'Check-out Time: '+Details.cout+'</h3><h3>'+'Host Name: '+Details.hname+'</h3><h3>'+'Address Visited: '+Details.address+'</h3>';
        // SEND MAIL
        Send_Mail(msg,Details.vemail);
      }
      else {
        console.log("NO USER FOUND");
      }
    });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
      console.log('Close the database connection.');
    }
  });

  res.render('main');
})

app.post('/entry', urlencodedParser, function (req, res) {
  console.log(req.body);
  //STORE IN Database
  let sql_query='INSERT INTO data(vname,vemail,vphone,hname,hemail,hphone,address,cin,cout)VALUES("'+req.body.vname+'","'+req.body.vemail+'","'+req.body.vphone+'","'+req.body.hname+'","'+req.body.hemail+'","'+req.body.hphone+'","'+req.body.address+'","'+GetCurrentTime()+'","'+GetCurrentTime()+'")';
  console.log(sql_query);
  Store_IN_DB(sql_query);
  //send sms
  let text = "New Visiter Name: "+req.body.vname+" Email: "+req.body.vemail+" Phone: "+req.body.vphone;
  mobile_number="91"+req.body.hphone;
  console.log(mobile_number);

  nexmo.message.sendSms("Nexmo",mobile_number, text, {
    type: "unicode"
    }, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]['status'] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
      }
    }
  });


  //SEND MAIL
  html_body="<h1> Visiter Details</h1><h3> Name : "+req.body.vname+"</h3><h3> Email: "+req.body.vemail+"</h3><h3> Mobile Number: "+req.body.vphone+"</h3><h3>Entry Time: "+GetCurrentTime()+"</h3>";
  Send_Mail(html_body,req.body.hemail);
  res.render('main');
});

app.listen(3000);
