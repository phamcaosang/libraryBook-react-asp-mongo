import React from 'react'
import ReactLoading from "react-loading";
import "./Loading.scss"

function Loading() {
    console.log("test loading")
  return (
    <div className='Loading'>
        <ReactLoading type={"spinningBubbles"} color="#fff" width={100} height={100}/>
    </div>
  )
}

export default Loading