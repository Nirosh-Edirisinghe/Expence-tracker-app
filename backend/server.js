import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { connectDb } from './config/db.js';
import userRouter from './routes/userRoiter.js';
import incomeRouter from './routes/incomeRoutes.js';
import expenseRouter from './routes/expenseRouter.js';
import dashboardRouter from './routes/dashboardRoter.js';

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
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter);

app.get('/', (req, res) => {
  res.send("Api Working!")
})

app.listen(port, () => {
  console.log(`server run on port ${port}`);

})