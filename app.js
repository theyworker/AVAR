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
var session = require('client-sessions');
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

//Session Handler Middleware
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 60 * 60 * 1000,
  activeDuration: 10 * 60 * 1000,
  httpOnly: true,
  ephemeral: true
}));

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

app.get('/logout', function (req, res) {
  req.session.reset();
  res.redirect('/rc');
})


app.get('/dashboard', function (req, res) {
  if (req.session && req.session.user) { // Check if session exists
    // lookup the user in the DB by pulling their email from the session
    con.query('SELECT * FROM credentials WHERE username = ?',[req.session.user], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
        if (results.length == 0) {
          // if the user isn't found in the DB, reset the session info and
          // redirect the user to the login page
          req.session.reset();
          res.redirect('/rc');
        } else {
          // render the dashboard page
          var cv = 0
          var cvmonth = 0
          var cvyear = 0
          var available = 0

          var datemonth = dateTime.create()
          datemonth.offsetInDays(-31)
          var formatted = datemonth.format('Y-m-d')
          var dateyear = dateTime.create()
          dateyear.offsetInDays(-365)
          var formatted2 = dateyear.format('Y-m-d')

          //Gets list of all total cvs
          con.query('SELECT * FROM candidatetest', function (error, results) {
            if (error) {
              console.log("error occurred", error)
            }
            cv = results.length

            //Gets list of all cvs in a month
            con.query('SELECT * FROM candidatetest WHERE DATE(submitdate) >= ?',[formatted], function (error, results) {
              if (error) {
                console.log("error occurred", error)
              }
              cvmonth = results.length

              //Gets list of all cvs in a year
              con.query('SELECT * FROM candidatetest WHERE DATE(submitdate) >= ?',[formatted2], function (error, results) {
                if (error) {
                  console.log("error occurred", error)
                }
                cvyear = results.length

                //Gets list of all jobs
                con.query('SELECT * FROM joblist', function (error, results) {
                  if (error) {
                    console.log("error occurred", error)
                  }
                  available = results.length
                  
                  //RENDERS THE RECRUTIER PAGE
                  res.render('dashboard', {allcv: cv, monthcv: cvmonth, yearcv: cvyear, joblist: available})
                })
              })
            })
          })
        }
      }
    })//End of first con query
  }
    else {
      res.redirect('/rc');
    }
})


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
        var type = results[0].usertype

        var cv = 0
        var cvmonth = 0
        var cvyear = 0
        var available = 0

        var datemonth = dateTime.create()
        datemonth.offsetInDays(-31)
        var formatted = datemonth.format('Y-m-d')
        var dateyear = dateTime.create()
        dateyear.offsetInDays(-365)
        var formatted2 = dateyear.format('Y-m-d')

        var currenttime = dateTime.create()
        var formatted3 = currenttime.format('Y-m-d H:M:S')

        //Sets cookie with user
        req.session.user = user1;

        //Gets list of all total cvs
        con.query('SELECT * FROM candidatetest', function (error, results) {
          if (error) {
            console.log("error occurred", error)
          }
          cv = results.length

          //Gets list of all cvs in a month
          con.query('SELECT * FROM candidatetest WHERE DATE(submitdate) >= ?',[formatted], function (error, results) {
            if (error) {
              console.log("error occurred", error)
            }
            cvmonth = results.length

            //Gets list of all cvs in a year
            con.query('SELECT * FROM candidatetest WHERE DATE(submitdate) >= ?',[formatted2], function (error, results) {
              if (error) {
                console.log("error occurred", error)
              }
              cvyear = results.length

              //Gets list of all jobs
              con.query('SELECT * FROM joblist', function (error, results) {
                if (error) {
                  console.log("error occurred", error)
                }
                available = results.length

                con.query('UPDATE credentials SET lastlogin = ? WHERE username = ?',[formatted3,user1], function (error, results) {
                  if (error) {
                  console.log("error occurred", error)
                  }
                  if(type == 'rct'){
                    //RENDERS THE RECRUTIER PAGE
                    res.redirect('/dashboard') 
                  }
                  else if(type == 'mng'){
                    //RENDERS THE MANAGER PAGE
                    res.render('managerDashboard', {allcv: cv, monthcv: cvmonth, yearcv: cvyear, joblist: available})
                  }
                  else{
                    res.send({
                    "code":401,
                    "success":"This account is not valid"
                    });
                  }
                })
              })
            })
          })
        })
      }
      else{
        req.session.reset();
        res.send({
          "code":204,
          "success":"Username and password does not match"
            });
      }
    }
    else{
      req.session.reset();
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

con.query('INSERT INTO credentials (username, password, recruitername, usertype) VALUES (?,?,?,"rct")',[username,password,recruitername], function (error, results) {
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
