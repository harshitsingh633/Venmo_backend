import express from "express";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import mainRouter from "./routes/mainRouter.js";

const app = express();

app.use(cors({
  origin : "http://localhost:5173",
  methods : "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure : false
  }
}));

app.use("/api/v1", mainRouter);

const mongoDBURL = process.env.mongo_url;
async function database() {
  try {
    await mongoose.connect(mongoDBURL);
    console.log("MongoDb Connection Successfull");
    app.listen(3000);
  } catch (e) {
    console.log("Error", e);
  }
}
database();
