import React from 'react'
import "./DisplayBook.scss"
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive'
import { useDispatch } from 'react-redux';
import { addBookToCart } from '../../redux/cartSlicer';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import { AddFavoriteBook, RemoveFavoriteBook } from '../../redux/favoritesAction';


function DisplayBook({item}) {
  const user = useSelector(state => state.user.currentUser)
  const favorites = useSelector(state => state.favor.favoritesBook)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  console.log(item)
  const handleClick = function(id){
    navigate("/books/" + id)
  }
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })
  const isTabletOrMobile = useMediaQuery({ query: '(min-width: 800px)' })
  const onFail = (err) => {
    console.log(err)
    toast("Something went wrong")
  }

  const onSuccessAdd = (title) => {
    toast(`"${title}" added to favorites`)
  }

  const onSuccessRemove = (title) => {
    toast(`"${title}" removed from favorites`)
  }
  const handleAddToFavorites = (bookId, title)=>{
    AddFavoriteBook(dispatch, user.Id, bookId, onFail, ()=>{onSuccessAdd(title)})
  }
  
  const handleRemoveFromFavorites = (bookId, title)=>{
    RemoveFavoriteBook(dispatch, user.Id, bookId, onFail, ()=>{onSuccessRemove(title)})
  }

  const handleAddToCart = (bookId, title, status)=>{
    if(status === "Available"){
      dispatch(addBookToCart(bookId))
      toast.success(`"${title}" added to cart`)
    }else{
      toast.warning(`"${title}" is out of stock`)
    }
  }
  

  return (
    <div className='BookItem' >
        <div className='item'>
            {user ? favorites.includes(item.Id) ? 
              <AiFillHeart  className='heart' onClick={() => handleRemoveFromFavorites(item.Id, item.Title)}/> 
              : 
              <AiOutlineHeart  className='heart' onClick={() => handleAddToFavorites(item.Id, item.Title)}/>
              :
              <></>
            } 
            <p className='title'>{item.Title}</p>
            <img src={item.CoverImg} alt="img" onClick={() => handleClick(item.Id)}/>
            <div className="buttons">
                <button onClick={() => handleClick(item.Id)}>View Detail</button>
                <button onClick={() => handleAddToCart(item.Id, item.Title, item.Status)}>Add to Cart</button>
            </div>
        </div>
    </div>
  )
}

export default DisplayBook