var request = require('request-promise');

const TOKEN = "509dca04-d7b8-493c-aec7-305343fa6ecf";
const LIMIT = 3;
const SEARCH_URL = "https://api.marktplaats.nl/v1/search?query=QUERY&access_token=API_TOKEN&_prettyprint&limit=LIMIT&offset=OFFSET&postCode=FILTER_POSTCODE&distance=3000CAT_ID"

var search = function(query, categoryId, page, postcode){
    var offset = (page || 0) * LIMIT;

    return new Promise(function(resolve, reject){
        var catId = categoryId ? '&categoryId=' + categoryId : '';

        if(!query){
            reject('no query term provided!');
        } else {
            var url = SEARCH_URL.replace(/CAT_ID/, catId).replace(/API_TOKEN/, TOKEN).replace(/QUERY/, query).replace(/OFFSET/, offset).replace(/LIMIT/, LIMIT).replace(/FILTER_POSTCODE/, postcode || '')
            console.log(url);
            request(url)
                .then(function(data){
                    data = JSON.parse(data);
                    resolve({
                        totalResults: data.totalCount,
                        url: url,
                        results: data._embedded["mp:search-result"].map(function(result){
                            return {
                                link: 'http://link.marktplaats.nl/' + result.itemId,
                                image: result._embedded["mp:advertisement-image"].medium.href,
                                title: result.title,
                                description: result.description,
                                //sellerName: result.seller ? result.seller.sellerName : '????',
                                location: result.location ? result.location.cityName : '',
                                price: result.priceModel ? result.priceModel.askingPrice : 0,
                                id: result.itemId,
                                categoryId: result.categoryId
                            }
                        })
                    });
                })
                .catch(function(e){
                    reject(e);
                })
        }
    });
};

module.exports = {
    search: search
}