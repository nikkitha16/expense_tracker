import React, { useEffect, useState } from 'react'
import {LuPlus} from 'react-icons/lu'
import {  prepareExpenseLineChartData } from '../../utils/helper';
import CustomLineChart from '../Charts/CustomLineChart';


const ExpenseOverview = ({transactions,onExpenseIncome}) => {
 const[charData,setCharData]=useState([]);
 useEffect(()=>{
    const result =prepareExpenseLineChartData(transactions);
    setCharData(result);
 },[transactions]);
    return (
    <div className=''>
        <div>
            <div>
                <h5> Expense Oveview</h5>
                <p>Track your spending trends over time and gain insights into where 
                    your money goes.
                </p>
            </div>
            <button className='add-btn' onClick={onExpenseIncome}>
                <LuPlus className='text-lg' />
                Add Expense
            </button>
        </div>
        <div className='mt-18'>
            <CustomLineChart
                data={charData}/>
        </div>
    </div>
  )
}

export default ExpenseOverview