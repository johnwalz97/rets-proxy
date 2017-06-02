const express = require('express');
const app = express();

require('./calls.js')(app, {});

const port = 8000;
app.listen(port, function () {
    console.log('We are live on port #' + port);
});

