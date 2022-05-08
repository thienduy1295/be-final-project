const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bimSchema = Schema({
  name: { type: String, require: true, unique: true },
  imageUrl: { type: String },
  fileUrl: { type: String },
  type: { type: String, require: true, unique: true },
});

const Bim = mongoose.model("BimLibs", bimSchema);
module.exports = Bim;
