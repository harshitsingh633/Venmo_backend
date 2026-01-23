import { Account } from "../models/Account.model";

export async function getUserBalance(userId){
    const account = await Account.findOne({ userId });

    if(!account){
        throw new Error("Account not found");
    }

    return account.balance;
}