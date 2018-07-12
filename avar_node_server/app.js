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
  res.sendFile(path.join(__dirname+'/form2.html'));
});



app.post('/submit',function(req,res){

	var fname = req.body.fname;
	var sname = req.body.sname;
	var oname = req.body.oname;
	var email = req.body.email;
	var tel = req.body.tel;
	var address = req.body.address;

	res.write('You sent the name "' + req.body.fname+'".\n');
  	res.write('You sent the email "' + req.body.email+'".\n');
	console.log('This just in!!! '+ fname + ' and ' +email);

	var sql = "INSERT INTO candidatetest (fname, sname, oname, email, tel, address) "
	+"VALUES ('"+fname+"','"+sname+"','"+oname+"','"+email+"','"+tel+"','"+address+"')";
	con.query(sql, function(err,result){
		if (err) throw err;
		console.log("Inserted 1 record");
		res.end();
	})

})

app.listen(3000);
console.log("Running at Port 3000");