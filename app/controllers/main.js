var mongoose = require('mongoose')
    , Contact = mongoose.model('Contact')
    , xmltojson = require('xmltojson')
    , fs = require('fs')

exports.index = function (req, res) {
    Contact.find().exec(function (err, result) {
        res.render('main/index', {error: err, contacts: result})
    })
}

exports.import = function (req, res) {
    res.render('main/import')
}

exports.upload = function (req, res) {
    var contactsFile = req.files['contacts']
    var result = xmltojson.parseString(fs.readFileSync(contactsFile.path).toString())
    fs.unlink(contactsFile.path)
    console.log(result)
    res.redirect('/')
}