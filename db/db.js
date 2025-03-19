import mongoose from "mongoose";
export const connectDB = (uri) => {
    mongoose
      .connect(
        "mongodb+srv://pranjalgupta:Abhay%408269@cluster0.e5ayq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { dbName: "content-management"})
      .then((data) => {
        console.log(`Connected to MongoDB ${data.connection.host}`);
      })
      .catch((err) => {
        throw err;
      });
  };