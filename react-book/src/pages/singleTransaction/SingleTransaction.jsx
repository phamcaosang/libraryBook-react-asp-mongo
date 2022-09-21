import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NavBar from '../../components/navbar/NavBar'
import { publicRequest, userRequest } from '../../requestMethods'
//import { AiOutlineDelete } from "react-icons/ai";
import "./SingleTransaction.scss"
import { onLoading, offLoading } from '../../redux/loadingSlicer';
import { toast } from 'react-toastify'


function SingleTransaction() {
    
    const dispatch = useDispatch();

    const user = useSelector(state => state.user.currentUser)
    const transactionId = window.location.pathname.split("/")[2]
    const [transaction, setTransaction] = useState({})
    console.log(transaction)
    const [books, setBooks] = useState([])
    useEffect(()=>{
        const getTransactionData = async()=>{
          try{
            dispatch(onLoading())
            const {data} = await userRequest.get(`/Transaction/${transactionId}/${user.Id}`)
            setTransaction(data)
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
          }catch(err){
            console.log(err)
            toast.err("Something went wrong!!")
          }finally{
            console.log("first")
            dispatch(offLoading())
          }
        }
        getTransactionData()
    }, [])

    const columns = [
        {
          field: "CoverImg",
          headerName: "Image",
          width: 80,
          renderCell: (params) => {
            return (
              <div className="bookListItem">
                <img className="bookListImg" src={params.row.CoverImg} alt="" />
                {params.row.title}
              </div>
            );
          },
        },
        { field: "Title", headerName: "Title", width: 280 },
        { field: "Series", headerName: "Series", width: 280 },
        { field: "Author", headerName: "Author", width: 280 },
        { field: "Pages", headerName: "Pages", width: 90 },
        { field: "Price", headerName: "Price", width: 90 },
        {
          field: "action",
          headerName: "Action",
          width: 80,
          renderCell: (params) => {
            return (
              <>
                <Link to={"/books/" + params.row.Id}>
                  <button className="productListEdit">View</button>
                </Link>
              </>
            );
          },
        },
        {
          field: "Status",
          headerName: "Status",
          width: 140,
          renderCell: (params) => {
            let status = params.row.Status
            const updateStatus = async (status)=>{
              const upDatedData = {...transaction, BookIds: books.map(item => {
                return item.Id !== params.row.Id ? {BookId: item.Id, Status: item.Status} : {BookId: item.Id, Status: status}
              })}
              return await userRequest.put("Transaction/" + transactionId, upDatedData)
            }
            
            const handleChange = (e)=>{
              updateStatus(e.target.value).then(res=>{
                setBooks(books.map(item => {
                  console.log(e.target.value)
                  return item.Id !== params.row.Id ? item : {...item, Status: e.target.value}
                }))
              }).catch(err => console.log(err))
            }
            return (
              <>
                {
                  (status === "Accepted" || status === "Expired") &&
                    (
                      <select className={"status " + status} onChange = {handleChange} value={status}>      
                        {[status, "Returned"].map(item => 
                          <option key = {item}>{item}</option>)
                        }
                    </select>
                    )    
                }

                {
                  (status === "Refused" || status === "Returned" || status === "Pending" )
                  &&
                  <span className={"status " + status} >
                      {status}
                  </span>
                }
                
              </>
            );
          },
        },
      ];


  return (
    <>
        <NavBar />
        <div className='Transaction' >
            <h2>Transaction: {transactionId}, Date: {transaction.SubmitDate?.slice(0, 10)}, Total: {transaction.Total?.toFixed(2)}$, Status: {transaction.Status}</h2>
            <DataGrid
                className='dataGrid'
                rows={books}
                columns={columns}
                getRowId = {row => row.Id}
                pageSize={7}
                rowHeight={60}
                rowsPerPageOptions={[7]}
                checkboxSelection
                disableSelectionOnClick
            />
            
             
        </div>
    </>
  )
}

export default SingleTransaction