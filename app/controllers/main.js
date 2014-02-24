var mongoose = require('mongoose')
    , Contact = mongoose.model('Contact')
    , xml2json = require('xml2json')
    , fs = require('fs')
    , async = require('async')

exports.index = function (req, res) {
    Contact.find().exec(function (err, contacts) {
        res.render('main/index', {error: err, contacts: contacts})
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

var aggregateContacs = Contact.aggregate([
    { $project: { name: 1, lastName: 1, phone: 1 } },
    { $group: {
        _id: { name: '$name', lastName: '$lastName'},
        phones: { $addToSet: '$phone' },
        count: { $sum: 1 }
    }},
    {$match: {count: {$gt: 1}}},
    {$sort: {count: -1}}
])

exports.findDuplicates = function (err, res) {
    aggregateContacs.exec(function (err, duplicates) {
        res.render('main/duplicates', {error: err, contacts: duplicates})
    })
}

exports.mergeDuplicate = function (req, res) {
    var i = 0;
    aggregateContacs.exec(function (err, duplicates) {
        async.whilst(
            function () {
                return i < duplicates.length
            },
            function (callback) {
                var dup = duplicates[i];
                console.log(i + 1)
                Contact.remove({name: dup._id.name, lastName: dup._id.lastName}).exec(function () {
                    Contact.create({name: dup._id.name, lastName: dup._id.lastName, phone: dup.phones}, function (err) {
                        if (err) console.log(err)
                    })
                    i++;
                    setTimeout(callback, 10);
                })
            },
            function (err) {
                console.log('merging done err:', err)
                res.json({result: 1})
            }
        )
    })
}

exports.edit = function (req, res) {
    if (req.params.id) {
        Contact.findOne({_id: req.params.id}).exec(function (err, doc) {
            res.render('main/edit', {error: err, contact: doc})
        })
    } else {
        res.render('main/edit', {contact: new Contact()})
    }
}

exports.update = function (req, res) {
    var contact = req.body
        , Id = contact._id
    delete contact._id
    contact.phone = contact.phone.split(',').filter(function (e) {
        return e && e.length
    })
    contact.updatedAt = new Date()
    Contact.findOneAndUpdate({_id: Id}, contact,{upsert:true}).exec(function (err, doc) {
        res.redirect('/edit/' + Id)
    })
}

exports.delete = function (req, res) {
    Contact.remove({_id: req.body.id}).exec(function (err, result) {
        res.json({error: err, result: result})
    })
}