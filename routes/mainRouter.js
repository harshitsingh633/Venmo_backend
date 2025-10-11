import express, { Router } from "express";
import userRouter from "./userRouter.js";
import accountRouter from "./accountRouter.js";

const mainRouter = Router();

mainRouter.use("/user" ,userRouter );

mainRouter.use("/account",accountRouter);

export default mainRouter;
