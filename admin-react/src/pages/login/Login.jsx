import React from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {publicRequest, userRequest} from "../../requestMethods"
import { ToastContainer, toast } from 'react-toastify';
import {setUserAction} from "../../redux/userAction"
import './login.scss'
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({})

  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  const sendData = async () =>{
    try{
      console.log(inputs)
      const res = await publicRequest.post("/Auth/login", inputs)
      if (res.data.Role === "User"){
        toast.error("You have not been authorized!!")
        return 
      }
      toast.success("You have login successfully")
      await sleep(1000);
      setUserAction(dispatch, res.data)
      userRequest.defaults.headers.Authorization = `Bearer ${localStorage.getItem('Token')}`
      navigate("/")
    } catch(err){ 
      toast.error("Wrong email or password. Please try again")
    }
  }
  
  const handleChange = (e)=>{
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    sendData()
  }
  return (
    <div className='Login'>
      <form onSubmit={handleSubmit}>
        <div className="box">
          <h1>Dashboard</h1>
          <div className='content'>
            <div className='Left'>
              <input type="email" name="email"  className="input" placeholder='Email' onChange={handleChange} required/>
              <input type="password" name="password" className="input"  placeholder='Password' onChange={handleChange} required/>
            </div>
            <div className='Right'>
              <button className="btn" type='submit'>Sign In</button>   
            </div>
          </div>
          </div>
      </form>
      <ToastContainer/>
    </div>
  )
}

export default Login