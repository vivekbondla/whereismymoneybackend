const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense-controller')

router.post('/storeexpense',expenseController.storeExpenseData)
router.get('/expense/:userId',expenseController.getExpenseData)
router.delete('/expense/:expenseId',expenseController.deleteExpense)

module.exports =router