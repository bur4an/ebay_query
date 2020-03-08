var request = require('request-promise')

var headers = {
 'content-type': 'application/json',
 'X-EBAY-SOA-GLOBAL-ID': 'EBAY-AU',
 'X-EBAY-SOA-OPERATION-NAME': 'findItemsByKeywords',
 'X-EBAY-SOA-RESPONSE-DATA-FORMAT': 'JSON',
 'X-EBAY-SOA-SECURITY-APPNAME': 'burhanKa-fc97-4f81-a2c4-6cac46e69c76',
}

 request({
     uri: 'https://svcs.ebay.com/services/search/FindingService/v1?keywords="iphone"',
     headers: headers
 } ).then(
     res => {
        res = JSON.parse(res)
        res = res["findItemsByKeywordsResponse"].pop()
        res = res["searchResult"].pop()
        console.log(res.item[0])
        
    }
 )

