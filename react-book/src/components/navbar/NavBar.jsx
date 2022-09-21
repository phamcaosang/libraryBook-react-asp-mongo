import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./NavBar.scss"
import "./NavBar.css"
import { AiOutlineMenu, AiOutlineUser, AiOutlineExport, AiOutlineBook, AiOutlineHistory } from "react-icons/ai";
import { GrCompliance } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { useState } from 'react';
import { publicRequest } from '../../requestMethods';
import SearchBarResult from '../searchBarResult/SearchBarResult';
import { useSelector, useDispatch } from "react-redux"
import { logOutUserAction } from '../../redux/userAction';
import { clearCart } from '../../redux/cartSlicer';
import { ToastContainer, toast } from 'react-toastify';
import { clearFavorites } from '../../redux/favoritesSlicer';

function NavBar() {
  const user = useSelector((state) => state.user.currentUser)
  const cart = useSelector(state => state.cart.cartBook)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState("");
  const [matchBooks, setMatchBooks] = useState([]);
  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  const handleClick = function(url){
    navigate(`/${url}`)
  }
  const handleLogOut = ()=>{
    logOutUserAction(dispatch)
    dispatch(clearCart())
    dispatch(clearFavorites())
    toast("You haved signed out!!")
    sleep(2000)
    navigate("/")
  }
  const handleChange = (text) =>{
    setSearchText(text)
    const getMatchBooks = async () =>{
      const {data} = await publicRequest.get("/Books/search/" + text);
      setMatchBooks(data)
    }
    text !== "" && getMatchBooks()
  }
  return (
    <div className='NavBar'>
        <div className='Container'>
            <div className='Nav'>
                <div><Link to ="/"><img src="https://firebasestorage.googleapis.com/v0/b/shop-cbe4c.appspot.com/o/LOGO.png?alt=media&token=a59e83f6-861f-4c14-83c5-864847110170" alt ="LOGO" /></Link></div>
                <div onClick={() => handleClick("")} className="nav-link">Home</div>
                <div onClick={() => handleClick("books/rating")} className="nav-link">Top rating</div>
                <div onClick={() => handleClick("books/popularity")} className="nav-link">Top popularity</div> 
            </div>
            <div className='SearchBar'>
              <input type="text" placeholder='Search for book name' value = {searchText} onChange={(e) => handleChange(e.target.value)}/>
              <div className='SearchResult'>
                {searchText !== "" && <SearchBarResult items = {matchBooks}/> }
              </div>
            </div>
            <div className='cartBox'>
              <AiOutlineBook className='cart' onClick ={()=>handleClick("cart")}/>
              <span>{cart.length}</span>
            </div>
            <div className="dropdown">
              <button className="dropbtn"><AiOutlineMenu className='MenuIcon'/></button>
              <div className="dropdown-content">
                {!user && 
                  <>   
                    <Link className='link' to ="/register"><AiOutlineUser /> Register</Link>
                    <Link className='link' to ="/login"><AiOutlineUser /> Login</Link>
                  </>
                }
                {user && 
                <>
                  <Link className='link' to ="/profile"><ImProfile /> Profile</Link>
                  <Link className='link' to ="/transaction"><AiOutlineHistory /> Transaction</Link>
                  <span className='link logout' onClick={handleLogOut}><AiOutlineExport /> LogOut</span>
                </>}             
                <Link className='link' to ="/regulation"><GrCompliance/> Regulation</Link>    
              </div>
            </div>
        </div>
        <ToastContainer autoClose={1000}/>
    </div>
  )
  
}

export default NavBar