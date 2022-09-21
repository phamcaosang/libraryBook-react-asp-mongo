import React from 'react'
import "./Transaction.scss"
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../components/navbar/NavBar'
import { userRequest } from '../../requestMethods';
import { AiOutlineDelete } from "react-icons/ai";
import { DataGrid } from '@mui/x-data-grid';
import { onLoading, offLoading } from '../../redux/loadingSlicer';


function Transaction() {
    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch();

    let [transactions, SetTransactions] = useState([])
    useEffect(()=>{
        const getFavorites = async()=>{
          try{
            dispatch(onLoading())
            const {data} = await userRequest.get("/Transaction/user/" + user.Id)
            SetTransactions(data)
            console.log(data)
          }catch(err){
            toast.error("Something went wrong")
          }finally{
            dispatch(offLoading())
          }
        }
        getFavorites()
    }, [user])
    
    const onFail = (err) => {
      console.log(err)
      toast("Something went wrong")
    }
  
    const onSuccessRemove = (title) => {
      toast(`"${title}" removed from favorites`)
    }

    const handleRemoveFromFavorites = (bookId, title)=>{
      //RemoveFavoriteBook(dispatch, user.Id, bookId, onFail, ()=>{onSuccessRemove(title)})
    }

    const columns = [
        { field: "Id", headerName: "Id", width: 220 },
        {
            field: "quantity",
            headerName: "Quantity",
            width: 100,
            renderCell: (params) => {
              return (
                <>
                  {params.row.BookIds?.length}
                </>
              );
            },
          },
        {
          field: "SubmitDate",
          headerName: "Submit Date",
          width: 120,
          renderCell: (params) => {
            return (
              <>
                {params.row.SubmitDate.slice(0, 10)}
              </>
            );
          },
        },
        {
          field: "ExpireDate",
          headerName: "Expire Date",
          width: 120,
          renderCell: (params) => {
            return (
              <>
                {params.row.ExpireDate.slice(0, 10)}
              </>
            );
          },
        },
        { 
          field: "Total", 
          headerName: "Total", 
          width: 70,
          renderCell: (params) => {
            return (
              <>
                {params.row.Total.toFixed(2)}
              </>
            );
          }, 
        },
        {
          field: "action",
          headerName: "Action",
          width: 100,
          renderCell: (params) => {
            return (
              <>
                <Link to={"/transaction/" + params.row.Id}>
                  <button className="viewTransaction">View</button>
                </Link>
              </>
            );
          },
        },
        {
          field: "Response",
          headerName: "Response",
          width: 350,
          renderCell: (params) => {
            return (
              <>
                {params.row.Response}
              </>
            );
          },
        },
        {
            field: "Status",
            headerName: "Status",
            width: 150,
            renderCell: (params) => {
              return (
                <>
                <span  className={"status " + params.row.Status} >
                    {params.row.Status}
                </span>
                </>
              );
            },
          },
          
      ];
  return (
    <>
        <NavBar />
        <div className='Transaction' >
            <h2>My Historic Transactions</h2>
            <DataGrid
                className='dataGrid'
                rows={transactions}
                rowHeight={60}
                columns={columns}
                getRowId = {row => row.Id}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
                disableSelectionOnClick
            /> 
        </div>
    </>
  )
}

export default Transaction