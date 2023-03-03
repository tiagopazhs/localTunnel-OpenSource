const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
  tunnelId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const Catalog = mongoose.model('Catalog', catalogSchema);

module.exports = Catalog;
