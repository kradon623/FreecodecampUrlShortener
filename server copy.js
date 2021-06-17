require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.connect(process.env.MONGO_URI, {
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

app.use(express.static('public'));

app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Empieza la app
const urlSchema = new mongoose.Schema({
  original_url: String
});

var lurl = undefined;

urlSchema.plugin(AutoIncrement, {inc_field: 'short_url'});

const Url = mongoose.model('Url', urlSchema);
// try 1
const busqueda = async (ref) => {
  return await Url.findOne({original_url: ref}, (err, data)=>{
    if (err) return console.log(err);
    if (data === null){
      const lurl = undefined;
      const surl = undefined;
    } else {
      console.log('Datos devueltos: '+data);
      const lurl = data.original_url;
      const surl = data.short_url;
      console.log('Buscados: '+lurl+' y '+surl);
    }
  });
};

const guardar = async (dato) => {
  return await dato.save((err, saved) => {
    if (err) return console.log(err);
    console.log('Guardando '+dato);
    console.log('Devuelto '+saved);
  });
};

app.post('/api/shorturl', (req, res, next)=>{
  var hora = new Date();
  console.log('----------- '+hora+'----------- ');
  console.log('Post for '+req.body.url);
  busqueda(req.body.url);
  if (lurl === undefined){
    console.log('lurl indefinido');
    const nuevaUrl = new Url({ original_url: req.body.url });
    guardar(nuevaUrl);
    next();
  } else {
    console.log('lurl definido');
    next();
  };
}, (req, res)=>{
  busqueda(req.body.url);
  res.json({'original_url': lurl, 'short_url': surl});
});

// LISTEN
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

//try 2

// TO-DO Poner de forma sequencial hasta que de paso con un boolean

const busqueda = (ref) => {
  return Url.findOne({original_url: ref}, (err, data) => {
    if (err) return console.log('Error en la busqueda! '+err);
    console.log('Encontrado: '+data);
  });
};

const save = (ref) => {
  return ref.save((err, data) => {
    if (err) return console.log('Error en el guardado! '+err);
    console.log('Guardado: '+data);
  })
};

app.post('/api/shorturl', (req, res, next)=>{
  var hora = new Date();
  console.log('----------- '+hora+'----------- ');
  console.log('Post for '+req.body.url);
  busqueda(req.body.url);
    // .then((a)=>{
    //   lurl = a.original_url;
    //   surl = a.short_url;
    // })
    // .then(next())
    // .catch((err)=>{
    //   console.log(err);
    next();
    });
}, (req, res, next) => {
  if (lurl === undefined){
    var url1 = new Url({original_url: req.body.url});
    save(url1);
      // .then(next())
      // .catch((err)=>{
      //   console.log(err);
      // });
      next();
  };
  res.json({'original_url': lurl, 'short_url': surl});
}, (req, res) => {
  busqueda(req.body.url);
    // .then((a)=>{
    //   lurl = a.original_url;
    //   surl = a.short_url;
    // })
    // .catch((err)=>{
    //   console.log(err);
    // });
  res.json({'original_url': lurl, 'short_url': surl});
});

