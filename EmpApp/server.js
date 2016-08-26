// including required packages 
const bodyParser = require('body-parser')
const express = require('express')  
const mongoose = require('mongoose')
// creating Express instance (all routing and middleware logic can be handled with this)
const app = express()  
const port = 3000
// Mongoose configuration to handle callbacks
mongoose.Promise = global.Promise;
// MongoDB connection string 
mongoose.connect('mongodb://localhost/demo')
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));
// Database schema for employee (will be stored in this format & backend data validation can be done here before inserting the data )
var userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  cid: String,
  updated_at: { type: Date, default: Date.now },
});
// Database schema for company (will be stored in this format & backend data validation can be done here before inserting the data )
var companySchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  updated_at: { type: Date, default: Date.now },
});
// Creating a data model for employees all communication to DB will be done through this object
var User = mongoose.model('User', userSchema);
// Creating a data model for companies all communication to DB will be done through this object
var Company = mongoose.model('Company', companySchema);
// Instructing Express to get the data send by the user (in form data format)
app.use(bodyParser.urlencoded({ extended: false }))
// Instructing Express to get the data send by the user (in json format)
app.use(bodyParser.json());
// Instructing Express display html files
app.use(express.static(__dirname + '/public'));
// employees API's
// get a particular employee with id
app.get('/user/:id', function(request, response) {
	User.findById(request.params.id,function (err, users) {
		if (err) return;
		response.json(users);
	});
});
// update a particular employee with id 
app.put('/user/:id', function(request, response) {
	User.findByIdAndUpdate(request.params.id, request.body, function (err) {
		if (err) return;
		response.end()
	});
});
// delete a particular employee with id
app.delete('/user/:id', function(request, response) {
	User.findByIdAndRemove(request.params.id,function (err) {
		if (err) return;
		response.end();
	});
});
// get all employees of a company with cid
app.get('/users/:cid',function (request, response) {  
	console.log(request.params.cid);
	User.find({"cid":request.params.cid},function (err, users) {
		if (err) return;
		response.json(users);
	});
})
// create a new employee 
app.post('/user', function (request, response) {  
	console.log(request.body);
	User.create(request.body, function (err, post) {  //{name:user_name}
		if (err) return;
		response.end();
	 });
})
// Company API's
// get a particular company with id
app.get('/company/:id', function(request, response) {
	Company.findById(request.params.id,function (err, users) {
		if (err) return;
		response.json(users);
	});
});
// update a particular company with id
app.put('/company/:id', function(request, response) {
	Company.findByIdAndUpdate(request.params.id, request.body, function (err) {
		if (err) return;
		response.end()
	});
});
// delete a particular company with id
app.delete('/company/:cid', function(request, response) {
	Company.findByIdAndRemove(request.params.cid,function (err) {
		if (err) return;
		User.remove({"cid":request.params.cid},function (err) {
			if (err) return;
			response.end();
		});
	});
});
// get all companies detail
app.get('/companies', function (request, response) {  
	Company.find(function (err, users) {
		if (err) return;
		response.json(users);
	});
})
// create a new company 
app.post('/company', function (request, response) {  
	console.log(request.body);
	Company.create(request.body, function (err, post) {  //{name:user_name}
		if (err) return;
		response.end();
	 });
})
// start listening for request
app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})