import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { IoMdDoneAll } from "react-icons/io";
import Modal from "../../components/layout/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/layout/DeleteAlert";
import { useUserAuth } from '../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  console.log("openDeleteAlert", openDeleteAlert);
  const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false);
  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong.Please try again", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddIncome = async (income) => {
    const{source,amount,date,icon}=income;
    if(!source.trim()){
    toast.error("Income source is required");
    return;
    }
    if(!amount || isNaN(amount)|| Number(amount)<=0){
      toast.error("Amount should be a valid number greater than 0.0");
      return;
    }
    if(!date){
      toast.error("Date is required");
      return;
    }
    try{
      await axiosInstance.post(`${API_PATHS.INCOME.ADD_INCOME}`, {
        source,
        amount,
        date,
        icon,
      });
      setOpenAddIncomeModel(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();

    } catch(error){
      console.error("Error adding income:",error.response?.data?.message || error.message);
    }
  };
  const handleDownloadIncomeDetails = async () => {
      try{
      const response =await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob", // Important for downloading files
        }
      )
      const url =window.URL.createObjectURL(new Blob([response.data]));
      const link =document.createElement("a");
      link.href =url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url) ;
    }catch(error){
      console.error("Error downloading income details:",error);
      toast.error("Failed to download income details");
    }
  };
  useEffect(() => {
    fetchIncomeDetails();
    return () => {};
  }, []);
  const deleteIncome = async (id) => {
    console.log("deleteIncome", id);
    try{
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error deleting income:", error.response?.data?.message || error.message);}
  }
  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModel(true)}
            />
          </div>
          <IncomeList
          transactions={incomeData}
          onDelete={(id)=>{
            setOpenDeleteAlert({show:true,data:id});
              }}
          onDownload={handleDownloadIncomeDetails}/>
        </div>
        <Modal 
        isOpen={openAddIncomeModel}
        onClose={() => setOpenAddIncomeModel(false)}
        title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome}/>
          </Modal>
          <Modal
          isOpen={openDeleteAlert.show  }
          onClose={()=>setOpenDeleteAlert({show:false,data:null})}
          title={"Delete Income"}>
            <DeleteAlert
            content="Are you sure  you want to delete this Income?"
            onDelete={()=>deleteIncome(openDeleteAlert.data)}/>
          </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
