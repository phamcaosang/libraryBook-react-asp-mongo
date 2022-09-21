import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Favorites.scss"
import { userRequest } from '../../requestMethods';
import { useState } from 'react';
import { RemoveFavoriteBook } from '../../redux/favoritesAction';
import { toast } from 'react-toastify';

function Favorites() {
    const user = useSelector(state => state.user.currentUser)
    const favorites =useSelector(state => state.favor.favoritesBook)
    const dispatch = useDispatch();

    let [favoriteBooks, setFavoriteBooks] = useState([])
    useEffect(()=>{
        const getFavorites = async()=>{
            const {data} = await userRequest.get("/User/favorites/get/" + user.Id)
            setFavoriteBooks(data)
        }
        getFavorites()
    }, [favorites])
    
    const onFail = (err) => {
      console.log(err)
      toast("Something went wrong")
    }
  
    const onSuccessRemove = (title) => {
      toast(`"${title}" removed from favorites`)
    }

    const handleRemoveFromFavorites = (bookId, title)=>{
      RemoveFavoriteBook(dispatch, user.Id, bookId, onFail, ()=>{onSuccessRemove(title)})
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
        { field: "Series", headerName: "Series", width: 400 },
        { field: "Pages", headerName: "Pages", width: 70 },
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
                  onClick={() => handleRemoveFromFavorites(params.row.Id, params.row.Title)}
                />
              </>
            );
          },
        },
      ];
  return (
    <div style={{ height: '91%', width: '100%'}}>
      <h2>My Favorite Books</h2>
      <DataGrid
        className='dataGrid'
        rows={favoriteBooks}
        columns={columns}
        getRowId = {row => row.Id}
        pageSize={10}
        rowsPerPageOptions={[6]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  )
}

export default Favorites