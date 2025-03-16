const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Payment = require("../model/Payment");
const EnrolledClass = require("../model/EnrolledClass");
const Classes = require("../model/Classes");
const Cart = require("../model/Cart");
const User = require("../model/User");
const stripe = require("stripe")(process.env.STRIPE_PAYMENT_SECRET);
const paymentController = {
  createPaymentIntent: asyncHandler(async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  }),
  //? Create Payment
  paymentInfo: asyncHandler(async (req, res) => {
    try {
      const { transactionId, userId, classesId } = req.body;
      const singleClass = req.params.classId;

      let query;
      if (singleClass) {
        query = {
          userId,
          classId: singleClass,
        };
        classesId = [singleClass]; // Ensure classesId is an array for consistency
      } else {
        query = {
          userId,
          classId: { $in: classesId },
        };
      }

      const classesQuery = {
        _id: { $in: classesId.map((id) => new mongoose.Types.ObjectId(id)) },
      };

      // Check if user is already enrolled in any of the classes
      const user = await User.findById(userId);
      if (user) {
        const alreadyEnrolledClasses = user.classId.map((id) => id.toString());
        const classesToEnroll = classesId.map((id) => id.toString());

        const overlappingClasses = classesToEnroll.filter((id) =>
          alreadyEnrolledClasses.includes(id)
        );

        if (overlappingClasses.length > 0) {
          return res.status(400).json({
            message: `User is already enrolled in class(es) ${overlappingClasses.join(
              ", "
            )}`,
          });
        }
      }

      const classes = await Classes.find(classesQuery).exec(); // Use exec() instead of toArray()

      // Create new enrollment for class(es)
      const newEnrollment = {
        userId,
        classId: classesId.map((id) => new mongoose.Types.ObjectId(id)), // Corrected here
        transactionId,
      };

      // Create new payment
      const newPayment = await Payment.create({
        userId,
        transactionId,
        classId: classesId.map((id) => new mongoose.Types.ObjectId(id)), // Corrected here
      });

      // Query to reduce enrolled and total seats
      const updatedDoc = {
        $inc: {
          totalEnrollment: 1,
          availableSeats: -1,
        },
      };

      const updatedResult = await Classes.updateMany(classesQuery, updatedDoc);

      const enrolledResult = await EnrolledClass.create(newEnrollment);

      const deletedResult = await Cart.deleteMany(query);

      // Update user's classId field
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          classId: {
            $each: classesId.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      });

      res.status(200).json({
        newPayment,
        deletedResult,
        enrolledResult,
        updatedResult,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }),

  // ? History of payments
  paymentHistory: asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Object Id" });
    }

    const payments = await Payment.find({ userId: id }).sort({ date: -1 });

    res.status(200).json(payments);
  }),
};

module.exports = paymentController;
