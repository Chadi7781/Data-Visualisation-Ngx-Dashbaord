const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rapportSchema = new Schema({
  product : {
    type : String,
  },
  zone : {
    type : String
  },
  year : {
    type : String
  },
   month: {
     type : String
  },
  value :{
    type: Number
  }

})
module.exports = mongoose.model('rapport', rapportSchema);
