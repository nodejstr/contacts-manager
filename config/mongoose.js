var fs = require('fs')
module.exports = function (config) {
    var models_path = config.root + '/app/models'
    fs.readdirSync(models_path).forEach(function (file) {
        require(models_path + '/' + file)
    })
}