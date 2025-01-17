const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoConnect = require("./helper/mongoConnect");
const appError = require("./helper/errorHandler");
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(express.json());
dotenv.config();
mongoConnect();
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

app.use("/api/user", userRouter);
app.use("/api/med", doctorRouter);

app.all("*", (req, res, next) => {
  next(
    new appError(`The requested page ${req.originalUrl} was not found`, 404)
  );
});

//global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

module.exports = app;
