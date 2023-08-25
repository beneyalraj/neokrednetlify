const mongoose = require("mongoose");
require("dotenv").config();


exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
      console.log("Failed to connect DB");
      console.error(error);
      process.exit(1);
    });
};
