const clientSettings = {
    loginUrl: 'http://retsgw.flexmls.com:80/rets2_3/Login',
    username: 'hc.rets.selpwa-2',
    password: 'lubra-haired34',
    version: 'RETS/1.7.2',
    userAgent: 'RETS node-client/4.x',
    method: 'GET'
};

function outputFields(obj, opts) {
    if (!obj) {
        console.log("      "+JSON.stringify(obj))
    } else {
        if (!opts) opts = {};

        var excludeFields;
        var loopFields;
        if (opts.exclude) {
            excludeFields = opts.exclude;
            loopFields = Object.keys(obj);
        } else if (opts.fields) {
            loopFields = opts.fields;
            excludeFields = [];
        } else {
            loopFields = Object.keys(obj);
            excludeFields = [];
        }
        for (var i = 0; i < loopFields.length; i++) {
            if (excludeFields.indexOf(loopFields[i]) != -1) {
                continue;
            }
            if (typeof(obj[loopFields[i]]) == 'object') {
                console.log("      " + loopFields[i] + ": " + JSON.stringify(obj[loopFields[i]], null, 2).replace(/\n/g, '\n      '));
            } else {
                console.log("      " + loopFields[i] + ": " + JSON.stringify(obj[loopFields[i]]));
            }
        }
    }
    console.log("");
}

module.exports = function (app, db) {
    app.get('/listings', function (req, res) {
        var rets = require('rets-client');

        rets.getAutoLogoutClient(clientSettings, function (client) {
            console.log(client);
            res.json(client);
        });
    })
    ;
};

