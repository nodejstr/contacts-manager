var mongoose = require('mongoose')
mongoose.model('Contact', new mongoose.Schema({
    name: String,
    lastName: String,
    phone: Array,
    createdAt: {type: Date, default: new Date()},
    updatedAt: Date
}))