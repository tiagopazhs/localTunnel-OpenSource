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
    default: 'no description'
  },
  originIp: {
    type: String,
    required: false,
  },
  tcpPort:{
    type: String,
    required: false
  }
});

const Audit = mongoose.model('Audit', auditSchema);

module.exports = Audit;
