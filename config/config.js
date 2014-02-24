var root = require('path').normalize(__dirname + '/..');
module.exports = {
    'dev': {
        db: 'mongodb://localhost/contacts-dev',
        status: 'dev',
        port: process.env.PORT || 1337,
        root: root
    },
    'prod': {
        db:process.env.MONGOLAB_URI || 'mongodb://localhost/contacts',
        status: 'prod',
        port: process.env.PORT || 1337,
        root: root
    }
}[process.env.NODE_ENV || 'dev']