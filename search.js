var request = require('request-promise');

const TOKEN = "40909f90-6c52-413c-93a4-2d630157be83";
const LIMIT = 3;
const SEARCH_URL = "https://api.marktplaats.nl/v1/search?query=QUERY&access_token=API_TOKEN&_prettyprint&limit=LIMIT&offset=OFFSET&postCode=FILTER_POSTCODE&distance=3000CAT_ID"
const MP_SEARCH_URL = "http://www.marktplaats.nl/z/auto-s/renault/rood.html?query=QUERYCAT_ID";

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
                        url: MP_SEARCH_URL.replace(/QUERY/, query).replace(/CAT_ID/, catId),
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