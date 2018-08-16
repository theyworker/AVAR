const express = require("express");
var app = express();
const mysql = require('mysql')
var path = require('path')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'Candidate_App')));
var fileupload = require('express-fileupload')
app.use(fileupload())
var dateTime = require('node-datetime')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/Candidate_App/views'))



const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'basictest'
})

// Used for retrieving joblist from MYSQL db
// Stores and overrides dbjob
var dbjob = {}
function retrievejoblist () {
  con.query('SELECT * FROM joblist', (err, rows) => {
    if (err) throw err

    for (var i = 0; i < rows.length; i++) {
      dbjob[i + 1] = rows[i].job
    };
  // console.log(dbjob);
  })
};

// Initial connect to db
con.connect((err) => {
  if (err) {
    console.log('Error connecting to the database')
    return
  }
  console.log('Connected!')
})

// Redirects to pages depending on requested url
app.get('/backup', function (req, res) {
  // retrievejoblist();
  console.log(dbjob)
  res.sendFile(path.join(__dirname, '/Candidate_App/home.html'))
})

// Renders home page template with joblist from DB
app.get('/', function (req, res) {
  retrievejoblist()
  res.render('index', {job: dbjob})
})

app.get('/form1.html', function (req, res) {
  res.sendFile(path.join(__dirname, '/Candidate_App/form1.html'))
})

app.get('/cantfind', function (req, res) {
  retrievejoblist()
  res.render('cantfind', {job: dbjob})
})

app.get('/rc', function (req, res) {
  res.sendFile(path.join(__dirname, '/Web_App/login.html'))
})

app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/Web_App/managerDashboard.html'))
})

/* var jobs = {
 1:'HR Service Executive',
 2:'Assistant General Manager - Sales',
 3:'CEO-Retail',
 4:'Financial Controller',
 5:'Assistant Manager - HR & Admin',
 6:'Head of Business Process Re-Engineering'
}; */

// Gives customized template depending on job picked
app.get('/form/:id', function (req, res) {
  res.render('form', {job: dbjob[req.params.id]})
})

// Submit job application
app.post('/submit', function (req, res) {
  var fname = req.body.fname
  var email = req.body.email
  var tel = req.body.tel
  var address = req.body.address
  var curemp = req.body.curemp
  var curind = req.body.curind
  var quali = req.body.quali
  var demo = req.body.demo
  var apply = req.body.applied

  var cv = req.files.cvfile

  // Stores directory of CVs with a UUID as name in DB
  var dir = './cvs/' + guid() + '.pdf'

  cv.mv(dir, function (err) {
    if (err) {
      console.log(err)
      console.log('An error has occurred uploading your CV!')
    }
    else {
      console.log('CV has been uploaded')
    }
  })

  var dt = dateTime.create()
  var formatted = dt.format('Y-m-d')
  console.log(formatted)

  res.write('You sent the name "' + req.body.fname + '".\n')
  res.write('You sent the email "' + req.body.email + '".\n')
  console.log('This just in!!! ' + fname + ' and ' + email + ' and ' + dir)

  var sql = 'INSERT INTO candidatetest (fname, email, tel, address, curemp, curind, quali, demo, cvdir, appliedjob, submitdate)' +
  "VALUES ('" + fname + "','" + email + "','" + tel + "','" + address + "','" + curemp + "','" + curind + "','" + quali + "','" + demo + "','" + dir + "','" + apply + "','" + formatted + "')"
  con.query(sql, function (err, result) {
    if (err) throw err
    console.log('Inserted 1 record')
    res.end()
  })
})

// Generates a UUID for pdfs to store
function guid () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

// Create a job post
app.post('/create', function (req, res) {
  var job = req.body.seljob
  var industry = req.body.selind
  var lvl = req.body.sellvl
  var desc = req.body.txtdesc

  res.write('You just added the job "' + req.body.sellvl + ' ' + req.body.seljob + ' in ' + req.body.selind + '" \n')
  res.write('That was a mouthful to print!\n')
  console.log('Job created! ' + lvl + ' ' + job + ' in ' + industry + '!')

  var sql = 'INSERT INTO joblist (job, industry, level, description)' +
  "VALUES ('" + job + "','" + industry + "','" + lvl + "','" + desc + "')"
  con.query(sql, function (err, result) {
    if (err) throw err
    console.log('Inserted 1 job')
    res.end()
  })
})

app.post('/login', function (req, res) {
  var user1 = req.body.username
  var pass1 = req.body.password
	
  /*login(user1, pass1, function () {
    if (validation == true){
      console.log('Proceeding to send dashboard html')
      res.sendFile(path.join(__dirname, 'Web_App/dashboard.html'))
    }
    else {
      console.log('Sorry failed. Too bad. So sad')
    }
  })*/
  con.query('SELECT * FROM credentials WHERE username = ?',[user1], function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    // console.log('The solution is: ', results);
    if(results.length >0){
      if(results[0].password == pass1){
        /*res.send({
          "code":200,
          "success":"login sucessfull"
            });*/
        //res.sendFile(path.join(__dirname, 'Web_App/dashboard.html'))
        res.render('dashboard')
      }
      else{
        res.send({
          "code":204,
          "success":"Username and password does not match"
            });
      }
    }
    else{
      res.send({
        "code":204,
        "success":"User does not exist"
          });
    }
  }
  });
})

app.post('/search', function (req, res) {
  var stuff = req.body.searchstuff

con.query('SELECT * FROM candidatetest WHERE CONCAT(fname, email, address, quali, appliedjob) LIKE "%"?"%"',[stuff], function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
      "code":400,
      "failed":"error ocurred"
      })
    }else{
      res.send(results)
    }
  })
})

app.post('/advsearch', function (req, res) {
  var exp = req.body.exp
  var edu = req.body.edu
  var date = req.body.date
  var ind = req.body.selind
  //var pos = req.body.pos

  console.log(exp + edu + date + ind)
con.query("SELECT * FROM candidatetest WHERE demo = ? AND quali = ? AND submitdate = ? AND curind = ?",[exp, edu, date, ind], function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
      "code":400,
      "failed":"error ocurred"
      })
    }else{
      res.send(results)
    }
  })
})

app.post('/addacc', function (req, res) {
  var username = req.body.username
  var recruitername = req.body.recruitername
  var password = req.body.password

con.query('INSERT INTO credentials (username, password, recruitername) VALUES (?,?,?)',[username,password,recruitername], function (error, results) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
  })
  }else{
    if (results.affectedRows > 0){
      console.log('Inserted row')
      res.send({
          "code":200,
          "success":"Saved new row"
            });
    }else {
      console.log('Failed to insert row')
      res.send({
          "code":204,
          "failed":"Couldn't save row"
            });
    }
  }
})
})

app.listen(3000, function () {
  retrievejoblist()
})
console.log('Running at Port 3000')
