import React, { useState } from 'react';
import "./Login.scss"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { publicRequest, userRequest } from '../../requestMethods';
import { useDispatch } from 'react-redux';
import { setUserAction } from '../../redux/userAction';
import { useNavigate } from 'react-router-dom';
import { SetFavoriteBooks } from '../../redux/favoritesAction';
import { onLoading, offLoading } from '../../redux/loadingSlicer';


function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({})

  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  const sendData = async () =>{
    try{
      dispatch(onLoading())
      const res = await publicRequest.post("/Auth/login", inputs)
      toast("You have login successfully")
      await sleep(500);
      setUserAction(dispatch, res.data)
      SetFavoriteBooks(dispatch, res.data.Favorites)
      dispatch(offLoading())
      userRequest.defaults.headers.Authorization = `Bearer ${localStorage.getItem('Token')}`
    } catch(err){ 
      toast("Wrong email or password. Please try again")
      dispatch(offLoading())
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
    <div>
        <div className="containerLogin">
          <form className="form-1" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label for="email">Email</label>
            <input type="email" name="email" id="email" required onChange={handleChange}/>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" required onChange={handleChange}/>
            <span>Forgot Password</span>
            <button className='ButtonLogin' type='submit'>Login</button>
          </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login