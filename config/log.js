var winston = require('winston')
module.exports = function (app) {
    app.log = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)()
        ]
    })
}