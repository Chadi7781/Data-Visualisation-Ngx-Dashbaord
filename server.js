const express=  require('express');
const bodyParser = require('body-parser');


// initialize our express app
const app = express();

const cors = require("cors");

//setting up mongoose connection
const  mongoose = require('mongoose');
let dev_db_url = 'mongodb://localhost:27017/mydb';
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const  db =  mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
const rapport = require('./api/routes/rapportRoutes');
app.use(cors())


app.use('/rapport',rapport);
let port = 3000;

app.listen(port,() => {
  console.log("Server is up and running on port number "+port);
});
