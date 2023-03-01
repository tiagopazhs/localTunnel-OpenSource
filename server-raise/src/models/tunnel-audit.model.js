const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  tunnelId: {
    type: String,
    required: true
  },
  creationDate: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    required: true,
    default: false
  }
});

const Audit = mongoose.model('Audit', auditSchema);

module.exports = Audit;
