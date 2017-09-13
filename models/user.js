var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  email: {type: String, unique: true},
  persent: {type: Boolean},
  absent_count: {type: Number},
  date_of_absent: {type: Number}
});

module.exports = mongoose.model('User', UserSchema);
