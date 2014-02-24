var controllers = {}
    , fs = require('fs')
    , multipart = require('connect-multiparty')
    , multipartMiddleware = multipart();

module.exports = function (app, config, passport) {
    var controllersPath = config.root + '/app/controllers/';
    fs.readdirSync(controllersPath).forEach(function (file) {
        controllers[file.split('.')[0]] = require(controllersPath + file)
    })

    app.get('/', controllers.main.index)
    app.get('/import', controllers.main.import)
    app.post('/import', multipartMiddleware, controllers.main.upload)
    app.get('/findDuplicates', controllers.main.findDuplicates)
    app.post('/mergeDuplicate', controllers.main.mergeDuplicate)
    app.get('/edit/:id', controllers.main.edit)
    app.get('/create', controllers.main.edit)
    app.post('/edit/:id', controllers.main.update)
    app.post('/delete', controllers.main.delete)
};