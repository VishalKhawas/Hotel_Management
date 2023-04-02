const mongoose = require("mongoose");

//creating schema of booking using mongoose Model
var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  roomNo: {
    type: String,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  billAmnt: {
    type: Number,
    required: true,
  }
});

const Hotel = mongoose.model("Hotel", schema);

module.exports = Hotel;