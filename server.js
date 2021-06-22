require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const validate = require('url-validator');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,   })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

const port = process.env.PORT;
app.use(cors());

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlSchema = new mongoose.Schema({
  original_url: String
});
urlSchema.plugin(AutoIncrement, {inc_field: 'short_url'});
const Url = mongoose.model('Url', urlSchema);

app.post('/api/shorturl', async (req, res, next)=>{
  console.log('Post for '+req.body.url);
  var lurl = req.body.url;
  var validacion = validate(lurl);
  if (validacion === false){
    return res.json({"error":"Invalid URL"});
  };
  Url.findOne({original_url: lurl}, (err, found)=>{
    if (err) return console.log(err);
    return found;
  }).then(a =>{
    if (a===null){
      console.log('indefinido');
      var nuevaUrl = new Url({original_url: lurl});
      nuevaUrl.save((err, data)=>{
        if (err) return console.log(err);
        console.log('Guardado: '+data);
        next();
      });
    } else {
      console.log('Encontrado: '+a);
      next();
    };
  }).catch(err => {console.log(err)});
}, (req, res) => {
  Url.findOne({original_url: req.body.url}, (err, found)=>{
    if (err) return console.log(err);
    return found;
  }).then(a=>{
    res.json({'original_url': a.original_url, 'short_url': a.short_url});
  })
}
);

app.get('/api/shorturl/:ref', (req, res, next)=>{
  var ref = req.params.ref;
  console.log('Referencia de redireccion: '+ref);
  Url.findOne({short_url: ref}, (err, found)=>{
    if (err) return console.log(err);
    return found;
  }).then(a=>{
    if (a===null){
      res.json({"error":"No short URL found for the given input"})
    } else {
      console.log('Redireccionando a: '+a.original_url);
      res.redirect(301, a.original_url);
    }
  })
}
);

// LISTEN
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
