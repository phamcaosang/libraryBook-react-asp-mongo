import React from 'react'
import "./Home.scss"
import NavBar from '../../components/navbar/NavBar';
import ListByPopularity from '../../components/listByPopularity/ListByPopularity';
import ListByRating from '../../components/listByRating/ListByRating';
import { useSelector } from 'react-redux';
import ListByFavoriteRecommend from '../../components/listByFavoriteRecommend/ListByFavoriteRecommend';

function Home() {
  //const user = useSelector(state => state.user.currentUser)
  const favor = useSelector(state => state.favor.favoritesBook)
  return (
    <>
      <div className='Home'>
        <NavBar />
        {favor.length > 0 && <ListByFavoriteRecommend quantity = {5}/>}
        <ListByPopularity quantity = {5}/>
        <ListByRating quantity = {5}/>
      </div>
    </>
  )
}

export default Home