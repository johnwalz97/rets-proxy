module.exports = function (app, db) {
    var url = 'http://hc.rets.selpwa-2:lubra-haired34@retsgw.flexmls.com/rets2_3/Search?SearchType=Property&Class=A&QueryType=DMQL2&Query=*&Count=1&Format=STANDARD-XML&StandardNames=0&RestrictedIndicator=****&Limit=10';
    app.get('/listings', function (req, res) {
        var request = require('request');

        request
        ({
                url: url
            },
            function (error, response, body) {
                res.json(body)
            });
    })
    ;
};

