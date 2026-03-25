import expenceModal from "../models/expenceModal.js";
import getDateRange from "../utils/dataFilter";

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

    const newExpense = new expenceModal({
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


export {addExpense}