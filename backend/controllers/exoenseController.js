import expenseModal from "../models/expenceModal.js";
import getDateRange from "../utils/dataFilter.js";
import XLSX from 'xlsx'

// add expense
const addExpense = async (req, res) => {
  const userId = req.user.id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All feild are required"
      })
    }

    const newExpense = new expenseModal({
      userId,
      description,
      amount,
      category,
      date: new Date(date)
    });
    await newExpense.save();
    res.json({
      success: true,
      message: "Expense added successfully!"
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

// to get all expense
const getExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await expenseModal.find({ userId }).sort({ date: -1 });
    res.json(expense);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

// update expense
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { description, amount } = req.body;
  try {
    const updatedExpense = await expenseModal.findOneAndUpdate({ _id: id, userId },
      { description, amount }, { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      })
    }
    res.json({ success: true, message: "Expense updated successfully.", date: updatedExpense })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

// delete expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await expenseModal.findByIdAndDelete({ _id: req.params.id });
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      })
    }
    return res.json({
      success: true,
      message: "Expense deleted successfully."
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

// download excel for expense
const downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await expenseModal.find({ userId }).sort({ date: -1 });
    const plainData = expense.map((exp) => ({
      Description: exp.description,
      Amount: exp.amount,
      Category: exp.category,
      Date: new Date(exp.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModal");
    XLSX.writeFile(workbook, "expense_details.xlsx");
    res.download("expense_details.xlsx")
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

// get overview of Expense
const getExpenseOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range)

    const expense = await expenseModal.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 })

    const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expense.length > 0 ? totalExpense / expense.length : 0;
    const numberOfTransactions = expense.length;

    const recentTransactions = expense.slice(0, 5);

    res.json({
      success: true,
      data: {
        totalExpense,
        averageExpense,
        numberOfTransactions,
        recentTransactions,
        range
      }
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

export { addExpense, getExpense, updateExpense, deleteExpense, downloadExpenseExcel, getExpenseOverview }