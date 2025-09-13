
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const connectDB = require("./src/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());


app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const userRouter = require("./src/routes/userRoutes");
app.use("/users", userRouter);

connectDB().then(() => {
  console.log("Database connection successful");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}).catch(err => {
  console.error("Database connection failed:", err);
});



