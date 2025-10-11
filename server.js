import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import mainRouter from "./routes/mainRouter.js";

const app = express();
app.use(cors());
app.use(express.json());


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
