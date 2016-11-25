var request = require('request-promise');

const URL = 'https://api.marktplaats.nl/v1/advertisements/';
const TOKEN = process.env.MP_TOKEN ? process.env.MP_TOKEN : "40909f90-6c52-413c-93a4-2d630157be83";

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
            data = JSON.parse(data);
            console.log('item published:', data.itemId);
            publishPicture(data.itemId, imageUrl).then(function(){
                console.log('before publish picture:', imageUrl, data.itemId);
                resolve(data);
            }).catch(function(e){
                console.error(e);
                reject(e);
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
            data = JSON.parse(data);
            console.log('publish picture:', data);
            resolve('OK')
        }).catch(function(e){
            console.error('publishing picture', e);
            reject(e)
        });
    });
};

module.exports = {
    publish: publish
};