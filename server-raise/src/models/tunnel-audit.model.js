const mongoose = require('mongoose');

const audit = mongoose.model('audit', {
    tunnelId: String,
    creationDate: String,
    open: Boolean,
})

module.exports = audit