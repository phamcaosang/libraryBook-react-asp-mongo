import React from 'react'
import Skeleton from 'react-loading-skeleton'
function DisplayBookSkeleton() {
  return (
    <div className='BookItem'>
        <div className='item'>
            <Skeleton height={400} style={{borderRadius: "10px 60px 10px 60px"}}/>    
        </div>
    </div>
  )
}

export default DisplayBookSkeleton