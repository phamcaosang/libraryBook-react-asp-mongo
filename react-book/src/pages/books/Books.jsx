import React from 'react'
import DisplayBook from '../../components/displayBook/DisplayBook'
import "./Books.scss"
import { useState } from 'react';
import { useEffect } from 'react';
import { publicRequest } from '../../requestMethods';
import NavBar from '../../components/navbar/NavBar';
import { useSelector } from 'react-redux';
import DisplayBookSkeleton from '../../components/displayBookSkeleton/DisplayBookSkeleton';

function Books() {
  const [topBooks, setTopBooks] = useState([]);
  const path = window.location.pathname.split("/")[2]
  const favor = useSelector(state => state.favor.favoritesBook)
  useEffect(()=>{
    const getTopBooks = async () =>{
        if (path === "recommendations"){
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
          setTopBooks(RecBooks.filter(item => item !== ""))
        }else{
          const type = path ? `/${path}` : "" 
          const {data} = await publicRequest.get("/Books" + type);
          setTopBooks(data)
        }
    }
    getTopBooks()
}, [path])
  
  return (
    <>
      <NavBar/>
      <div className='Books'>
        <div class= "Title_page">
          {path === "popularity" && "Top Popular Books"} 
          {path === "rating" && "Top Rating Books"}
          {path === "recommendations" && "Your Recommendations Books"} 
        </div>
        <div className="container">
          <div className="items">
            {topBooks.map((item) => <DisplayBook item = {item} key = {item.Id}/>)}
            {topBooks.length === 0 && [...Array(20).keys()].map(item => <DisplayBookSkeleton/>)}
            
          </div>
        </div>
      </div>
    </>
  )
}

export default Books