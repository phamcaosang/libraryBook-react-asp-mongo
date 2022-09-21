import React from 'react'
import "./Cart.scss"
import Navbar from "../../components/navbar/NavBar"
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { publicRequest, userRequest } from '../../requestMethods'
import { toast, ToastContainer } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { clearCart, removeBookFromCart } from '../../redux/cartSlicer'

function Cart() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.currentUser)
  const cart = useSelector(state => state.cart.cartBook)
  const [booksCart, setBooksCart] = useState([])
  useEffect(()=>{
    const getBooksCart = async()=>{
      const books = await Promise.all(
        cart.map(bookId =>{
          return publicRequest.get("Books/" + bookId).then(res => res.data).catch(err => {
            console.log(err)
          })
        })
      )
      setBooksCart(books)
    }
    getBooksCart()
  }, [cart])

  const onFail = (err) => {
    console.log(err)
    toast("Something went wrong")
  }

  const onSuccessRemove = (title) => {
    toast(`"${title}" removed from cart`)
  }

  
  const handleRemoveFromCart = (Id, title) =>{
    try{
      dispatch(removeBookFromCart(Id))
      onSuccessRemove(title)
    } catch(err){
      onFail(err)
    }
    
  }

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
    { field: "Title", headerName: "Title", width: 250 },
    { field: "Series", headerName: "Series", width: 300 },
    { field: "Pages", headerName: "Pages", width: 70 },
    { field: "Price", headerName: "Price", width: 70 },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/books/" + params.row.Id}>
              <button className="productListEdit">View</button>
            </Link>
            <AiOutlineDelete
              className="productListDelete"
              onClick={() => handleRemoveFromCart(params.row.Id, params.row.Title)}
            />
          </>
        );
      },
    },
  ];

  const handleSubmit = async () =>{
    if(user == null){
      toast.warning("You need to login for submission")
    } else if (booksCart.length === 0){
      toast.warning("Your cart is empty!!")
    }
    else{
      const data = {
          "userId": user.Id,
          "bookIds": cart.map(item => {
            return {
              BookId: item,
              Status: "Pending"
            }
          }),
          "total": booksCart.map(item => item.Price).reduce((a, b) => a + b, 0)
      }
  
      try{
        await userRequest.post("Transaction/create/"+ user.Id, data)
        toast.success("Your submission has been sent to the Seller")
        dispatch(clearCart())
      } catch(err){
          onFail(err)
        }
    }
  }
  



  return (
    <>
      <Navbar />
      <div className='Cart'>
        <div className='Left'>
          <div style={{ height: '92%', width: '100%'}}>
            <h2>My Cart | Total price: {booksCart.length === 0 ? 0 : booksCart.map(item => item.Price).reduce((a, b) => a + b, 0)} $</h2>
            <DataGrid
              className='dataGrid'
              rows={booksCart}
              columns={columns}
              getRowId = {row => row.Id}
              pageSize={8}
              rowsPerPageOptions={[6]}
              disableSelectionOnClick
            />
          </div>
        </div>
        <div className='Right'>
          <div className='Submission'>
            <div className='Rules'>
              <h2>Rules</h2>
              <p>1. You just can borrow one of each book in quantity</p>
              <p>2. You need to return book after two weeks</p>
              <p>3. You need to take reserved books after 3 days from submission</p>
              <p>4. You need to pay a refundable secure of 50.000</p>
              <p>5. You need to bring passpord or verification ID for getting books</p>
              <p>6. Further info, please contact librarian and read regulations</p>
              <div className='Submit' onClick={handleSubmit}>
                Submit
              </div>
            </div>
            <div className='Decoration'>
              <img src="https://media2.giphy.com/media/IzihZRMnD33J4DsLT1/giphy.gif" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart