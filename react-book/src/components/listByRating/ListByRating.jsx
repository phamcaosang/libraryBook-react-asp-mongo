import React from 'react'
import "./ListByRating.scss"
import { useEffect } from 'react';
import { useState } from 'react';
import { publicRequest } from '../../requestMethods';
import DisplayBook from '../displayBook/DisplayBook'
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'
import DisplayBookSkeleton from '../displayBookSkeleton/DisplayBookSkeleton';

function ListByRating({quantity}) {
    const [ratingBooks, setratingBooks] = useState([]);
    useEffect(()=>{
        const getTopBooks = async () =>{
            const {data} = await publicRequest.get("/Books/rating");
            setratingBooks(data)
        }
        getTopBooks()
    }, [])
  return (
    <>
      <Link to ="books/rating" style={{textDecoration: "none"}}><p className='top_popular'>Top rating books</p></Link>
        <div className='ListByRating'>
            {ratingBooks.slice(0, quantity).map(item => 
              <DisplayBook item = {item} key= {item.Id}/>)
            }
            {ratingBooks.length === 0 && [...Array(10000).keys()].slice(0, quantity).map(item => <DisplayBookSkeleton />)}
        </div>
    </>
  )
}

export default ListByRating