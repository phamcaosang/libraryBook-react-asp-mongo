import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import {publicRequest} from "../../requestMethods"
import { useLocation, useNavigate } from "react-router-dom";
import "./BookDetail.scss"
import ListByContent from '../../components/listByContent/ListByContent'
import NavBar from '../../components/navbar/NavBar';
import { useDispatch } from 'react-redux';
import { addBookToCart } from '../../redux/cartSlicer';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { AddFavoriteBook, RemoveFavoriteBook } from '../../redux/favoritesAction';
import Skeleton from 'react-loading-skeleton';

function BookDetail() {
  const user = useSelector(state => state.user.currentUser)
  const favorites = useSelector(state => state.favor.favoritesBook)
  const navigate = useNavigate()
  const location = useLocation();
  const bookId = location.pathname.split("/")[2]
  const [book, setBook] = useState({})
  const dispatch = useDispatch();

  const handleAddToCart = (bookId, title)=>{
    try{
      dispatch(addBookToCart(bookId))
      toast(`"${title}" added to cart`)
    } catch(err){
      toast("Fail for product adding to cart")
    }
  }

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

  useEffect(() => {
    const getProduct = async () => {
      try {
        let {data} = await publicRequest.get("/Books/" + bookId);  
        setBook({...data, genres: data.genres});
      } catch (err){
        navigate("/")
      }
    };
    getProduct();
  }, [bookId]);


  return (
    <>
      <NavBar/>
      <div className='BookDetail'>
        <div className = "DetailContent">
          <div className='LeftSide'>
            {
              book.CoverImg ? 
              <img src={book.CoverImg} alt="product" className='cover' />
              :
              <Skeleton className='cover_temp'/>
            }
            <div className='BottomContent1000_720'>
              <div className = "rating">
                <p><b>Number of Ratings</b>: {book.NumRatings || <Skeleton />}</p>
                <p><b>Liked Percentage</b>: {book.LikedPercent || <Skeleton />}</p>
                <p><b>Rating score</b>: {book.Rating || <Skeleton />}</p>
              </div>
              <div className='ButtonOption'>
                <button onClick={() => handleAddToCart(book.Id, book.Title)}>Add to Cart</button>
              </div>
              {user && 
              <div className='ButtonOption'>
                {favorites.includes(book.Id) ? 
                  <button onClick={() => handleRemoveFromFavorites(book.Id, book.Title)}>Remove from Favorites</button>
                  :
                  <button onClick={() => handleAddToFavorites(book.Id, book.Title)}>Add to Favorites</button>
                  
                }
                
              </div>
              } 
            </div>
          </div>
          <div className='RightSide'>
            <div className='TopContent'>
              <p><b>Title</b>: {book.Title || <Skeleton width={150}/>}</p>
              <p><b>Series</b>: {book.Series || <Skeleton width={150}/>}</p>
              <p><b>Author</b>: {book.Author || <Skeleton width={150}/>}</p>
              <p><b>Language</b>: {book.Language || <Skeleton width={150}/>}</p>
              <p><b>Book Format</b>: {book.BookFormat || <Skeleton width={150}/>}</p>
              <p><b>Pages</b>: {book.Pages || <Skeleton width={150}/>}</p>
              <p><b>Publisher</b>: {book.Publisher || <Skeleton width={150}/>}</p>
              <p><b>Publish Date</b>: {book.PublishDate || <Skeleton width={150}/>}</p>
            </div>
            <p className='Category'><b>Genres</b>: {book.Genres ? book.Genres.join(", ") : <Skeleton width={300} height={30}/>}</p>
            <p className='Description'><b>Description</b>: {book.Description || <Skeleton width={380} height={200}/>}}</p>
            <div className='BottomContent'>
              <div className = "rating">
                <p><b>Number of Ratings</b>: {book.NumRatings || <Skeleton width={150}/>}</p>
                <p><b>Liked Percentage</b>: {book.LikedPercent || <Skeleton width={150}/>}</p>
                <p><b>Rating score</b>: {book.Rating || <Skeleton width={150}/>}</p>
                <p><b>Price</b>: {book.Price || <Skeleton width={150}/>} $</p>
              </div>
              <div className='ButtonOption'>
                {
                  book.Status === "Available"  ?
                  <button onClick={() => handleAddToCart(book.Id, book.Title)}>Add to Cart</button>
                  :
                  <button>Out of Stock</button>
                }
              </div>
              {user && 
              <div className='ButtonOption'>
                {favorites.includes(book.Id) ? 
                  <button onClick={() => handleRemoveFromFavorites(book.Id, book.Title)}>Remove from Favorites</button>
                  :
                  <button onClick={() => handleAddToFavorites(book.Id, book.Title)}>Add to Favorites</button>
                  
                }
                
              </div>
              }
              
            </div>


          </div>
        </div>
        {book.Genres && book.Genres.length > 0 && 
           
          <div className="CategoryRecommendation">
            <p className='Similar'>Similar Content: </p>
            <ListByContent data = {{bookNames: book.Recommendations, bookId, num: 10}}/>
          </div>
        }

      </div>
    </>
  )
}

export default BookDetail
