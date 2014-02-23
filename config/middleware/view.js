module.exports = function () {
    return function (req, res, next) {
        res.locals.title = 'Contacts Manager';
        res.locals.req = req;
        next()
    }
}