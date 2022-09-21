import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./SearchBarResult.scss"

function SearchBarResult({items}) {
    const navigate = useNavigate()
    const handleNavigate = (id)=>{
        navigate("/books/" + id)
    }
  return (
      <>
        {items.length !== 0 && 
            items.map(item => (
                <div className='Item' onClick={() => handleNavigate(item.Id)}>
                    <img src={item.CoverImg} alt="img" /> 
                    <p>{item.Title}</p>
                </div>
            ))
        }

        {items.length === 0 && 
            <div className='Item'>No result found</div>
        }
      </>
  )
}

export default SearchBarResult