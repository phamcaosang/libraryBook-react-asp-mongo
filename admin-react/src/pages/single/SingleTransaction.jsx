import React from 'react'
import './single.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import List from '../../components/table/Table'
import { useState } from 'react'
import { useEffect } from 'react'
import { publicRequest, userRequest } from '../../requestMethods'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Datatable from '../../components/datatable/Datatable'
import { DataGrid } from '@mui/x-data-grid'
import { BooksColumns } from '../../datatablesource'
import { Link, useNavigate } from 'react-router-dom'

const SingleTransaction = () => {
  const path = window.location.pathname.slice(1)
  const navigate = useNavigate()
  const [item, setItem] = useState({})
  const [books, setBooks] = useState([])
  const [user, setUser] = useState({})
  const options = ["Pending", "Accepted", "Refused", "Done"]
  useEffect(()=>{
    const getItemData = async()=>{
      try{
        const {data} = await userRequest.get(path)
        setItem(data)
        const bookIds = data.BookIds
        const fetchBooks = await Promise.all(bookIds.map(item =>{
            return publicRequest.get("/Books/" + item.BookId).then(res => {
              return {
                ...res.data,
                Status: item.Status
              }
            }).catch(err => err)
        }))
        setBooks(fetchBooks)
        const getUser =  await userRequest.get("User/" + data.UserId)
        setUser(getUser.data)
      } catch(err){
        console.log(err)
      }
    }
    getItemData()
  }, [path])

  const handleChange = (e)=>{
    setItem({...item, [e.target.name]: e.target.value })
  }

  const handleSubmit =  async(e) =>{
    e.preventDefault()
    try{
      console.log(item.ExpireDate+"T17:00:00Z")
      item.ExpireDate = item.ExpireDate.slice(0, 10) + "T17:00:00Z"
      await userRequest.put("Transaction/" + item.Id, item)
      toast.success("You have updated the transaction sucessfully")

    }catch(err){
      console.log(err)
      toast.error("Something went wrong")
    }
  }


  const actioncolumn = [
    {field: "action", headerName: "Action", width: 100, renderCell: (params)=>{
      return (
        <div className="cellAction">
          <Link to={`/Books/${params.row.Id}`} style ={{textDecoration: "none"}}>
            <div className="viewButton">View</div>
          </Link>
        </div>
      )
    }}
  ]


  const statuscolumn = [
    {field: "Status", headerName: "Status", width: 130, renderCell: (params)=>{
      let status = params.row.Status
      const updateStatus = async (status)=>{
        const upDatedData = {...item, BookIds: books.map(item => {
          return item.Id !== params.row.Id ? {BookId: item.Id, Status: item.Status} : {BookId: item.Id, Status: status}
        })}
        return await userRequest.put(path, upDatedData)
      }

      
      const handleChangeStatus = (e)=>{
        updateStatus(e.target.value).then(res=>{
          setBooks(books.map(item => {
            return item.Id !== params.row.Id ? item : {...item, Status: e.target.value}
          }))
          toast.success("Transaction updated")
        }).catch(err => {
          console.log(err)
          toast.error("Transaction updated")
        })
      }
      
      return (
          <select className={"status " + status} onChange = {handleChangeStatus} defaultValue={status}>      
                {options.map(item => 
                  <option key = {item}>{item}</option>)
                }
          </select>
      )
    }}
  ]


  const handleView = ()=>{
    navigate("/User/" + user.Id)
  }

  return (
    <div className='single'>
      <Sidebar />
        <div className="singleContainer">
            <Navbar/>
            <div className="top">
              <div className="left">
              <div className="editButton" onClick = {handleView}>View</div>
                <h1 className="title">Information</h1>
                <div className="item">      
                    <img 
                      src={user.Avatar || "https://www.whitericefoundation.org/wp-content/plugins/give/assets/dist/images/anonymous-user.svg"} 
                      alt="img" 
                      className="itemImg" 
                    />
                    <div className="details">
                      <h1 className="itemTitle">{user.Fullname}</h1>
                      <div className="detailItem">
                        <span className="itemKey">Email:</span>
                        <span className="itemValue">{user.Email}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Phone:</span>
                        <span className="itemValue">{user.Phone}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Address:</span>
                        <span className="itemValue">{user.Address}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Role:</span>
                        <span className="itemValue">{user.Role}</span>
                      </div>
                    </div>
                </div>
              </div>
              <form className="right" onSubmit={handleSubmit}>      
                  <div className="details">
                    <div className="detailItem">
                      <span className="itemKey">Submit Date:</span>
                      <span className="itemValue">
                      {item.SubmitDate?.slice(0, 10)}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Expire Date:</span>
                      <span className="itemValue">
                        <input required type="text" defaultValue = {item.ExpireDate?.slice(0, 10)} onChange={handleChange} name="ExpireDate"/>
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Quantity:</span>
                      <span className="itemValue">{item.BookIds?.length}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Status:</span>
                      <select className={"status " + item.Status} value={item?.Status} name="Status" onChange = {handleChange}>      
                        {options.map(item => 
                          <option key = {item}>{item}</option>)
                        }
                      </select>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Response:</span>
                      <textarea type="text" defaultValue={item.Response} rows = {2} cols = {80} style={{"display": "block"}} onChange={handleChange} name="Response"/>  
                    </div>
                    <div className="updateTs">
                      <button type='submit'>UPDATE</button>
                    </div>
                  </div>
              </form>
            </div>
            <div className="bottom">
              <div className="title">Books for this transaction</div>
              <DataGrid
                style={{width: "100%", height: "500px"}}
                className='datagrid'
                rows={books}
                columns={BooksColumns.concat(actioncolumn, statuscolumn)}
                pageSize={7}
                rowsPerPageOptions={[7]}
                getRowId = {row => row.Id}
                checkboxSelection
              />
            </div>
        </div>
        <ToastContainer autoClose={1500}/>
    </div>
  )
}

export default SingleTransaction