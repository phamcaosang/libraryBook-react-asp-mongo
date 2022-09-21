import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import NavBar from '../../components/navbar/NavBar'
import { publicRequest, userRequest } from '../../requestMethods'
import {toast } from 'react-toastify';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import "./Profile.scss"
import Favorites from '../../components/favorites/Favorites'
import { useDispatch } from 'react-redux'
import { logOutUserAction } from '../../redux/userAction'
import { onLoading, offLoading } from '../../redux/loadingSlicer';


function Profile() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.currentUser)
  const [data, setData] = useState({})
  const [tempImgUrl, setTempImgUrl] = useState(null)
  const [file, setFile] = useState(null)
     const getData = async()=>{
      try{
        dispatch(onLoading())
        const res = await userRequest.get("User/" + user.Id)
        setData(res.data)
      }catch(err){
        console.log(err)
      }finally{
        dispatch(offLoading())
      }
    }
 
  useEffect(()=>{
    getData()
  }, [])






  const handleChange = (e)=>{
    console.log("change")
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  const handleFile = (file)=>{
    setFile(file)
    setTempImgUrl(URL.createObjectURL(file))
  }

  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }


  const sendData = async () =>{
    console.log("hi")
    try{
      dispatch(onLoading())
      if(user.Email !== data.email){
        await publicRequest.get("Auth/email/" + data.email)
      }
      await userRequest.put("User/" + user.Id, data)
      toast("Update succesfully")
      if(user.Email !== data.email){
        toast("You need to login again due to email changes!!")
        await sleep(3000);
        logOutUserAction(dispatch)
      }
    } catch(err){ 
      console.log(err)
      toast("Email already in use")
    }finally{
      dispatch(offLoading())
    }
  }
  

  const handleUpdateAvatar = () => {
    dispatch(onLoading())
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        toast("Upload is " + progress + "% done")
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        console.log(error)
        toast("Update Avatar fail")
        window.location.href = "/"
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const updatedData = { ...data, Avatar: downloadURL};
          setData(updatedData)
          setTempImgUrl(null)
          const upDateAvatar = async()=>{
            try{
              await userRequest.put("User/avatar/" + user.Id, {avatar: downloadURL})
              toast("Updated Avatar Successfully")
            }catch(err){
              console.log(err)
              toast("Failed in updating avatar")
            }finally{
              dispatch(offLoading())
            }
          }
          upDateAvatar()
        });
      }
    );
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    sendData()
  }


  
  return (
    <>
      <NavBar/>
      <div className='Profile'>
        <div className='Container'>
            <div className='Left'>
                <div className='IMG'>
                  {!data.Avatar &&    
                  <>
                    <img src="https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg" alt="default" />
                    {tempImgUrl && <img src={tempImgUrl} className ="upload" alt="upload" />}       
                  </>
                  }
                  {data.Avatar &&    
                  <>
                    <img src={data.Avatar} alt="currentAvatar" />
                    {tempImgUrl && <img src={tempImgUrl} className ="upload" alt="upload" />}       
                  </>
                  }
                </div>

                {!tempImgUrl ? 
                  <label htmlFor="file" className="uploadBtn">Upload IMG</label> : 
                  <label className="uploadBtn" onClick={handleUpdateAvatar}>Update Avatar</label>
                }
                
                <input type="file" id="file" onChange={(e) => handleFile(e.target.files[0])}/>
                <form className='form' onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id= "username" name="username" placeholder = {data.Username} required onChange={handleChange}/>
                    <label htmlFor="fullname">Fullname</label>
                    <input type="text" id= "fullname" name="fullname" placeholder = {data.Fullname} required onChange={handleChange}/>
                    <label htmlFor="email">Email</label>
                    <input type="text" id= "email" name="email" placeholder = {data.Email} required onChange={handleChange}/>
                    <label htmlFor="phone">Phone</label>
                    <input type="text" id= "phone" name="phone" placeholder = {data.Phone} required onChange={handleChange}/>
                    <label htmlFor="address">Address</label>
                    <input type="text" id= "address" name="address" placeholder = {data.Address} required onChange={handleChange}/>
                    <button type='submit'>Update Profile</button>
                </form>
            </div>
            <div className='Right'>
            <Favorites />
            </div>
        </div>
      </div>
    </>
  )
}

export default Profile