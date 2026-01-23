import { Transaction } from "../models/Transaction.model.js";
import { User } from "../models/user.model.js";

export const fraudCheck = async (req , res , next) => {
    try {
        const { amount } = req.body;
        const senderId = req.userId;

        const sender = await User.findById(senderId);

        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        const txCountLastMinute = await Transaction.countDocuments({
            senderId,
            createdAt : { $gte : oneMinuteAgo}
        });

        const pastTx = await Transaction.find({ senderId });
        const avgTxAmount = pastTx.reduce((s, tx) => s + tx.amount, 0 ) / (pastTx.length || 1);

        const balanceUsageRatio = amount / sender.balance;

        const isHighAmount = amount > avgTxAmount ? 1 : 0;

        req.fraudFeatures = {
            amount,
            txCountLastMinute,
            avgTxAmount,
            balanceUsageRatio,
            isHighAmount
        };

        next();
    }catch(err){
        return res.status(500).json({ message : "Fraud check failed"});
    }
}