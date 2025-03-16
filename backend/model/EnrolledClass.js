const mongoose = require("mongoose");

const enrolledClassSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classes",
        required: true,
      },
    ],
    transactionId: {
      type: String,
      // required:true,
      // unique:true
    },
  },
  {
    timestamp: true,
  }
);

const EnrolledClass = mongoose.model("EnrolledClass", enrolledClassSchema);

module.exports = EnrolledClass;
