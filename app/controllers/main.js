var mongoose = require('mongoose')
    , Contact = mongoose.model('Contact')
    , xml2json = require('xml2json')
    , fs = require('fs')
    , async = require('async')

exports.index = function (req, res) {
    Contact.find().exec(function (err, result) {
        console.log(result.length)
        res.render('main/index', {error: err, contacts: result})
    })
}

exports.import = function (req, res) {
    res.render('main/import')
}

exports.upload = function (req, res) {
    var contactsFile = req.files['contacts']
        , result = xml2json.toJson(fs.readFileSync(contactsFile.path).toString(), {object: true, reversable: true}).contacts.contact
        , i = 0;

    console.log(result.length)
    async.whilst(
        function () {
            return i < result.length
        },
        function (callback) {
            console.log(i + 1)
            Contact.create(result[i], function (err) {
                if (err) console.log(err)
                i++;
                setTimeout(callback, 10);
            })
        },
        function (err) {
            console.log('importing done err:', err)
        }
    )
    fs.unlink(contactsFile.path)
    res.redirect('/')
}