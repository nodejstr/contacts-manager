var mongoose = require('mongoose')
mongoose.model('Contact', new mongoose.Schema({
    name: String,
    lastName: String,
    phone: String,
    createdAt: {type: Date, default: new Date()},
    updatedAt: Date
}))