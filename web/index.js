const express = require('express');
var app = express();

app.get('/', function(req, res){
   res.send("Hi world!");
});

app.listen(8001);