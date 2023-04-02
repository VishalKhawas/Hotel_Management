const mongoose = require("mongoose");

//creating schema of rooms using mongoose Model
var roomSchema = new mongoose.Schema({
    type: {
      type: String,
    },
    roomNo: {
      type: String,
    },
    price: {
      type: Number,
    }
  });

  const Room = mongoose.model("Room", roomSchema);

  module.exports = Room;