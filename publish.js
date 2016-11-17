var request = require('request-promise');

const URL = 'https://api.marktplaats.nl/v1/advertisements/';
const TOKEN = '509dca04-d7b8-493c-aec7-305343fa6ecf';

var publish = function(title, description, imageUrl, price, categoryId){
    return new Promise(function(resolve, reject){
        request({
            method: 'POST',
            url: URL,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+ TOKEN
            },
            body: JSON.stringify({
                "description": description,
                "title": title,
                "categoryId": categoryId || 2,
                "location": {
                    "postcode": "1097DN"
                },
                "priceModel" : {
                    "modelType" : "fixed",
                    "askingPrice" : parseInt(price, 10)*100
                }
            })
        }).then(function(data){
            publishPicture(data.itemId, imageUrl).then(function(){
                console.log('publish picture:', imageUrl, data.itemId);
                resolve(data);
            });
        }).catch(function(e){
            console.log('something went wrong', e);
            reject(e);
        });
    });
};

var publishPicture = function(id, imageUrl){
    return new Promise(function(resolve, reject){
        request({
            method: 'POST',
            url: 'https://api.marktplaats.nl/v1/advertisements/'+id+'/images',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer '+ TOKEN
            },
            body: JSON.stringify({
               "urls": [ imageUrl ],
                "replaceAll": true
            })
        }).then(function(data){
            resolve('OK')
        }).catch(function(e){
            reject(e)
        });
    });
};

module.exports = {
    publish: publish
};