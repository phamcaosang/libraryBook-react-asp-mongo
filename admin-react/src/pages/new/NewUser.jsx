import React from 'react'
import './new.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { toast, ToastContainer } from 'react-toastify';
import { userRequest } from '../../requestMethods';

const NewUser = ({inputs, title}) => {
  const [file, setFile] = useState("")

  const uploadImageAndData = async(data) =>{
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        toast("Upload is " + progress + "% done", {autoClose: 1500})
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
        toast("Update Avatar fail")
        return error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          try{
            await userRequest.post("User/", {...data, Avatar: downloadURL})
            toast("New user added successfully", {autoClose: 1500})
          } catch(err){
            console.log(err)
            toast("Email duplicate", {autoClose: 1500})
          }
         
        });
      }
    );
  }
  const handleSubmit = async (e)=>{
    e.preventDefault()
    let data = {}
    for (let i = 0; i< e.target.length; i++){
      data = {...data, [e.target[i].name]: e.target[i].value}
    }
    if(data.Avatar){
      uploadImageAndData(data)
    }else{
      try{
        await userRequest.post("User/", data)
        toast("New user added", {autoClose: 1500})
      } catch(err){
        console.log(err)
        toast("Email duplicate", {autoClose: 1500})
      }
    }
  }
  return (
    <div className='new'>
      <Sidebar />
        <div class="newContainer">
            <Navbar/>
            <div className="top">
              <h1>{title}</h1>
            </div>
            <div className="bottom">
              <div className="left">
                <img 
                  src={file ? URL.createObjectURL(file): "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} 
                  alt="" 
                />
              </div>
              <div className="right">
                <form onSubmit={handleSubmit}>
                  <div className="formInput">
                    <label htmlFor='file'>
                      Avatar: <DriveFolderUploadOutlinedIcon className='icon' style={{marginLeft: "24px", position: "relative", top: "6px", fontSize: "30px"}}/>
                      </label>
                    <input 
                      type="file" 
                      id='file' style={{display: "none"}}
                      onChange = {e => setFile(e.target.files[0])}
                      name = "Avatar"
                      />
                  </div>
                  {inputs.map(input => (
                    <div className="formInput" key = {input.id} style={{marginTop: "15px"}}>
                      <label style={{width: "80px", display: "inline-block"}}>{input.label}</label>
                      <input type={input.type} required name = {input.label} placeholder={input.placeholder} />
                    </div>
                  ))}
                  <button type='submit' style={{marginTop: "15px", cursor: "pointer", padding: "5px"}}>Send</button>
                </form>
              </div>
            </div>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default NewUser