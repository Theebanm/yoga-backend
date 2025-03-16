require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const errHandler = require("./middleware/errHandler");
const classesRoute = require("./routes/classRoute");
const userRoute = require("./routes/userRoute");
const cartRoute = require("./routes/cartRoute");
const paymentRoute = require("./routes/paymentRoute");
const enrollmentRoute = require("./routes/enrollmentRoute");
const app = express();

const PORT = process.env.PORT || 8393;

// !------ ENV --------------
// PORT
// MONGO_URI
// STRIPE_PAYMENT_SECRET
// JWT_SECRET
// CLOUDINARY_CLOUD_NAME
// CLOUDINARY_API_KEY
// CLOUDINARY_API_SECRET

// !--------------------

// ! Middleware
app.use(express.json());
app.use(cors());

// ! Routes
// ? User
app.use("/api/v1/users", userRoute);
// ? Classes
app.use("/api/v1/classes", classesRoute);
// ? Cart
app.use("/api/v1/carts", cartRoute);
// ? Payment
app.use("/api/v1/payments", paymentRoute);
// ? Enrollment
app.use("/api/v1/enrollments", enrollmentRoute);
// ?  Route Not Found
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ! Middleware
app.use(errHandler);

// ! Server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
