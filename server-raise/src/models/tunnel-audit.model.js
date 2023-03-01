const mongoose = require('mongoose');

const Audit = mongoose.model('Audit', {
    tunnelId: String,
    creationDate: String,
    open: Boolean,
})

module.exports = Audit



