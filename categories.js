var request = require('request-promise');

const TOKEN = "509dca04-d7b8-493c-aec7-305343fa6ecf";
const CATS_URL = "https://api.marktplaats.nl/v1/categories?access_token=API_TOKEN"
// const CATS_URL = "https://api.marktplaats.nl/v1/categories?access_token=509dca04-d7b8-493c-aec7-305343fa6ecf"

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
    console.log("Call to categories successful!", cs);
    cats = cs;
});

var getCategoryId = function(query){
    return cats.find(function(c) { return c.name === query; }, {"id": "0" }).id;
};

module.exports = {
    getCategoryId: getCategoryId
};