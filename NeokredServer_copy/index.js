const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const database = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 6000;

dotenv.config();
database.connect();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use("/api/v1/auth", userRoutes);

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
