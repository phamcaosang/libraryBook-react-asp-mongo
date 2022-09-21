import React from 'react'
import './datatable.scss'
import { DataGrid } from '@mui/x-data-grid';

import {UserColumns, BooksColumns, TransactionColumns} from "../../datatablesource.jsx"
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { userRequest } from '../../requestMethods';
import { toast } from 'react-toastify';

const Datatable = () => {
  const path = window.location.pathname.split("/")[1]
  const columns = {
    "UserColumns": UserColumns,
    "BooksColumns": BooksColumns,
    "TransactionColumns": TransactionColumns
  }
  const [dataUsers, setDataUsers] = useState([])
  const [columnProperties, setColumnProperties] = useState([])
  useEffect(()=>{
    const getDataUsers = async ()=>{
      const {data} =  await userRequest.get(path)
      console.log(data)
      setColumnProperties(columns[path + "Columns"].concat(actioncolumn))
      setDataUsers(data)
    }
    getDataUsers()
  }, [path])

  const handleDelete = async (id) =>{
    try{
      await userRequest.delete(`${path}/` + id)
      const newData = dataUsers.filter(item => item.Id !== id)
      setDataUsers(newData)
      toast(`Delete ${path} successfully`, {autoClose: 1500})
    }catch(err){
      console.log(err)
      toast("Something went wrong", {autoClose: 1500})
    }
  }

  const actioncolumn = [
    {field: "action", headerName: "Action", width: 200, renderCell: (params)=>{
      return (
        <div className="cellAction">
          <Link to={`/${path}/${params.row.Id}`} style ={{textDecoration: "none"}}>
            <div className="viewButton">View</div>
          </Link>
          {path !== "Transaction" && 
          <div className="deleteButton" onClick = {()=> handleDelete(params.row.Id)}>Delete</div>
          }
        </div>
      )
    }}
  ]
  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const RefreshTransactions = async()=>{
    try{
      await userRequest.put("Transaction/refresh")
      toast("Refresh Successfully")
      await sleep(1500)
      window.location.href = "/Transaction"
    } catch(err){
      console.log(err)
      toast("Something went wrong")
    }
  }

  return (
    <div className='datatable'>
      <div className="datatableTitle">
        {path}
        {path !== "Transaction" && 
          <Link to={`/${path}/new`} className = "link">
            Add new {path}
          </Link>
        }
        {path === "Transaction" && 
          <span onClick = {RefreshTransactions} className = "link">
            Refresh {path}
          </span>
        }
        
      </div>
        <DataGrid
          className='datagrid'
          rows={dataUsers}
          columns={columnProperties}
          pageSize={9}
          rowsPerPageOptions={[9]}
          getRowId = {row => row.Id}
          checkboxSelection
        />
    </div>
  )
}

export default Datatable