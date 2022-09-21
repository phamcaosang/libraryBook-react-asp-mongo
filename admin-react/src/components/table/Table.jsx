import React, { useEffect, useState } from 'react'
import './table.scss'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {TransactionColumns} from "../../datatablesource"
import { userRequest } from '../../requestMethods';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';


const List = () => {
    const path = "Transaction"
    const columns = {
      "TransactionColumns": TransactionColumns
    }
    const [dataUsers, setDataUsers] = useState([])
    const [columnProperties, setColumnProperties] = useState([])
    useEffect(()=>{
      const getDataUsers = async ()=>{
        const {data} =  await userRequest.get(path)
        console.log(data)
        setColumnProperties(columns[path + "Columns"].concat(actioncolumn))
        setDataUsers(data.reverse())
      }
      getDataUsers()
    }, [])
  
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
  
  
    return (
      <div className='datatable'>
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

export default List