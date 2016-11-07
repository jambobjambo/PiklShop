/**
 * Created by jamie on 07/11/2016.
 */
var express  = require('express')

var app = express();

app.get('/', function (req, res) {
    res.send('This is PIKL Server');
});

var server = app.listen(process.env.PORT || '8080', function () {
    console.log('App listening on port %s', server.address().port);
    console.log('Press Ctrl+C to quit.');
});