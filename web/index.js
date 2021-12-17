const express = require('express');

const mongoose = require('mongoose');

const bp = require('body-parser');

const app = express();

app.use(bp.json())
app.use(bp.urlencoded({extendedparser: true}));

mongoose.connect("mongodb://127.0.0.1:27017/");

app.get('/', function(req, res){
   res.json({'message' : "Hi world!"});
});

let presentationsRouter = require('./routes/presentationsRoutes')();

app.use('/api', presentationsRouter);

app.listen(8001, () => console.log('listening on port 8001'));
