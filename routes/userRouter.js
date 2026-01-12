import { Router } from "express";
import { User } from "../models/user.model.js";
import z from "zod";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { Account } from "../models/Account.model.js";
import "dotenv/config";
const userRouter = Router();
const JWT_USER_Password = process.env.JWT_SECRET;
import bcrypt from "bcrypt";
import { System_Prompt } from "../config/systemPrompt.js";
userRouter.post("/signup", async (req, res) => {
  try {
    const requireBody = z.object({
      firstName: z.string().min(3).max(100),
      lastName: z.string().min(3).max(100),
      username: z.string().min(3).max(30),
      password: z.string().min(3).max(30),
    });

    const parseDatawithSuccess = requireBody.safeParse(req.body);

    if (!parseDatawithSuccess.success) {
      return res.status(400).json({
        message: "Incorrect format",
        error: parseDatawithSuccess.error,
      });
    }

    const { username, password, firstName, lastName } =
      parseDatawithSuccess.data;

    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: hashedPassword,
    });

    const userId = user._id;

    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign(
      {
        userId,
      },
      JWT_USER_Password
    );

    res.json({
      message: "User created successfully",
      token: token,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error while signing up",
    });
  }
});


//signin route
userRouter.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Incorrect Credientials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Credientials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_USER_Password);
    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: "Error while signing in" });
  }
});

const updateBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const parsed = updateBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(411).json({
      message: "Invalid update data",
    });
  }

  const updateData = parsed.data;
  await User.updateOne(
    { _id: req.userId }, //Filter condition (find by current user)
    {
      $set: updateData, //update fields with new data
    }
  );

  res.json({
    message: "Updated successfully",
  });
});

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

userRouter.post(
  "/api/chat",
  authMiddleware,
  async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await axios.post(
        process.env.OPENAI_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: System_Prompt },
            { role: "user", content: message },
          ],
          temperature: 0.4,
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      res.json({
        reply: response.data.choices[0].message.content,
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({
        message: "AI service error",
      });
    }
  }
);

export default userRouter;
