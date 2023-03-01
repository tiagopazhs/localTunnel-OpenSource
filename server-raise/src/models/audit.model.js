const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  tunnelId: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    required: true,
    default: mongoose.now
  },
  type: {
    type: String,
    required: true,
    default: false
  }
});

const Audit = mongoose.model('Audit', auditSchema);

module.exports = Audit;
