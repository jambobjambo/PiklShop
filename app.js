/**
 * Created by jamie on 07/11/2016.
 */
var express  = require('express');
var request = require('request');

var vision = require('@google-cloud/vision')({
    projectId: 'piklshop-42f40',
    keyFilename: 'keyfile.json'
});
var app = express();

app.get('/imageLoad', function (req,res){
    var ImageURL = req.query['imagename'];
    var ImageCode = req.query['code'];
    //res.set('Content-Type', 'HTML');
    console.log(ImageURL)
    res.send("<img src='https://firebasestorage.googleapis.com/v0/b/piklshop-42f40.appspot.com/o/images%2F" + ImageURL + "?alt=media&token=" + ImageCode + "' />");
});

app.get('/imagesearch', function (req, res) {
    var ImageURL = req.query['imagename'];
    var ImageCode = req.query['code'];
    var labelList = [];
    vision.detectLabels('http://piklshop-42f40.appspot.com/imageLoad?imagename=' + ImageURL + '&code=' + ImageCode, function(err, labels, apiResponse) {
        labelList.push(labels[0]);
        labelList.push(labels[1]);
        labelList.push(labels[2]);
        res.send(labelList)
    });
});

app.get('/productsearch', function(req,res){
    var ImageURL = req.query['imagename'];
    var ImageCode = req.query['code'];
    request('http://piklshop-42f40.appspot.com/imagesearch?image=' + ImageURL + '&code=' + ImageCode, function (error, response, body) {
        var SearchArray = JSON.parse(body);
        request('http://api.shopstyle.com/api/v2/products?pid=uid625-36772825-65&fts=' + SearchArray[0] + '+' + SearchArray[1] + '+' + SearchArray[2] + '&offset=0&limit=10', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var cleaned = body.trim();
                var clothelist = JSON.parse(cleaned);
                var jsonApp = '{ "Products":[{"name" : "' + clothelist.products[0].brandedName + '", "image" : "' + clothelist.products[0].image.sizes.Best.url + '", "price" : "' + clothelist.products[0].priceLabel + '"},' +
                    '{"name" : "' + clothelist.products[1].brandedName + '", "image" : "' + clothelist.products[1].image.sizes.Best.url + '", "price" : "' + clothelist.products[1].priceLabel + '"},' +
                    '{"name" : "' + clothelist.products[2].brandedName + '", "image" : "' + clothelist.products[2].image.sizes.Best.url + '", "price" : "' + clothelist.products[2].priceLabel + '"},'+
                    '{"name" : "' + clothelist.products[3].brandedName + '", "image" : "' + clothelist.products[3].image.sizes.Best.url + '", "price" : "' + clothelist.products[3].priceLabel + '"},'+
                    '{"name" : "' + clothelist.products[4].brandedName + '", "image" : "' + clothelist.products[4].image.sizes.Best.url + '", "price" : "' + clothelist.products[4].priceLabel + '"},'+
                    '{"name" : "' + clothelist.products[5].brandedName + '", "image" : "' + clothelist.products[5].image.sizes.Best.url + '", "price" : "' + clothelist.products[5].priceLabel + '"},'+
                    '{"name" : "' + clothelist.products[6].brandedName + '", "image" : "' + clothelist.products[6].image.sizes.Best.url + '", "price" : "' + clothelist.products[6].priceLabel + '"},'+
                    '{"name" : "' + clothelist.products[7].brandedName + '", "image" : "' + clothelist.products[7].image.sizes.Best.url + '", "price" : "' + clothelist.products[7].priceLabel + '"},'+
                    '{"name" : "' + clothelist.products[8].brandedName + '", "image" : "' + clothelist.products[8].image.sizes.Best.url + '", "price" : "' + clothelist.products[8].priceLabel + '"},'+
                    '{"name" : "' + clothelist.products[9].brandedName + '", "image" : "' + clothelist.products[9].image.sizes.Best.url + '", "price" : "' + clothelist.products[9].priceLabel + '"}'+
                    ']}';
                res.send(jsonApp);
            }
        })
    })
});


var server = app.listen(process.env.PORT || '8080', function () {
    console.log('App listening on port %s', server.address().port);
    console.log('Press Ctrl+C to quit.');
});