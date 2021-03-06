var request = require('request-promise');

const CATS_URL = "https://api.marktplaats.nl/v1/categories?access_token=API_TOKEN"

const TOKEN = process.env.MP_TOKEN ? process.env.MP_TOKEN : "40909f90-6c52-413c-93a4-2d630157be83";


Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

var cats = [];
var promise = new Promise(function(resolve, reject){
    var url = CATS_URL.replace(/API_TOKEN/, TOKEN);
    console.log(url);
    request(url)
        .then(function(data){
            data = JSON.parse(data);

            var cats = data._embedded["mp:category"].flatMap(function(l1cat) {
                return l1cat._embedded["mp:category"].map(function(c) {
                    return { id: c.categoryId, name: c.name };
                });
            });

            resolve(cats);
        })
        .catch(function(e){
            reject(e);
        })
});

promise.then(function(cs) {
    console.log("Call to categories successful!");
    cats = cs;
});

var getCategoryId = function(query){
    var cId = cats.find(function(c) { return c.name.toLowerCase() === query.toLowerCase(); }, {"id": "0" }).id
    console.log("Cat id is ", cId);
    return cId;
};

module.exports = {
    getCategoryId: getCategoryId
};