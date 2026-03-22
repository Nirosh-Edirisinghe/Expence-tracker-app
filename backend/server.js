import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { connectDb } from './config/db.js';
import userRouter from './routes/userRoiter.js';

const app = express();
const port = 4000

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Db
connectDb();

// Routes
app.use("/api/user", userRouter);

app.get('/', (req, res) => {
  res.send("Api Working!")
})

app.listen(port, () => {
  console.log(`server run on port ${port}`);

})