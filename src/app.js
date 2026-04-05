const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.route");
const recordRoutes = require("./routes/record.route");
const dashboardRoutes = require("./routes/dashboard.routes");
const userRoutes = require("./routes/users.route");
const notFoundHandler = require("./middlewares/error.middleware")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);

module.exports = app;
