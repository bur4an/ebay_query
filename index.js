var request = require('request-promise')
var fs = require('fs')

const appId = ''
const keywords = "logitech"
var findHeaders = {
    "X-EBAY-SOA-OPERATION-NAME": "findItemsByKeywords",
    "X-EBAY-SOA-SERVICE-VERSION": "1.0.0",
    "X-EBAY-SOA-GLOBAL-ID": "EBAY-AU",
    "X-EBAY-SOA-SECURITY-APPNAME": appId,
    "X-EBAY-SOA-RESPONSE-DATA-FORMAT": "JSON",
    "X-EBAY-SOA-REQUEST-DATA-FORMAT": "JSON"
    }
var findFilters = [
    {name: 'Condition', value: 'New'},
    {name: 'ListingType', value: 'FixedPrice'},
    {name: 'LocatedIn', value: 'AU'},
    {name: 'MaxPrice', value: 80},
    {name: 'HideDuplicateItems', value: true}
    ]
        
request({
    method: 'POST',
    url: "https://svcs.ebay.com/services/search/FindingService/v1",     
    headers: findHeaders,
    body: JSON.stringify({
        keywords: keywords,
        itemFilter: findFilters,
        sortOrder: 'WatchCountDecreaseSort',
        paginationInput: {
            pageNumber: 1,
            //entriesPerPage: 1
        }
    })
})
.then(res => {
    res = JSON.parse(res).findItemsByKeywordsResponse[0]
    if(res["ack"] == "Success" ){
        var items = res["searchResult"][0]["item"]
        items.forEach(item => {
            request(`https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=${appId}&siteid=15&version=967&IncludeSelector=Details,ShippingCosts&ItemID=${item.itemId}`)
            .then(detail => {
                Item = JSON.parse(detail).Item
                //console.log(Item)
                var data = `"${Item.ViewItemURLForNaturalSearch}","${Item.QuantitySold}","${Item.CurrentPrice.Value}","${Item.ShippingCostSummary.ShippingServiceCost.Value}"\n`;
                fs.appendFile('data.csv', data, function (err) {
                    if (err) throw err;
                  })
            })
        })
    }
})
.catch(err => console.log(err))
    