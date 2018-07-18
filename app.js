var app = require('express')();
const mysql = require('mysql');
var path    = require("path");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
fileupload = require('express-fileupload');
app.use(fileupload());

app.set('view engine','ejs');
app.set("views", path.join(__dirname + "/Candidate_App/views"));

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'basictest'
});

//Used for retrieving joblist from MYSQL db
//Stores and overrides dbjob
var dbjob = {};
function retrievejoblist(){
  con.query('SELECT * FROM joblist', (err,rows) => {
  if(err) throw err;

  for (i=0;i<rows.length; i++){
  	dbjob[i+1]=rows[i].job;
  };
  //console.log(dbjob);
  });
};

//Initial connect to db
con.connect((err) => {
    if (err) {
  	console.log('Error connecting to the database');
  	return;
  	}
  	console.log('Connected!');
});

//Redirects to pages depending on requested url
app.get('/',function(req,res){
  //retrievejoblist();
  console.log(dbjob);
  res.sendFile(path.join(__dirname+'/Candidate_App/home.html'));
});

//Renders home page template with joblist from DB
app.get('/test',function(req,res){
	retrievejoblist();
	res.render('home',{job:dbjob});
});

app.get('/form1.html',function(req,res){
  res.sendFile(path.join(__dirname+'/Candidate_App/form1.html'));
});

app.get('/cantfind.html',function(req,res){
  res.sendFile(path.join(__dirname+'/Candidate_App/cantfind.html'));
});

/*var jobs = {
	1:'HR Service Executive',
	2:'Assistant General Manager - Sales',
	3:'CEO-Retail',
	4:'Financial Controller',
	5:'Assistant Manager - HR & Admin',
	6:'Head of Business Process Re-Engineering'
};*/

//Gives customized template depending on job picked
app.get('/form/:id', function(req,res){
	res.render('form',{job:dbjob[req.params.id]});
});

//Submit job application
app.post('/submit',function(req,res){

	var fname = req.body.fname;
	var email = req.body.email;
	var tel = req.body.tel;
	var address = req.body.address;
	var curemp = req.body.curemp;
	var curind = req.body.curind;
	var quali = req.body.quali;
	var demo = req.body.demo;

	var cv = req.files.cvfile;

	//Stores directory of CVs with a UUID as name in DB
	var dir = './cvs/'+guid()+'.pdf';

	cv.mv(dir,function(err){
        if(err){
            console.log(err);
            console.log("An error has occurred uploading your CV!");
        }
        else
        {
            console.log("CV has been uploaded");
        }
    });

	res.write('You sent the name "' + req.body.fname+'".\n');
  	res.write('You sent the email "' + req.body.email+'".\n');
	console.log('This just in!!! '+ fname + ' and ' +email+ ' and '+ dir);

	var sql = "INSERT INTO candidatetest (fname, email, tel, address, curemp, curind, quali, demo,cvdir) "
	+"VALUES ('"+fname+"','"+email+"','"+tel+"','"+address+"','"+curemp+"','"+curind+"','"+quali+"','"+demo+"','"+dir+"')";
	con.query(sql, function(err,result){
		if (err) throw err;
		console.log("Inserted 1 record");
		res.end();
	})

})

//Generates a UUID for pdfs to store
function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

app.listen(3000, function(){
	retrievejoblist();
});
console.log("Running at Port 3000");