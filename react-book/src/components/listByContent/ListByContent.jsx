import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { publicRequest } from '../../requestMethods';
import DisplayBook from '../displayBook/DisplayBook';
import "./ListByContent.scss"

function ListByGenres({data}) {
    const [books, setBooks] = useState([])
    useEffect(()=>{
        const getBookByNames = async () =>{
            const fetchBooks =  await Promise.all(data.bookNames.map(item => {
              return publicRequest.get(`/Books/title/${item}`).then(res => res.data).catch(err => {
                console.log(err)
                return ""
              })
            })) 
            setBooks(fetchBooks)
        }
        getBookByNames()
    }, [data.bookId, data.bookNames])

  return (
    <div className='ListByGenres'>
        <div className="items">
          {books?.filter(item => item.Id !== data.bookId).slice(0, data.num).map((item) => item && <DisplayBook item = {item} key = {item.Id}/>)}
        </div>
    </div>
  )
}

export default ListByGenres