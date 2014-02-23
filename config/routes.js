var controllers = {}
    , fs = require('fs')

module.exports = function (app, config, passport) {
    var controllersPath = config.root + '/app/controllers/';
    fs.readdirSync(controllersPath).forEach(function (file) {
        controllers[file.split('.')[0]] = require(controllersPath + file)
    })

    app.get('/', controllers.site.index)
};