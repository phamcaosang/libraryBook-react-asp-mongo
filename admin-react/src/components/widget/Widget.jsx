import React, { useEffect, useState } from 'react'
import './widget.scss'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import Skeleton from 'react-loading-skeleton'
import { userRequest } from '../../requestMethods'

const Widget = ({type}) => {
    let info;
    //temporary
    // const amount = 100;
    const [amount, setAmount] = useState(null)
    // const diff = 20   
    switch(type){
        case 'user':
            info = {
                title: "USERS",
                isMoney: false,
                link: "See all users",
                api: "User/stats/totalUSers",
                icon: <PersonOutlinedIcon
                    className = "icon" 
                    style={{
                        color: "crimson",
                        backgroundColor: "rgba(255, 0, 0, 0.2)"
                    }}
                />
            }
            break;
            case 'order':
                info = {
                    title: "ORDERS",
                    isMoney: false,
                    link: "View all orders",
                    api: "Transaction/stats/totalOrder",
                    icon: <ShoppingCartOutlinedIcon  
                        className = "icon"
                        style={{
                            color: "goldenrod",
                            backgroundColor: "rgba(218, 165, 32, 0.2)"
                        }}
                    />
                }
                break;
            case 'earning':
                info = {
                    title: "EARNING",
                    isMoney: true,
                    link: "View earning",
                    api: "Transaction/stats/totalOrder",
                    icon: <MonetizationOnOutlinedIcon
                        className = "icon"
                        style={{
                            color: "green",
                            backgroundColor: "rgba(0, 128, 0, 0.2)"
                        }}
                    />
                }
                break;
            case 'book':
                info = {
                    title: "BOOKS",
                    isMoney: false,
                    link: "View books",
                    api: "Books/stats/numBook",
                    icon: <AccountBalanceWalletOutlinedIcon
                        className = "icon"
                        style={{
                            color: "purple",
                            backgroundColor: "rgba(128, 0, 128, 0.2)"
                        }}
                    />
                }
                break;
        default:
            break;
    }

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const {data} = await userRequest.get(info.api)
                setAmount(data)
            }
            catch(err){
                console.log(err)
            }
        }
        fetchData()
    }, [info])
  return (
    <div className='widget'>
        <div className="left">
            <span className="title">
                {info.title}
            </span>
            <span className="counter">
                {info.isMoney && "$"} {amount || <Skeleton height = {24} width = {32}/>}
            </span>
            <span className="link">
                {info.link}
            </span>
        </div>
        <div className="right">
            {/* <div className="percentage positive">
                <KeyboardArrowUpIcon/>
                {diff}%
            </div> */}
            {info.icon}
        </div>
    </div>
  )
}

export default Widget