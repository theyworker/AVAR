var app = require('express')();
const mysql = require('mysql');
var path    = require("path");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'basictest'
});

con.connect((err) => {
    if (err) {
  	console.log('Error connecting to the database');
  	return;
  	}
  	console.log('Connected!');
});


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/Candidate_App/home.html'));
});

app.get('/form1.html',function(req,res){
  res.sendFile(path.join(__dirname+'/Candidate_App/form1.html'));
});

app.post('/submit',function(req,res){

	var fname = req.body.fname;
	var email = req.body.email;
	var tel = req.body.tel;
	var address = req.body.address;
	var curemp = req.body.curemp;
	var curind = req.body.curind;
	var quali = req.body.quali;
	var demo = req.body.demo;

	res.write('You sent the name "' + req.body.fname+'".\n');
  	res.write('You sent the email "' + req.body.email+'".\n');
	console.log('This just in!!! '+ fname + ' and ' +email);

	var sql = "INSERT INTO candidatetest (fname, email, tel, address, curemp, curind, quali, demo) "
	+"VALUES ('"+fname+"','"+email+"','"+tel+"','"+address+"','"+curemp+"','"+curind+"','"+quali+"','"+demo+"')";
	con.query(sql, function(err,result){
		if (err) throw err;
		console.log("Inserted 1 record");
		res.end();
	})

})

app.listen(3000);
console.log("Running at Port 3000");