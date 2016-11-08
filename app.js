/**
 * Created by jamie on 07/11/2016.
 */
var express  = require('express')
var request = require('request');

var vision = require('@google-cloud/vision')({
    projectId: 'piklshop-42f40',
    keyFilename: 'keyfile.json'
});
var app = express();
var img = 'http://smashinghub.com/wp-content/uploads/2012/02/Girl-in-red-dress-22.jpg';

app.get('/imagesearch', function (req, res) {
    var labelList = [];
    vision.detectLabels(img, function(err, labels, apiResponse) {
        labelList.push(labels[0])
        labelList.push(labels[1])
        labelList.push(labels[2])
        res.send(labelList)
    });
});

app.get('/productsearch', function(req,res){
    request('http://api.shopstyle.com/api/v2/products?pid=uid625-36772825-65&fts=dress+clothing+red&offset=0&limit=10', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var cleaned = body.trim();
            var clothelist = JSON.parse(cleaned);
            var jsonApp = '{ "Products":[{"name" : "' + clothelist.products[0].brandedName + '", "image" : "' + clothelist.products[0].image.sizes.Best.url + '", "price" : "' + clothelist.products[0].priceLabel + '"},' +
                    '{"name" : "' + clothelist.products[1].brandedName + '", "image" : "' + clothelist.products[1].image.sizes.Best.url + '", "price" : "' + clothelist.products[1].priceLabel + '"}]}'
            res.send(jsonApp);
        }
    })
});


var server = app.listen(process.env.PORT || '8080', function () {
    console.log('App listening on port %s', server.address().port);
    console.log('Press Ctrl+C to quit.');
});