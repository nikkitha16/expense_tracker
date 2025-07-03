const xlsx =require("xlsx")
const Income = require("../models/Income.js");

exports.addIncome =async(req,res)=>{
    const userId= req.user.id;
    try{
        const{icon,source,amount,date}=req.body;
        if(!source ||!amount||!date ){
            return res.status(400).json({message:"All fields are required"});
        }
        const newIncome= new Income({
            userId,
            icon,
            source,
            amount,
            date:new Date(date)
        });
        await newIncome.save();
        res.status(200).json(newIncome);
    }catch(err){
        res.status(500).json({message:"server Error",error:err.message})
    }
}
exports.getAllIncome=async(req,res)=>{
    const userId=req.user.id;
    try{
        const income=await Income.find({userId}).sort({date:-1});
        res.json(income);
    }catch(err){
        res.status(500).json({message:"Server error",error:err.message});
    }

}
exports.deleteIncome=async(req,res)=>{
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({message:"Income deleted successfully"})
    }catch(err){
        res.status(500).json({message:"Server Error",error:err.message})
    }
}
exports.downloadIncomeExcel=async(req,res)=>{
    const userId=req.user.id;
    try{
        const income= await Income.find({userId}).sort({date:-1});
        const data=income.map((item)=>({
            Source:item.source,
            Amount:item.amount ,
            Date:new Date(item.date).toLocaleDateString("en-IN"),
        }));
        const wb = xlsx.utils.book_new();
        const ws=xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws,"Income");
        xlsx.writeFile(wb,"income_details.xlsx");
        res.download('income_details.xlsx');
    }catch(err){
        res.status(500).json({message:"Server Error",error:err.message});
    }
}