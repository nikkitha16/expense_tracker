import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from '../Charts/CustomBarChart'
import {  prepareIncomeBarChartData } from '../../utils/helper';
const IncomeOverview = ({transactions,onAddIncome}) => {
    const[charData,setChartData]=useState([]);
    useEffect(()=>{
        const result= prepareIncomeBarChartData(transactions);
        setChartData(result);
        return()=>{}
    },[transactions])
  return (
    <div className='card'>
        <div className='flex items-center justify-between '>
            <div  className=''>
                <h5 className='text-lg'>Income Overview</h5>
                
                <p className='text-xs tret-gray-400 mt-0.5'> Track your earnings over time and analyz your income trends</p>
          
            </div>
            <button className='add-btn' onClick={onAddIncome}>
                <LuPlus className='text-lg'/>
                Add Income
            </button>
        </div>
        <div className='mt-10'>
        <CustomBarChart
        data={charData}
        />
        </div>
    </div>
  )
}

export default IncomeOverview