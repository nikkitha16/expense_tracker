const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");


console.log("Income",Income);
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        const totalIncome = await Income.aggregate([{ $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
        ])
        console.log("totalIncome", { totalIncome, userId: isValidObjectId(userId) });
        const totalExpense = await Expense.aggregate([
            { $match: { userId:  userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ])

        const last60DaysIncomeTransaction = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });
        console.log("last60DaysIncomeTransaction", last60DaysIncomeTransaction);
        const incomeLast60Days = last60DaysIncomeTransaction.reduce(
            (sum, transaction) => sum + transaction.amount, 0);

        const last30DayesExpenseTransaction = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });
        const expenseLast30Days=last30DayesExpenseTransaction.reduce(
            (sum,transaction)=>sum+transaction.amount,
            0
        );
        console.log("Income",Income);

        const lastTransactions=[
            ...(await Income.find({userId}).sort({date:-1}).limit(5)).map(
                (txn)=>({
                    ...txn.toObject(),
                    type:"income",
                })
            ),
             ...(await Expense.find({userId}).sort({date:-1}).limit(5)).map(
                (txn)=>({
                    ...txn.toObject(),
                    type:"expense",
                })
            ),
        ].sort((a,b)=>b.date-a.date);

        res.json({
            totalBalance:
            (totalIncome[0]?.total||0)-(totalExpense[0]?.total||0),
            totalIncome:totalIncome[0]?.total||0,
            totalExpenses:totalExpense[0]?.total||0,
            last30DaysExpenses:{
                total:expenseLast30Days,
                transactions:last30DayesExpenseTransaction,
            },
            last60DaysIncome:{
                total:incomeLast60Days,
                transactions:last60DaysIncomeTransaction,
            },
            recentTransactions:lastTransactions,
        });
    }catch(err){
        res.status(500).json({message:"Server error",error:err.message})
    }

}