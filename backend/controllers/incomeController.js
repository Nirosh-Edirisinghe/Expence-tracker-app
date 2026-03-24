import incomeModal from "../models/incomeModal.js";
import XLSX from 'xlsx'
import getDateRange from "../utils/dataFilter.js";

// add income
const addIncome = async (req, res) => {
  const userId = req.user.id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All feild are required"
      })
    }

    const newIncome = new incomeModal({
      userId,
      description,
      amount,
      category,
      date: new Date(date)
    });
    await newIncome.save();
    res.json({
      success: true,
      message: "Income added successfully!"
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

// get all income
const getAllIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await incomeModal.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

// update income 
const updateIncome = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { description, amount } = req.body;
  try {
    const updatedIncome = await incomeModal.findOneAndUpdate({ _id: id, userId },
      { description, amount }, { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found"
      })
    }
    res.json({ success: true, message: "Income updated successfully.", date: updatedIncome })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

// delete income
const deleteIncome = async (req, res) => {
  try {
    const income = await incomeModal.findByIdAndDelete({ _id: req.params.id });
    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found"
      })
    }
    return res.json({
      success: true,
      message: "Income deleted successfully."
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

// to download the data in excel sheet
const downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await incomeModal.find({ userId }).sort({ date: -1 });
    const plainData = income.map((inc) => ({
      Description: inc.description,
      Amount: inc.amount,
      Category: inc.category,
      Date: new Date(inc.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "incomeModel");
    XLSX.writeFile(workbook, "incom_details.xlsx");
    res.download("incom_details.xlsx")
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Servere Error'
    })
  }
}

export { addIncome, getAllIncome, updateIncome, deleteIncome }