import express from "express";
import { connectDB } from "./db/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const port = 8000
dotenv.config({
    path: "./.env",
  });

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB(process.env.MONGO_URI);
app.use(cookieParser())

import userRouter from "./routes/user.js";
import contactRouter from "./routes/contact.js";
import teamRouter from "./routes/team.js";
app.use("/api/user", userRouter);
app.use("/api/contact", contactRouter);
app.use("/api/team", teamRouter);


app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
