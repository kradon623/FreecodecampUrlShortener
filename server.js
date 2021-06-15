require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const db = require('mongoose');
db.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,   })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));


// Basic Configuration
const port = process.env.PORT;
app.use(cors());

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Empieza la app

app.post('/api/shorturl', (err, req, res)=>{
  console.log(req.body);
  // var lurl = req.body.url;
});

app.get('/api/shorturl', (req, res)=>{
  if (lurl === undefined){
    var lurl = 'test'; 
  };
  res.json({'original_url': lurl, 'short_url': 'test'});
});

// LISTEN
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
