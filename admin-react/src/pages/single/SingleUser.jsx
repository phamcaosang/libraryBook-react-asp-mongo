import React from 'react'
import './single.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import Chart from '../../components/chart/Chart'
import List from '../../components/table/Table'
import { useState } from 'react'
import { useEffect } from 'react'
import { userRequest } from '../../requestMethods'
import { DataGrid } from '@mui/x-data-grid'
import { TransactionColumns } from '../../datatablesource'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const SingleUser = () => {
  const path = window.location.pathname.slice(1)
  const [item, setItem] = useState({})
  const [transactions, setTransactions] = useState([])
  useEffect(()=>{
    const getItemData = async()=>{
      const {data} = await userRequest.get(path)
      setItem(data)
      const tss = await userRequest.get("Transaction/user/" + data.Id)
      setTransactions(tss.data)
    }
    getItemData()
  }, [path])

  const actioncolumn = [
    {field: "action", headerName: "Action", width: 200, renderCell: (params)=>{
      return (
        <div className="cellAction">
          <Link to={`/Transaction/${params.row.Id}`} style ={{textDecoration: "none"}}>
            <div className="viewButton">View</div>
          </Link>
        </div>
      )
    }}
  ]

  const handleSubmit = (e)=>{
    e.preventDefault()
    handleSave()
  }

  const handleSave = async()=>{
    try{
      await userRequest.put("User/" + item.Id, item)
      toast.success("Update successfully", {autoClose: 1500})
    } catch(err){
      console.log(err)
      toast.error("Something went wrong", {autoClose: 1500})
    }
  }

  const handleChange = (e)=>{
    setItem({...item, [e.target.name]: e.target.value})
  }
  return (
    <div className='single'>
      <Sidebar />
        <div className="singleContainer">
            <Navbar/>
            <div className="top">
              <form className="left" onSubmit={handleSubmit}>
                <button type="submit" className="editButton">Save</button>
                <h1 className="title">Information</h1>
                <div className="item">      
                    <img 
                      src={item.Avatar || "https://www.whitericefoundation.org/wp-content/plugins/give/assets/dist/images/anonymous-user.svg"} 
                      alt="img" 
                      className="itemImg" 
                    />
                    <div className="details">
                    <div className="detailItem">
                        <span className="itemKey">Full name:</span>
                        <span className="itemValue">
                          <input type="text" defaultValue={item.Fullname} name="Fullname" onChange = {handleChange}/>
                        </span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Email:</span>
                        <span className="itemValue">
                          <input type="text" defaultValue={item.Email} name="Email" onChange = {handleChange}/>
                        </span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Phone:</span>
                        <span className="itemValue">
                          <input type="text" defaultValue={item.Phone} name="Phone" onChange = {handleChange}/>
                        </span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Address:</span>
                        <span className="itemValue">
                          <input type="text" defaultValue={item.Address} name="Address" onChange = {handleChange}/>
                        </span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Role:</span>
                        <span className="itemValue">
                          <select value={item.Role} name="Role" onChange = {handleChange}>
                            <option>Admin</option>
                            <option>User</option>
                          </select>
                        </span>
                      </div>
                    </div>
                </div>
              </form>
              <div className="right">      
                  <Chart 
                    aspect = {3/1}
                    title = "User Books Renting (Last 6 months)"
                  />
              </div>
            </div>
            <div className="bottom">
              <div className="title">Last Transactions</div>
              <DataGrid
                style={{height: "350px", width: "100%"}}
                className='datagrid'
                rows={transactions}
                columns={TransactionColumns.concat(actioncolumn)}
                pageSize={4}
                rowsPerPageOptions={[4]}
                getRowId = {row => row.Id}
                checkboxSelection
              />
            </div>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default SingleUser