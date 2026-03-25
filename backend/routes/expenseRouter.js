import express from 'express'
import authMiddleware from '../middleware/auth.js';
import {addExpense, deleteExpense, downloadExpenseExcel, getExpense, getExpenseOverview, updateExpense } from '../controllers/exoenseController.js';

const expenseRouter = express.Router();

expenseRouter.post("/add", authMiddleware, addExpense);
expenseRouter.get("/get", authMiddleware, getExpense);

expenseRouter.put("/update/:id", authMiddleware, updateExpense);
expenseRouter.get("/downloadexel", authMiddleware, downloadExpenseExcel);

expenseRouter.delete("/delete/:id", authMiddleware, deleteExpense);
expenseRouter.get("/overview", authMiddleware, getExpenseOverview);

export default expenseRouter;