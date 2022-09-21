import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { publicRequest } from '../../requestMethods';
import DisplayBook from '../displayBook/DisplayBook';
import DisplayBookSkeleton from '../displayBookSkeleton/DisplayBookSkeleton';

import "./ListByFavoriteRecommend.scss"

function ListByFavoriteRecommend({quantity}) {
    const favor = useSelector(state => state.favor.favoritesBook)
    const [recommendBooks, setRecommendBooks] = useState([]);
    useEffect(()=>{
        const getFavorBooks = async () =>{
            const favorBooks= await Promise.all(
              favor.map(item => publicRequest.get("/Books/" + item).then(res => res.data).catch(err => ""))
            )
            let myRecBookNames = []
            favorBooks.forEach(element => {
              myRecBookNames.push(...element.Recommendations)
            });

            let RecBooks = await Promise.all(
              myRecBookNames.map(item => publicRequest.get("/Books/title/" + item).then(res => res.data).catch(err => ""))
            )
            RecBooks = RecBooks.filter(item => item !== "")
            const shuffled = RecBooks.sort(() => 0.5 - Math.random());
            let selected = shuffled.slice(0, quantity);

            setRecommendBooks(selected)
        }
        getFavorBooks()
    }, [])
  return (
    <>
      <Link to ="books/recommendations" style={{textDecoration: "none"}}><p className='top_popular'>Your Recommendation</p></Link>
        <div className='ListByPopularity'>
            {recommendBooks.map(item => <DisplayBook item = {item} key= {item.Id}/>)}
            {recommendBooks.length === 0 && [...Array(1000).keys()].slice(0, quantity).map(item => <DisplayBookSkeleton />)}
        </div>
    </>
  )
}

export default ListByFavoriteRecommend