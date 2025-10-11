import express, { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { Account } from "../models/Account.model.js";
import mongoose from "mongoose";

const accountRouter = Router();

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { to, amount } = req.body;

  try {
    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid account",
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    return res.json({
      success: true,
      message: "Transfer successful",
    });
  } catch (e) {
    await session.abortTransaction();
    console.error("Transfer errror:", e);
    return res.status(500).json({
      success: false,
      message: "Interval server error",
    });
  } finally {
    session.endSession();
  }
});

export default accountRouter;
//1.31.34
