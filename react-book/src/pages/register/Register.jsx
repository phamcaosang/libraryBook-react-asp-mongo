import React, { useState } from 'react';
import "./Register.scss"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { publicRequest } from '../../requestMethods';
import { useNavigate } from "react-router-dom";

function Register() {
  let navigate  = useNavigate();
  const [inputs, setInputs] = useState({})

  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  const sendData = async () =>{
    try{
      const res= await publicRequest.post("/Auth/register", inputs)
        toast(res.data)
        await sleep(2000);
        navigate('/login')
        toast(res.data)
    } catch(err){ 
      toast("Duplicate email or server errors. Please try again")
    }
  }
  
  const handleChange = (e)=>{
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    let isValid = true
    console.log(inputs.password, inputs.repassword)
    if (inputs.password !== inputs.repassword){
      toast("Wrong password confirm")
      isValid = false
    }
    if (inputs.password.length < 6){
      toast("Password must be from 6 characters")
      isValid = false
    }

    isValid && sendData()
    
  }
  return (
    <div>
        <div className="containerRegister">
          <form className="form-1" onSubmit={handleSubmit}>
            <h1>Register</h1>
            <label for="email">Email</label>
            <input type="email" name="email" id="email" placeholder = "Email" required onChange={handleChange}/>
            <label for="username">Username</label>
            <input type="text" name="username" id="username" placeholder = "Username" required onChange={handleChange}/>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" placeholder = "Password" required onChange={handleChange}/>
            <label for="repassword">Confirm Password</label>
            <input type="password" name="repassword" id="repassword" placeholder = "Confirm Password" required onChange={handleChange}/>
            <span>Already have account?</span>
            <button className='ButtonRegister' type='submit'>Register</button>
          </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Register