import mongoose from "mongoose";

export const connectDb = async ()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(()=> console.log("Db connected"));
  } catch (error) {
    console.error("db connection error",error.message);
    setTimeout(connectDb, 5000);
  }
  
}