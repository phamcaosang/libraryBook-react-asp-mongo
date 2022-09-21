import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { publicRequest } from '../../requestMethods';
import DisplayBook from '../displayBook/DisplayBook'
import "./ListByPopularity.scss"
import DisplayBookSkeleton from '../displayBookSkeleton/DisplayBookSkeleton';

function ListByPopularity({quantity}) {
    const [popularBooks, setPopularBooks] = useState([]);
    useEffect(()=>{
        const getTopBooks = async () =>{
            const {data} = await publicRequest.get("/Books/popularity");
            setPopularBooks(data)
        }
        getTopBooks()
    }, [])
  return (
    <>
      <Link to ="books/popularity" style={{textDecoration: "none"}}><p className='top_popular'>Popular books</p></Link>
        <div className='ListByPopularity'>
            {popularBooks.slice(0, quantity).map(item => <DisplayBook item = {item} key= {item.Id}/>)}
            {popularBooks.length === 0 && [...Array(10000).keys()].slice(0, quantity).map(item => <DisplayBookSkeleton />)}
        </div>
    </>
  )
}

export default ListByPopularity